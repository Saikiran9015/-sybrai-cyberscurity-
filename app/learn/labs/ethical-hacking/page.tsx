"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LabLayout from "@/components/labs/LabLayout";
import AuthModal from "@/components/AuthModal";
import PaymentGate from "@/components/PaymentGate";
import TrialTimer from "@/components/TrialTimer";
import { ChevronLeft, User as UserIcon, Lock, LogIn } from "lucide-react";
import Link from "next/link";

export default function EthicalHackingLab() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("sybrai_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sybrai_token");
    localStorage.removeItem("sybrai_user");
    setUser(null);
    setShowAuth(true);
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handlePaymentSuccess = (updatedUser: any) => {
    localStorage.setItem("sybrai_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center font-mono text-cyan-neon">
       LOADING SECURE NODE...
    </div>
  );

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen bg-[#0A0A0A] relative overflow-hidden text-white">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-neon/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-neon/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <Link href="/learn" className="flex items-center gap-2 text-gray-500 hover:text-cyan-neon transition-colors text-sm font-mono mb-4 group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO ACADEMY
            </Link>
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white tracking-tighter">
              Ethical Hacking <span className="text-gradient">Basics</span>
            </h1>
            <div className="flex items-center gap-4 mt-4">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400 font-bold uppercase tracking-widest">Beginner Module</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-cyan-neon font-bold uppercase tracking-widest">6 Labs Total</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-purple-neon font-bold uppercase tracking-widest">Live Terminal Sim</span>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap items-center">
             {user && (
               <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-xl border-white/10">
                  <div className="p-2 bg-cyan-neon/10 rounded-lg">
                    <UserIcon className="w-4 h-4 text-cyan-neon" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white font-bold tracking-widest">{user.name.toUpperCase()}</span>
                    <button onClick={handleLogout} className="text-[8px] text-red-500 hover:underline uppercase text-left">Terminate Session</button>
                  </div>
               </div>
             )}
             <div className="flex gap-3">
               {user?.trialExpiresAt && !user.isPaid && (
                 <TrialTimer 
                   expiresAt={user.trialExpiresAt} 
                   onExpire={() => {
                     // Auto-reload to payment gate on expire
                     const updatedUser = { ...user, trialExpiresAt: null };
                     setUser(updatedUser);
                     localStorage.setItem("sybrai_user", JSON.stringify(updatedUser));
                   }} 
                 />
               )}
              <div className="glass-panel p-4 rounded-xl border-white/10 flex flex-col items-center justify-center min-w-[100px]">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">XP Points</span>
                <span className="text-xl font-orbitron font-bold text-white">1200</span>
              </div>
              <div className="glass-panel p-4 rounded-xl border-white/10 flex flex-col items-center justify-center min-w-[100px]">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Rank</span>
                <span className="text-xl font-orbitron font-bold text-cyan-neon">Lv 1</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Lab Content - Unlocked for Authenticated Users */}
        {!user ? (
          <div className="glass-panel p-20 rounded-[40px] border-dashed border-white/10 text-center flex flex-col items-center justify-center space-y-8 bg-black/40 min-h-[400px]">
             <div className="w-24 h-24 bg-cyan-neon/10 rounded-3xl flex items-center justify-center border border-cyan-neon/30 shadow-[0_0_30px_rgba(0,245,255,0.2)]">
                <Lock className="w-10 h-10 text-cyan-neon animate-pulse" />
             </div>
             <div className="space-y-3 max-w-md">
                <h3 className="text-3xl font-orbitron font-bold text-white uppercase tracking-tighter italic">AUTHENTICATION REQUIRED</h3>
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] leading-relaxed">
                   Please authenticate your student agent ID to unlock the ethical hacking tactical node.
                </p>
             </div>
             <button 
               onClick={() => setShowAuth(true)}
               className="button-primary px-12 py-5 font-bold uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all"
             >
               <LogIn className="w-4 h-4" /> Authenticate Terminal
             </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <LabLayout />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showAuth && <AuthModal onSuccess={handleAuthSuccess} onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </div>
  );
}
