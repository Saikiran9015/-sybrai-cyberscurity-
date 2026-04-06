"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ThreatDashboard from "./ThreatDashboard"; // Top existing stats

const ThreatGlobe = dynamic(() => import("./ThreatGlobe"), { ssr: false });

const DUMMY_FEED = [
  "⚠️ Malware detected - India",
  "🛡️ DDoS attack mitigated - USA",
  "🚨 Phishing attempt blocked - Germany",
  "⚠️ Unauthorized lateral movement - Brazil",
  "🛡️ Zero-day exploit isolated - UK",
];

export default function GlobalThreatDashboard() {
  const [feed, setFeed] = useState<string[]>([]);
  const [blocked, setBlocked] = useState(24832);

  useEffect(() => {
     // Animate stats
     const interval = setInterval(() => {
        setBlocked(b => b + Math.floor(Math.random() * 10));
        setFeed(prev => {
            const newItem = DUMMY_FEED[Math.floor(Math.random() * DUMMY_FEED.length)];
            return [newItem, ...prev].slice(0, 5); // Keep last 5 feeds
        });
     }, 2000);
     return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto rounded-3xl glass-panel border border-white/10 p-6 md:p-10 my-10 relative overflow-hidden bg-[#0a0a0ab3]">
       <div className="absolute inset-0 bg-gradient-to-br from-cyan-neon/5 to-purple-neon/5 pointer-events-none" />
       
       <div className="text-center mb-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-white mb-2 tracking-wide">
             Real-Time Global Threat Intelligence
          </h2>
          <p className="text-cyan-neon tracking-widest text-sm border border-cyan-neon/20 px-4 py-1 rounded-full inline-block bg-cyan-neon/5">
             LIVE TELEMETRY
          </p>
       </div>

       {/* Top Stats Array */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
           <div className="bg-black/50 border border-white/10 p-6 rounded-xl flex items-center justify-between shadow-[0_0_20px_rgba(0,0,0,0.5)]">
             <div>
                <p className="text-gray-400 text-xs mb-1 uppercase tracking-widest">Attacks Blocked</p>
                <p className="text-4xl font-mono text-cyan-neon font-bold">{blocked.toLocaleString()}</p>
             </div>
             <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 rounded-full bg-cyan-neon shadow-[0_0_10px_#00F5FF]" />
           </div>
           
           <div className="bg-black/50 border border-red-500/20 p-6 rounded-xl flex items-center justify-between shadow-[0_0_20px_rgba(0,0,0,0.5)]">
             <div>
                <p className="text-red-400 text-xs mb-1 uppercase tracking-widest">Active Threats</p>
                <p className="text-4xl font-mono text-red-500 font-bold">132</p>
             </div>
             <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_#FF0055]" />
           </div>

           <div className="bg-black/50 border border-green-500/20 p-6 rounded-xl flex items-center justify-between shadow-[0_0_20px_rgba(0,0,0,0.5)]">
             <div>
                <p className="text-green-400 text-xs mb-1 uppercase tracking-widest">Protected Systems</p>
                <p className="text-4xl font-mono text-green-500 font-bold">10,491</p>
             </div>
             <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_#00FF88]" />
           </div>
       </div>

       {/* Central Display & Side Panel */}
       <div className="flex flex-col lg:flex-row gap-8 relative z-10">
          
          <div className="lg:w-2/3 h-[500px] md:h-[600px] border border-white/10 rounded-2xl bg-black overflow-hidden flex items-center justify-center cursor-grab relative">
             <div className="absolute top-4 left-4 text-xs font-mono text-cyan-neon/50">GLOBE PROTOCOL INTERFACE</div>
             <ThreatGlobe />
          </div>

          <div className="lg:w-1/3 flex flex-col gap-6">
             <div className="flex-1 bg-black/60 border border-white/10 rounded-2xl p-6 h-[250px] overflow-hidden">
                <h3 className="text-white font-orbitron mb-4 border-b border-white/10 pb-2">Live Intrusion Feed</h3>
                <div className="flex flex-col gap-3 font-mono text-xs">
                   <AnimatePresence>
                     {feed.map((f, i) => (
                        <motion.div 
                           key={`${f}-${Math.random()}`} // Hacky unique key to force rerender entry
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, height: 0 }}
                           className={`p-2 rounded bg-white/5 border-l-2 ${f.includes('Malware') || f.includes('Unauthorized') ? 'border-red-500 text-red-300' : 'border-cyan-neon text-cyan-50'}`}
                        >
                           {f}
                        </motion.div>
                     ))}
                   </AnimatePresence>
                </div>
             </div>

             <div className="flex-1 bg-black/60 border border-white/10 rounded-2xl p-6 h-[250px]">
                <h3 className="text-white font-orbitron mb-4 border-b border-white/10 pb-2">Network Stress</h3>
                <div className="w-full h-[150px]">
                   <ThreatDashboard />
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
