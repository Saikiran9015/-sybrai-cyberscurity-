"use client";

import { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TrialTimer({ expiresAt, onExpire }: { expiresAt: string | Date, onExpire: () => void }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const expiration = new Date(expiresAt).getTime();
      const distance = expiration - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("EXPIRED");
        onExpire();
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpire]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-xl border-cyan-neon/30 bg-cyan-neon/5 relative overflow-hidden group">
      <div className="absolute inset-0 bg-cyan-neon/10 animate-pulse pointer-events-none" />
      <Clock className="w-4 h-4 text-cyan-neon animate-spin-slow" />
      <div className="flex flex-col">
        <span className="text-[8px] text-cyan-neon/60 uppercase font-bold tracking-widest">Trial Access</span>
        <span className="text-sm font-orbitron font-bold text-white tracking-widest">{timeLeft}</span>
      </div>
      {timeLeft === "EXPIRED" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-red-500 flex items-center justify-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-white" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Time Over</span>
        </motion.div>
      )}
    </div>
  );
}
