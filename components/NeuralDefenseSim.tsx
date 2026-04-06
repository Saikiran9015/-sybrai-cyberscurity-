"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, ShieldAlert, Cpu } from "lucide-react";

type Threat = {
  id: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  status: 'approaching' | 'locked' | 'neutralized';
};

export default function NeuralDefenseSim() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [activeLaser, setActiveLaser] = useState<{ x: number, y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Spawn threats randomly
     const spawnInterval = setInterval(() => {
        setThreats(prev => {
            if (prev.length > 5) return prev; // Max 5 at a time
            
            // Random position away from center
            let x = Math.random() * 100;
            let y = Math.random() * 100;
            
            // Push towards edges
            if (x > 30 && x < 70) x = x < 50 ? 10 : 90;
            if (y > 30 && y < 70) y = y < 50 ? 10 : 90;

            return [...prev, { id: Date.now(), x, y, status: 'approaching' }];
        });
     }, 2000);

     return () => clearInterval(spawnInterval);
  }, []);

  useEffect(() => {
     // AI Defense Loop: Target and Neutralize
     const defenseLoop = setInterval(() => {
        setThreats(prev => {
            const newThreats = [...prev];
            const target = newThreats.find(t => t.status === 'approaching');
            
            if (target) {
                target.status = 'locked';
                
                // Fire Laser visual
                setActiveLaser({ x: target.x, y: target.y });
                
                // After 500ms, neutralize
                setTimeout(() => {
                    setThreats(current => 
                       current.map(t => t.id === target.id ? { ...t, status: 'neutralized' } : t)
                    );
                    setActiveLaser(null);
                    
                    // After 1 sec, remove from array
                    setTimeout(() => {
                        setThreats(current => current.filter(t => t.id !== target.id));
                    }, 1000);
                }, 400);
            }
            return newThreats;
        });
     }, 1500);

     return () => clearInterval(defenseLoop);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel border border-red-500/20 rounded-2xl p-4 md:p-8 relative overflow-hidden bg-black/60 shadow-[0_0_30px_rgba(255,0,85,0.1)]">
       {/* UI Header */}
       <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 relative z-20">
          <div className="flex items-center gap-3 text-cyan-neon">
             <Cpu className="w-6 h-6 animate-pulse" />
             <h3 className="font-orbitron font-bold">SYBRAI NEURAL CORE</h3>
          </div>
          <div className="text-xs font-mono border border-cyan-neon/30 text-cyan-neon px-3 py-1 rounded bg-cyan-neon/10">
             AUTONOMOUS DEFENSE: ACTIVE
          </div>
       </div>

       {/* Simulation Arena */}
       <div ref={containerRef} className="w-full h-[400px] bg-[#050505] relative rounded-xl border border-white/5 overflow-hidden radial-grid">
           {/* Center AI Core */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <motion.div 
                 animate={{ scale: [1, 1.2, 1], boxShadow: ["0 0 20px #00F5FF", "0 0 40px #00F5FF", "0 0 20px #00F5FF"] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="w-16 h-16 rounded-full bg-cyan-neon flex items-center justify-center opacity-90"
              >
                 <ShieldAlert className="text-black w-8 h-8" />
              </motion.div>
              <div className="absolute top-full mt-4 text-cyan-neon text-xs font-mono tracking-widest whitespace-nowrap glow-cyan">
                 AI ENGINE
              </div>
           </div>

           {/* Pulse rings from center */}
           <motion.div 
              animate={{ scale: [1, 5], opacity: [0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-cyan-neon/40 pointer-events-none"
           />

           {/* Render Beams */}
           <AnimatePresence>
              {activeLaser && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ filter: "drop-shadow(0 0 10px #00F5FF)" }}>
                      <motion.line 
                         initial={{ strokeDasharray: "0, 1000" }}
                         animate={{ strokeDasharray: "1000, 1000" }}
                         exit={{ opacity: 0 }}
                         transition={{ duration: 0.2 }}
                         x1="50%" y1="50%" 
                         x2={`${activeLaser.x}%`} y2={`${activeLaser.y}%`}
                         stroke="#00F5FF" 
                         strokeWidth="4" 
                      />
                  </svg>
              )}
           </AnimatePresence>

           {/* Render Threats */}
           <AnimatePresence>
             {threats.map(threat => (
                <motion.div
                  key={threat.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                      scale: threat.status === 'neutralized' ? 2 : 1, 
                      opacity: threat.status === 'neutralized' ? 0 : 1,
                      x: `calc(${threat.x}% - 16px)`, // center horizontally
                      y: `calc(${threat.y}% - 16px)` // center vertically
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-0 left-0 w-8 h-8 z-10"
                >
                    {threat.status === 'approaching' && (
                        <div className="relative group flex items-center justify-center">
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1] }} 
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="w-4 h-4 bg-red-600 rounded-full shadow-[0_0_15px_#FF0055]"
                            />
                            <p className="absolute -top-6 text-red-500 text-[10px] whitespace-nowrap font-mono animate-pulse">
                              UNETHICAL ACTOR
                            </p>
                        </div>
                    )}

                    {threat.status === 'locked' && (
                        <div className="relative flex items-center justify-center text-cyan-neon">
                            <Crosshair className="w-8 h-8 animate-spin-slow glow-cyan absolute" />
                            <div className="w-2 h-2 bg-red-600 rounded-full" />
                            <p className="absolute -top-6 text-cyan-neon text-[10px] whitespace-nowrap font-mono">
                              TARGET LOCKED
                            </p>
                        </div>
                    )}

                    {threat.status === 'neutralized' && (
                        <div className="relative flex items-center justify-center">
                            <motion.div 
                              initial={{ scale: 1 }}
                              animate={{ scale: 3, opacity: 0 }}
                              className="w-8 h-8 border-2 border-cyan-neon rounded-full"
                            />
                            <p className="absolute -top-6 text-cyan-neon text-[10px] whitespace-nowrap font-bold">
                              NEUTRALIZED
                            </p>
                        </div>
                    )}
                </motion.div>
             ))}
           </AnimatePresence>
       </div>
       
       <style dangerouslySetInnerHTML={{__html: `
          .radial-grid {
             background-image: 
                 linear-gradient(rgba(0, 245, 255, 0.05) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0, 245, 255, 0.05) 1px, transparent 1px);
             background-size: 40px 40px;
             background-position: center center;
          }
          .animate-spin-slow {
             animation: spin 3s linear infinite;
          }
       `}} />
    </div>
  );
}
