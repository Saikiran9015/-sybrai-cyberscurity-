"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, AlertTriangle, CheckCircle, Terminal, HardDrive } from "lucide-react";

export default function FuzzingSim({ onCrash }: { onCrash: () => void }) {
  const [payloadSize, setPayloadSize] = useState(1);
  const [crashed, setCrashed] = useState(false);
  const [memory, setMemory] = useState<string[]>(Array(16).fill("00"));
  const [logs, setLogs] = useState<string[]>(["[KERNEL] Waiting for input... (Buffer: 64 bytes)"]);

  const updateMemory = (size: number) => {
    const newMem = Array(16).fill("00");
    for (let i = 0; i < Math.min(size / 4, 16); i++) {
      newMem[i] = "41"; // 'A' in Hex
    }
    setMemory(newMem);
  };

  const handleFuzz = (newSize: number) => {
    if (crashed) return;
    setPayloadSize(newSize);
    updateMemory(newSize);
    
    if (newSize > 64) {
      setCrashed(true);
      setLogs(prev => ["🚨 KERNEL PANIC: SEGMENTATION_FAULT", "Instruction Pointer (EIP) Overwritten with 0x41414141", ...prev].slice(0, 5));
      onCrash();
    } else {
      setLogs(prev => [`[INPUT] Received ${newSize} bytes. Memory write stable.`, ...prev].slice(0, 5));
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border-white/5 bg-black/40 min-h-[400px] flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${crashed ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-cyan-neon/10 text-cyan-neon'}`}>
               <Terminal className="w-5 h-5" />
            </div>
            <div>
               <h3 className="font-orbitron font-bold text-white text-sm uppercase tracking-tighter">Memory Fuzzing Module</h3>
               <p className="text-[10px] text-gray-500 font-mono">STATUS: {crashed ? "SYSTEM CRASH" : "LISTENING"}</p>
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 flex-1">
         <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Payload Size (Bytes)</label>
               <input 
                 type="range" 
                 min="1" 
                 max="128" 
                 step="1"
                 value={payloadSize}
                 onChange={(e) => handleFuzz(parseInt(e.target.value))}
                 className="w-full accent-cyan-neon bg-white/5 h-2 rounded-full appearance-none border border-white/10"
                 disabled={crashed}
               />
               <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-700">1 B</span>
                  <span className={payloadSize > 64 ? "text-red-500 font-bold" : "text-cyan-neon"}>{payloadSize} B</span>
                  <span className="text-gray-700">128 B</span>
               </div>
            </div>

            <div className="glass-panel p-4 rounded-xl bg-black font-mono text-[9px] text-gray-600 h-32 overflow-hidden select-none">
               {logs.map((L, i) => (
                  <div key={i} className={i === 0 ? (crashed ? "text-red-500" : "text-cyan-neon") : ""}>{L}</div>
               ))}
            </div>
         </div>

         <div className="space-y-4">
            <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
               <HardDrive className="w-3 h-3" /> Stack Memory View
            </h4>
            <div className="grid grid-cols-4 gap-2">
               {memory.map((hex, i) => (
                  <motion.div 
                     key={i}
                     initial={false}
                     animate={{ 
                        backgroundColor: hex === "41" ? (i >= 12 ? "rgba(239, 68, 68, 0.2)" : "rgba(0, 245, 255, 0.1)") : "rgba(255, 255, 255, 0.05)",
                        borderColor: hex === "41" ? (i >= 12 ? "#ef4444" : "#00F5FF") : "rgba(255, 255, 255, 0.1)"
                     }}
                     className="h-10 rounded border flex items-center justify-center font-mono text-xs text-white"
                  >
                     {hex}
                  </motion.div>
               ))}
            </div>
            <div className="text-[8px] text-gray-700 font-mono text-center uppercase tracking-widest">
               Buffer [0-11] | Return Address (EIP) [12-15]
            </div>
         </div>
      </div>

      <AnimatePresence>
         {crashed && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-4"
            >
               <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
               <div className="flex-1">
                  <h4 className="text-white text-[10px] font-bold uppercase tracking-widest">Exploit Stage Successful</h4>
                  <p className="text-[9px] text-gray-500 font-mono uppercase tracking-[0.1em]">Payload has successfully overwritten the saved return address. System execution flow redirected.</p>
               </div>
               <button onClick={() => { setCrashed(false); setLogs([]); setPayloadSize(1); updateMemory(1); }} className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline">
                  Reset System
               </button>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
