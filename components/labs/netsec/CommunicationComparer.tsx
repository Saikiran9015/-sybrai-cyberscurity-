"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, ArrowRight, Shield, Terminal, Eye, EyeOff } from "lucide-react";

export default function CommunicationComparer({ onComplete }: { onComplete: () => void }) {
  const [activeTab, setActiveTab] = useState<"http" | "https">("http");
  const [dataSent, setDataSent] = useState(false);
  const [isSecure, setIsSecure] = useState(false);

  const sendData = () => {
    setDataSent(true);
    if (activeTab === "https") {
      setIsSecure(true);
      setTimeout(onComplete, 2000);
    } else {
      setIsSecure(false);
    }
  };

  const plainText = "email=admin@sybrai.io&password=SuperSecure99!";
  const encryptedText = "0x5A 0xE3 0x92 0xF1 0xBC 0x4D 0x3A 0x88 0xCC 0x76 0x1F 0x90 0xEA 0x22 0x33 0xAA 0xFF 0x01";

  return (
    <div className="w-full h-full flex flex-col gap-6 bg-[#0B0B0B] p-8 rounded-3xl border border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-tighter">Secure Communication Test</h3>
          <p className="text-xs text-gray-500 font-mono mt-1 underline decoration-purple-neon">Protocol Comparison: Layer 7 Analysis</p>
        </div>
        <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => { setActiveTab("http"); setDataSent(false); }}
            className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'http' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'text-gray-500 hover:text-white'}`}
          >
            HTTP
          </button>
          <button 
            onClick={() => { setActiveTab("https"); setDataSent(false); }}
            className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'https' ? 'bg-cyan-neon/20 text-cyan-neon border border-cyan-neon/30 glow-cyan' : 'text-gray-500 hover:text-white'}`}
          >
            HTTPS (SSL/TLS)
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8 flex-1 items-center">
        {/* User Node */}
        <div className="md:col-span-3 flex flex-col items-center gap-4">
           <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
              <Terminal className="w-8 h-8 text-white/50" />
              {dataSent && (
                <motion.div 
                   initial={{ scale: 1, opacity: 0 }}
                   animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
                   transition={{ duration: 0.5 }}
                   className="absolute inset-0 rounded-full bg-cyan-neon/20 border border-cyan-neon"
                />
              )}
           </div>
           <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Client Console</div>
        </div>

        {/* Transmission Path */}
        <div className="md:col-span-6 relative h-20 flex items-center justify-center">
           <div className="w-full h-1 bg-white/5 rounded-full relative overflow-hidden">
              <AnimatePresence>
                {dataSent && (
                  <motion.div 
                    initial={{ left: "-20%" }}
                    animate={{ left: "120%" }}
                    transition={{ duration: 1.5, repeat: activeTab === 'http' ? Infinity : 0, ease: "linear" }}
                    className={`absolute h-full w-20 ${activeTab === 'http' ? 'bg-red-500 shadow-[0_0_15px_red]' : 'bg-cyan-neon shadow-[0_0_15px_#00F5FF]'}`}
                  />
                )}
              </AnimatePresence>
           </div>
           <div className="absolute -top-6 text-[8px] font-mono uppercase tracking-[0.4em] text-gray-600">IN-FLIGHT PACKET DATA</div>
           
           {/* Attacker Eye */}
           <div className="absolute -bottom-8 flex flex-col items-center gap-2">
              <motion.div 
                animate={activeTab === 'http' ? { y: [0, -5, 0] } : {}}
                className={`p-2 rounded-lg border ${activeTab === 'http' ? 'bg-red-500/10 border-red-500/50' : 'bg-gray-500/5 border-white/5 opacity-50'}`}
              >
                 {activeTab === 'http' ? <Eye className="w-4 h-4 text-red-500" /> : <EyeOff className="w-4 h-4 text-gray-500" />}
              </motion.div>
              <div className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Interceptor Node</div>
           </div>
        </div>

        {/* Server Node */}
        <div className="md:col-span-3 flex flex-col items-center gap-4">
           <div className={`w-20 h-20 rounded-full border flex items-center justify-center transition-all duration-500 ${activeTab === 'https' ? 'bg-cyan-neon/10 border-cyan-neon shadow-[0_0_30px_#00F5FF33]' : 'bg-white/5 border-white/10'}`}>
              <Shield className={`w-8 h-8 ${activeTab === 'https' ? 'text-cyan-neon' : 'text-white/20'}`} />
           </div>
           <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Remote Server</div>
        </div>
      </div>

      {/* Data Analysis Panel */}
      <div className="grid md:grid-cols-2 gap-4">
         <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-3">
            <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Data Payload Sent</h4>
            <div className="bg-black/50 p-4 rounded-xl border border-white/10 font-mono text-xs text-white">
               {plainText}
            </div>
         </div>

         <div className={`glass-panel p-6 rounded-2xl border-white/5 transition-all duration-500 ${dataSent && activeTab === 'http' ? 'border-red-500/50' : dataSent && activeTab === 'https' ? 'border-cyan-neon/50' : ''} space-y-3`}>
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">What the Sniffer Sees</h4>
              {dataSent && (
                activeTab === 'http' ? (
                  <div className="flex items-center gap-1 text-[8px] text-red-500 font-bold uppercase"><Unlock className="w-3 h-3" /> EXPOSED</div>
                ) : (
                  <div className="flex items-center gap-1 text-[8px] text-cyan-neon font-bold uppercase"><Lock className="w-3 h-3" /> ENCRYPTED</div>
                )
              )}
            </div>
            <div className={`bg-black/50 p-4 rounded-xl border border-white/10 font-mono text-xs ${activeTab === 'http' ? 'text-red-400' : 'text-cyan-neon/70 italic'}`}>
               {dataSent ? (activeTab === 'http' ? plainText : encryptedText) : "[ NO DATA CAPTURED ]"}
            </div>
         </div>
      </div>

      <div className="flex justify-center mt-4">
         <button 
           onClick={sendData}
           className={`px-12 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${activeTab === 'https' ? 'button-primary' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
         >
           {dataSent ? "Data Transmitted" : `Transmit over ${activeTab.toUpperCase()}`}
         </button>
      </div>
    </div>
  );
}
