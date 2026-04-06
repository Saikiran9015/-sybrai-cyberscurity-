"use client";

import { motion } from "framer-motion";

export default function AIBrainAnimation() {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center scale-110">
      {/* Outer Glow Circles */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-48 h-48 rounded-full bg-cyan-neon/10 blur-3xl pointer-events-none"
      />
      
      {/* Brain SVG Placeholder (Geometric/Neural Network style) */}
      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
        {/* Connection Lines (Synapses) */}
        {[...Array(12)].map((_, i) => (
          <motion.path
            key={i}
            d={`M120 120 L${(120 + Math.cos(i * 30 * Math.PI / 180) * 80).toFixed(4)} ${(120 + Math.sin(i * 30 * Math.PI / 180) * 80).toFixed(4)}`}
            stroke={i % 2 === 0 ? "var(--color-cyan-neon)" : "var(--color-purple-neon)"}
            strokeWidth="1"
            strokeOpacity="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 3 + i % 3, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}

        {/* Neural Nodes */}
        {[...Array(12)].map((_, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={(120 + Math.cos(i * 30 * Math.PI / 180) * 80).toFixed(4)}
            cy={(120 + Math.sin(i * 30 * Math.PI / 180) * 80).toFixed(4)}
            r="4"
            fill={i % 2 === 0 ? "var(--color-cyan-neon)" : "var(--color-purple-neon)"}
            animate={{
              opacity: [0.3, 1, 0.3],
              r: [4, 6, 4],
              filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        {/* Central Intelligence Core */}
        <motion.circle
          cx="120"
          cy="120"
          r="20"
          fill="url(#coreGradient)"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <defs>
          <radialGradient id="coreGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(120 120) rotate(90) scale(20)">
            <stop stopColor="var(--color-cyan-neon)" />
            <stop offset="1" stopColor="var(--color-purple-neon)" stopOpacity="0.5" />
          </radialGradient>
        </defs>

        {/* Data Pulses */}
        <motion.circle
          cx="120"
          cy="120"
          r="10"
          stroke="var(--color-cyan-neon)"
          strokeWidth="2"
          animate={{ scale: [1, 4], opacity: [0.8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
        />
      </svg>
      
      {/* HUD Labels */}
      <div className="absolute inset-0 flex items-center justify-center">
         <div className="w-full h-full relative">
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 w-full h-full"
            >
               <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] font-mono text-cyan-neon uppercase tracking-tighter opacity-40">Neural Node Alpha</span>
               <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] font-mono text-purple-neon uppercase tracking-tighter opacity-40">Matrix Predictor</span>
            </motion.div>
         </div>
      </div>
    </div>
  );
}
