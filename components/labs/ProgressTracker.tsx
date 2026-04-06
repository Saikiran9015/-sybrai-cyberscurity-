"use client";

import { motion } from "framer-motion";
import { CheckCircle, Circle, Trophy } from "lucide-react";

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function ProgressTracker({ currentStep, totalSteps, steps }: ProgressTrackerProps) {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full glass-panel rounded-xl p-8 border-white/10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-bold text-white text-xl uppercase tracking-widest flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500" /> MISSION PROGRESS
          </h3>
          <p className="text-sm text-gray-500 mt-1 uppercase">Ethical Hacking Course Progression</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-orbitron font-bold text-cyan-neon">
            {Math.round(progressPercent)}% 
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest">Mastery Level</div>
        </div>
      </div>

      <div className="relative flex justify-between">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2 z-0" />
        {/* Active Line */}
        <motion.div 
          className="absolute top-1/2 left-0 h-[2px] bg-cyan-neon -translate-y-1/2 z-0 shadow-[0_0_10px_#00F5FF]"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        />

        {steps.map((step, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;

          return (
            <div key={i} className="relative z-10 flex flex-col items-center">
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                  isCompleted ? "bg-cyan-neon border-cyan-neon shadow-[0_0_15px_#00F5FF]" : 
                  isActive ? "bg-black border-cyan-neon text-cyan-neon" : 
                  "bg-black border-white/20 text-gray-500"
                }`}
                animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {isCompleted ? <CheckCircle className="w-6 h-6 text-black" /> : <Circle className="w-6 h-6" />}
              </motion.div>
              <div className={`mt-4 font-mono text-[10px] uppercase tracking-tighter ${
                isActive ? "text-cyan-neon font-bold" : "text-gray-500"
              }`}>
                {step}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
