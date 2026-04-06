"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Server, Ghost, Shield, ShieldCheck, Zap, AlertTriangle, Terminal } from "lucide-react";

export default function MITMNodeGraph({ onComplete }: { onComplete: () => void }) {
  const [isSecure, setIsSecure] = useState(false);
  const [isAttacked, setIsAttacked] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[*] INITIALIZING NETWORK NODES...",
    "[*] CONNECTION: UNENCRYPTED PORT 80",
  ]);

  const toggleAttack = () => {
    setIsAttacked(!isAttacked);
    const newLog = !isAttacked 
      ? "[!] WARNING: INTERCEPTION DETECTED AT 10.0.0.99" 
      : "[*] ATTACKER DISCONNECTED";
    setLogs(prev => [newLog, ...prev].slice(0, 5));
  };

  const toggleDefense = () => {
    setIsSecure(!isSecure);
    const newLog = !isSecure 
      ? "[+] ENCRYPTION ENABLED: SESSION SECURED" 
      : "[-] ENCRYPTION DISABLED: VULNERABLE";
    setLogs(prev => [newLog, ...prev].slice(0, 5));
    
    if (!isSecure && isAttacked) {
      setTimeout(onComplete, 2000);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
      <div className="flex items-center justify-between z-10">
        <div>
           <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-tighter">MITM Tactical Simulation</h3>
           <p className="text-[10px] text-gray-500 font-mono mt-1">Man-in-the-Middle Defense Logic</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={toggleAttack}
             className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isAttacked ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-white/5 text-gray-400 border border-white/10'}`}
           >
             {isAttacked ? 'Stop Attack' : 'Trigger MITM Attack'}
           </button>
           <button 
             onClick={toggleDefense}
             className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isSecure ? 'bg-cyan-neon text-black shadow-[0_0_20px_#00F5FF]' : 'bg-white/5 text-gray-400 border border-white/10'}`}
           >
             {isSecure ? 'Disable HTTPS' : 'Enable HTTPS'}
           </button>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
         {/* Baseline Path */}
         <div className="absolute w-[70%] h-1 bg-white/5 rounded-full" />
         
         <div className="relative w-full h-[300px] flex items-center justify-between px-20">
            {/* User Node */}
            <div className="flex flex-col items-center gap-4 z-10">
               <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isSecure ? 'bg-cyan-neon/10 border-cyan-neon' : 'bg-white/5 border-white/10'}`}>
                  <User className={`w-8 h-8 ${isSecure ? 'text-cyan-neon' : 'text-gray-500'}`} />
               </div>
               <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold">CLIENT NODE</span>
            </div>

            {/* Connecting Lines & Data Packets */}
            <div className="absolute inset-0 pointer-events-none">
               {/* User to Server Path */}
               <motion.div 
                 animate={{ opacity: isAttacked && !isSecure ? 0.2 : 1 }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-1 bg-gradient-to-r from-transparent via-cyan-neon/20 to-transparent" 
               />

               {/* Data Packets */}
               <AnimatePresence>
                 {isAttacked && !isSecure ? (
                   <>
                    {/* Redirecting to Attacker */}
                    <motion.div 
                       initial={{ left: "25%", top: "45%" }}
                       animate={{ left: "50%", top: "25%" }}
                       transition={{ duration: 1, repeat: Infinity }}
                       className="absolute w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_red]"
                    />
                    <motion.div 
                       initial={{ left: "50%", top: "25%" }}
                       animate={{ left: "75%", top: "45%" }}
                       transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                       className="absolute w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_red]"
                    />
                   </>
                 ) : (
                   <motion.div 
                      key="secure-packet"
                      initial={{ left: "25%", top: "48%" }}
                      animate={{ left: "75%", top: "48%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className={`absolute w-3 h-3 rounded-full ${isSecure ? 'bg-cyan-neon shadow-[0_0_15px_#00F5FF]' : 'bg-white shadow-[0_0_10px_white]'}`}
                   />
                 )}
               </AnimatePresence>
            </div>

            {/* Attacker Node (Top) */}
            <AnimatePresence>
              {(isAttacked || isSecure) && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                >
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isAttacked && !isSecure ? 'bg-red-500/20 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-white/5 border-white/10 opacity-30 animate-pulse'}`}>
                      {isSecure ? <ShieldCheck className="w-8 h-8 text-cyan-neon" /> : <Ghost className={`w-8 h-8 ${isAttacked ? 'text-red-500' : 'text-gray-700'}`} />}
                   </div>
                   <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                    {isSecure ? "ENCRYPTION BLOCK" : "INTERCEPTOR NODE"}
                   </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Server Node */}
            <div className="flex flex-col items-center gap-4 z-10">
               <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isSecure ? 'bg-cyan-neon/10 border-cyan-neon' : 'bg-white/5 border-white/10'}`}>
                  <Server className={`w-8 h-8 ${isSecure ? 'text-cyan-neon' : 'text-gray-500'}`} />
               </div>
               <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold">SERVER NODE</span>
            </div>
         </div>
      </div>

      {/* Terminal Output */}
      <div className="bg-black/50 border border-white/5 p-4 rounded-xl flex items-start gap-4 h-32 overflow-hidden relative">
         <div className="absolute top-0 right-0 p-3 opacity-10">
            <Terminal className="w-20 h-20 text-white" />
         </div>
         <div className="space-y-1 relative z-10">
            {logs.map((log, i) => (
              <div key={i} className={`text-[10px] font-mono uppercase tracking-widest ${log.includes('[!]') ? 'text-red-500' : log.includes('[+]') ? 'text-cyan-neon' : 'text-gray-500'}`}>
                 {log}
              </div>
            ))}
         </div>
      </div>

      {isAttacked && !isSecure && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-red-500/5 pointer-events-none border border-red-500/20 z-[1]"
        />
      )}
    </div>
  );
}
