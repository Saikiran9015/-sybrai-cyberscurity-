"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Code, ShieldAlert, Cpu } from "lucide-react";

const hexData = [
  "00 45 4C 46 01 01 01 00 00 00 00 00 00 00 00 00",
  "02 00 03 00 01 00 00 00 54 80 04 08 34 00 00 00",
  "C0 04 00 00 00 00 00 00 34 00 20 00 01 00 28 00",
  "00 00 00 00 01 00 00 00 00 00 00 00 00 80 04 08",
  "55 89 E5 83 EC 18 C7 45 FC 00 00 00 00 EB 14 8B",
  "FF FF FF FF 90 90 90 90 90 90 90 90 90 90 90 90", // Vulnerable shellcode region
  "45 F8 83 45 FC 01 8B 45 FC 3B 45 08 7C E9 90 C9",
];

export default function HexAnalyzer({ onVulnerabilityFound }: { onVulnerabilityFound: () => void }) {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [found, setFound] = useState(false);

  const handleScan = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setFound(true);
      onVulnerabilityFound();
    }, 2500);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border-white/5 bg-black/60 font-mono text-[10px] space-y-6 relative overflow-hidden">
      {/* HUD Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan-neon/10 border border-cyan-neon/20 flex items-center justify-center">
               <Cpu className="w-4 h-4 text-cyan-neon" />
            </div>
            <div>
               <h3 className="text-white font-bold uppercase tracking-widest text-[9px]">Binary Disassembler v2.4</h3>
               <p className="text-gray-600 text-[8px]">OFFSET: 0x08048034 | ARCH: x86_64</p>
            </div>
         </div>
         {!found && (
            <button 
              onClick={handleScan}
              disabled={analyzing}
              className="bg-cyan-neon/10 hover:bg-cyan-neon/20 border border-cyan-neon/30 text-cyan-neon px-4 py-1.5 rounded flex items-center gap-2 transition-all disabled:opacity-50"
            >
               <Search className={`w-3 h-3 ${analyzing ? 'animate-spin' : ''}`} /> {analyzing ? "ANALYZING..." : "SCAN FOR EXPLOITS"}
            </button>
         )}
      </div>

      {/* Hex Grid */}
      <div className="space-y-1 relative">
         {hexData.map((line, i) => (
            <motion.div 
               key={i}
               onMouseEnter={() => setHoveredLine(i)}
               onMouseLeave={() => setHoveredLine(null)}
               className={`flex gap-4 p-1 rounded transition-colors ${hoveredLine === i ? "bg-white/5 text-white" : "text-gray-500"} ${found && i === 5 ? "bg-red-500/10 text-red-500 border border-red-500/20" : ""}`}
            >
               <span className="text-gray-700 w-16">000000{i*10}</span>
               <span className="flex-1 tracking-widest">{line}</span>
               <span className="text-gray-700 opacity-50 px-2 border-l border-white/5 lowercase">
                  {i === 0 ? "ELF.OS..." : i === 5 ? "NOP_SLED" : "ASM.MOV"}
               </span>
            </motion.div>
         ))}

         {/* Scanline Effect */}
         {analyzing && (
            <motion.div 
               animate={{ top: ["0%", "100%", "0%"] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
               className="absolute left-0 right-0 h-[2px] bg-cyan-neon/50 shadow-[0_0_10px_#00F5FF] z-20"
            />
         )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 text-[8px] uppercase tracking-[0.2em] font-bold">
         <div className="flex gap-4">
            <span className="text-gray-600">SECTIONS: <span className="text-white">.text, .data, .rodata</span></span>
            <span className="text-gray-600">FLAGS: <span className="text-green-500">NX, ASLR_OFF</span></span>
         </div>
         {found && (
            <div className="flex items-center gap-2 text-red-500 animate-pulse">
               <ShieldAlert className="w-3 h-3" /> BUFFER OVERFLOW VULNERABILITY IDENTIFIED
            </div>
         )}
      </div>
    </div>
  );
}
