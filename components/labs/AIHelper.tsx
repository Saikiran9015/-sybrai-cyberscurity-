"use client";

import { motion } from "framer-motion";
import { Brain, HelpCircle, Star } from "lucide-react";

interface AIHelperProps {
  currentLab: string;
  hint: string;
  xp: number;
}

export default function AIHelper({ currentLab, hint, xp }: AIHelperProps) {
  return (
    <div className="flex flex-col h-full glass-panel rounded-xl p-6 border-white/10">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <div className="p-2 bg-purple-neon/20 rounded-lg">
          <Brain className="w-5 h-5 text-purple-neon" />
        </div>
        <div>
          <h3 className="font-bold text-white tracking-widest text-xs">SYBRAI AI ASSISTANT</h3>
          <p className="text-[10px] text-gray-500 uppercase">Interactive Lab Tutor</p>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <h4 className="text-xs font-bold text-cyan-neon mb-2 uppercase flex items-center gap-2">
            <HelpCircle className="w-4 h-4" /> Lab Objective
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed italic">
            "{currentLab}"
          </p>
        </div>

        <div className="p-4 bg-white/5 rounded-lg border border-white/10 border-dashed">
          <h4 className="text-xs font-bold text-yellow-500 mb-2 uppercase">Pro Tip / Hint</h4>
          <p className="text-sm text-gray-400">
            {hint}
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <div className="text-xs font-bold text-white uppercase">Experience Points</div>
          </div>
          <div className="text-2xl font-orbitron font-bold text-cyan-neon">
            {xp} <span className="text-xs text-gray-500 ml-1">XP</span>
          </div>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
          <motion.div 
            className="h-full bg-cyan-neon"
            initial={{ width: "0%" }}
            animate={{ width: `${(xp % 1000) / 10}%` }}
          />
        </div>
      </div>
    </div>
  );
}
