"use client";

import { motion } from "framer-motion";
import { User, Award, Shield, Zap, TrendingUp, ChevronRight, Lock } from "lucide-react";

interface StudentProfileProps {
  user: any;
  onLogout?: () => void;
}

export default function StudentProfile({ user, onLogout }: StudentProfileProps) {
  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const nextLevelXp = level * 1000;
  const progress = (xp / nextLevelXp) * 100;

  const ranks = ["Novice", "Scout", "Technician", "Specialist", "Operative", "Elite"];
  const currentRank = ranks[Math.min(Math.floor((level - 1) / 2), ranks.length - 1)];

  return (
    <div className="flex flex-col gap-6 sticky top-32">
      {/* Profile Card */}
      <div className="glass-panel p-6 rounded-3xl border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <User className="w-24 h-24 text-white" />
        </div>
        
        <div className="flex items-center gap-4 mb-6">
           <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-neon to-purple-neon p-[1px]">
              <div className="w-full h-full bg-[#0A0A0A] rounded-2xl flex items-center justify-center overflow-hidden">
                 <User className="w-8 h-8 text-white/50" />
              </div>
           </div>
           <div>
              <h2 className="text-xl font-orbitron font-bold text-white tracking-tighter">
                {user?.name || "GUEST_USER"}
              </h2>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] text-cyan-neon font-bold uppercase tracking-widest">{currentRank} AGENT</span>
                 <div className="w-1 h-1 rounded-full bg-white/20" />
                 <span className="text-[10px] text-gray-500 uppercase tracking-widest">LVL {level}</span>
              </div>
           </div>
        </div>

        {/* Level Progress */}
        <div className="space-y-2">
           <div className="flex justify-between text-[10px] font-mono tracking-widest">
              <span className="text-gray-500 uppercase">EXPERIENCE POINTS</span>
              <span className="text-white">{xp} / {nextLevelXp} XP</span>
           </div>
           <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-cyan-neon to-purple-neon"
              />
           </div>
        </div>

        <button onClick={onLogout} className="mt-6 text-[9px] text-gray-600 hover:text-red-500 uppercase tracking-[0.2em] transition-colors">
          Terminate Session [LOGOUT]
        </button>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 gap-4">
         <div className="glass-panel p-4 rounded-xl border-white/5 text-center">
            <Zap className="w-4 h-4 text-cyan-neon mx-auto mb-2" />
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Missions</div>
            <div className="text-lg font-orbitron font-bold text-white">
              {user?.isCompleted ? "2" : "0"}
            </div>
         </div>
         <div className="glass-panel p-4 rounded-xl border-white/5 text-center">
            <TrendingUp className="w-4 h-4 text-purple-neon mx-auto mb-2" />
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Rank</div>
            <div className="text-lg font-orbitron font-bold text-white">#{level * 42}</div>
         </div>
      </div>

      {/* Certificates Tray */}
      <div className="glass-panel p-6 rounded-3xl border-white/5">
        <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold mb-4 flex items-center gap-2">
           <Award className="w-3 h-3 text-cyan-neon" /> Verified Credentials
        </h3>
        <div className="space-y-3">
           {!user?.isCompleted ? (
             <div className="p-4 bg-white/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
                <Lock className="w-5 h-5 text-gray-700 mb-2" />
                <p className="text-[8px] text-gray-600 uppercase tracking-widest">No Certifications Issued Yet</p>
             </div>
           ) : (
             <div className="group cursor-pointer">
                <div className="p-4 bg-cyan-neon/5 border border-cyan-neon/20 rounded-2xl flex items-center justify-between group-hover:border-cyan-neon/50 transition-all">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-neon/10 rounded-lg">
                         <Shield className="w-4 h-4 text-cyan-neon" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] text-white font-bold uppercase">NetSec Protocol Specialist</span>
                         <span className="text-[8px] text-gray-500 uppercase tracking-tighter">Verified: {new Date().toLocaleDateString()}</span>
                      </div>
                   </div>
                   <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-cyan-neon group-hover:translate-x-1 transition-all" />
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
