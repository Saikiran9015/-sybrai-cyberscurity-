"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Smartphone, Server, Shield, Zap, Info, ChevronRight } from "lucide-react";

export default function VPNTunnelSim({ onComplete }: { onComplete: () => void }) {
  const [vpnActive, setVpnActive] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  const startTransfer = () => {
    setIsTransferring(true);
    setTimeout(() => {
      setIsTransferring(false);
      if (vpnActive) {
        onComplete();
      }
    }, 4000);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 bg-[#090909] p-8 rounded-3xl border border-white/5 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
           <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-tighter">VPN Protocol Simulation</h3>
           <p className="text-[10px] text-gray-500 font-mono mt-1">Virtual Private Network: AES-256 GCM Tunnel</p>
        </div>
        <button 
          onClick={() => setVpnActive(!vpnActive)}
          className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${vpnActive ? 'bg-cyan-neon text-black shadow-[0_0_20px_#00F5FF]' : 'bg-white/5 text-gray-400 border border-white/10'}`}
        >
          <Shield className="w-3 h-3" /> {vpnActive ? 'VPN CONNECTED' : 'VPN DISCONNECTED'}
        </button>
      </div>

      {/* Visual Simulation Area */}
      <div className="flex-1 relative flex items-center justify-between px-10">
        {/* Connection Background Line */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[2px] bg-white/5 rounded-full" />

        {/* User Node */}
        <div className="relative z-10 flex flex-col items-center gap-4">
           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${vpnActive ? 'bg-cyan-neon/10 border-cyan-neon/50 border shadow-[0_0_20px_#00F5FF22]' : 'bg-white/5 border-white/10 border'}`}>
              <Smartphone className={`w-8 h-8 ${vpnActive ? 'text-cyan-neon' : 'text-gray-600'}`} />
           </div>
           <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Mobile Client</span>
        </div>

        {/* Central Tunnel Animation */}
        <div className="flex-1 relative h-32 flex items-center justify-center">
           <AnimatePresence>
             {vpnActive && (
               <motion.div 
                 initial={{ width: 0, opacity: 0 }}
                 animate={{ width: "90%", opacity: 1 }}
                 exit={{ width: 0, opacity: 0 }}
                 className="h-12 bg-cyan-neon/10 border-y border-cyan-neon/30 rounded-full relative flex items-center"
               >
                 {/* Internal Data Flow */}
                 <div className="absolute inset-x-4 h-[2px] bg-cyan-neon/20 overflow-hidden rounded-full">
                    <motion.div 
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-1/2 h-full bg-cyan-neon shadow-[0_0_10px_#00F5FF]"
                    />
                 </div>
                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyan-neon uppercase tracking-widest animate-pulse">
                    ENCRYPTED TUNNEL ACTIVE
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Data Packets (Insecure) */}
           {isTransferring && !vpnActive && (
             <motion.div 
                initial={{ left: "0%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute p-2 bg-red-500/20 border border-red-500 rounded text-[8px] text-red-500 font-bold uppercase tracking-tighter"
             >
                Plaintext Data
             </motion.div>
           )}

           {/* Data Packets (Secure) */}
           {isTransferring && vpnActive && (
             <motion.div 
                initial={{ left: "0%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute"
             >
                <div className="p-2 bg-cyan-neon rounded-lg shadow-[0_0_15px_#00F5FF]">
                   <Lock className="w-3 h-3 text-black" />
                </div>
             </motion.div>
           )}
        </div>

        {/* Server Node */}
        <div className="relative z-10 flex flex-col items-center gap-4">
           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${vpnActive ? 'bg-cyan-neon/10 border-cyan-neon/50 border shadow-[0_0_20px_#00F5FF22]' : 'bg-white/5 border-white/10 border'}`}>
              <Server className={`w-8 h-8 ${vpnActive ? 'text-cyan-neon' : 'text-gray-600'}`} />
           </div>
           <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Target Server</span>
        </div>
      </div>

      {/* Info Stats */}
      <div className="grid grid-cols-2 gap-4">
         <div className="glass-panel p-4 rounded-xl border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
               <Info className="w-4 h-4 text-purple-neon" /> SYSTEM LOGS
            </div>
            <div className="text-[10px] font-mono space-y-1 text-gray-600">
               <div>[*] Handshake protocol: Diffie-Hellman</div>
               <div>[*] Encryption: {vpnActive ? 'AES-256 Bit (Poly1305)' : 'NONE'}</div>
               <div className={vpnActive ? 'text-cyan-neon' : 'text-red-500'}>
                  [*] Path Security: {vpnActive ? 'HIGHLY SECURE' : 'VULNERABLE TO SNIFFING'}
               </div>
            </div>
         </div>
         <div className="flex flex-col justify-center gap-2">
            <button 
              disabled={isTransferring}
              onClick={startTransfer}
              className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isTransferring ? 'bg-white/10 text-gray-500 opacity-50 cursor-not-allowed' : 'button-primary'}`}
            >
              {isTransferring ? 'Transmitting...' : 'Send Test Data'}
            </button>
            <p className="text-[9px] text-center text-gray-600 uppercase tracking-widest">Mission: Send data through the secure tunnel.</p>
         </div>
      </div>
    </div>
  );
}
