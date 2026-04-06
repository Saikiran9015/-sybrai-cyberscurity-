"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Shield, Activity, Lock, Wifi, AlertTriangle } from "lucide-react";

export default function TacticalHUD() {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const messages = [
      "SYSTEM: Link Established",
      "SCAN: Port 443 SECURE",
      "THREAT: Blocked connection from 182.xx.xx.9",
      "SYBRAI: AI Core v4.2 Active",
      "ENCRYPTION: AES-256 Enabled",
      "NODE: Delhi-NCR Node ping 12ms",
      "FIREWALL: Protocol X-Alpha filter on",
      "MONITOR: Traffic clean",
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => [messages[i % messages.length], ...prev].slice(0, 5));
      i++;
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden opacity-40 md:opacity-100">
      {/* Corner Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 border-t-2 border-l-2 border-cyan-neon/30 rounded-tl-3xl" />
      <div className="absolute top-10 right-10 w-32 h-32 border-t-2 border-r-2 border-cyan-neon/30 rounded-tr-3xl" />
      <div className="absolute bottom-10 left-10 w-32 h-32 border-b-2 border-l-2 border-cyan-neon/30 rounded-bl-3xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 border-b-2 border-r-2 border-cyan-neon/30 rounded-br-3xl" />

      {/* Top Console */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex gap-8 text-[10px] font-mono text-cyan-neon/60 tracking-widest uppercase">
         <div className="flex items-center gap-2"><Activity className="w-3 h-3 animate-pulse" /> NETWORK: STABLE</div>
         <div className="flex items-center gap-2"><Lock className="w-3 h-3" /> SECURE MODE</div>
         <div className="flex items-center gap-2"><Shield className="w-3 h-3" /> SHIELD: 100%</div>
      </div>

      {/* Side Scanning Line */}
      <motion.div 
        animate={{ y: ["0%", "100%", "0%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-neon/30 to-transparent shadow-[0_0_15px_#00F5FF33]"
      />

      {/* Live Log Stream (Bottom Left) */}
      <div className="absolute bottom-16 left-16 max-w-xs space-y-1">
        {logs.map((log, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={`${log}-${i}`}
            className="text-[8px] font-mono text-cyan-neon/50 uppercase tracking-tighter"
          >
            {log}
          </motion.div>
        ))}
      </div>

      {/* Right Side Status (Bottom Right) */}
      <div className="absolute bottom-16 right-16 flex flex-col items-end gap-3">
         <div className="flex items-center gap-2 text-cyan-neon/60 text-[10px] font-mono uppercase">
            UPTIME: 99.99% <Wifi className="w-3 h-3" />
         </div>
         <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
               animate={{ width: ["10%", "95%", "40%", "85%"] }}
               transition={{ duration: 10, repeat: Infinity }}
               className="h-full bg-cyan-neon/40 shadow-[0_0_10px_#00F5FF]"
            />
         </div>
      </div>
    </div>
  );
}
