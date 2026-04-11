"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Shield, Network, Lock, CheckCircle, Zap, ArrowRight, User as UserIcon, LogIn, Loader2 } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import StudentProfile from "@/components/StudentProfile";
import AuthModal from "@/components/AuthModal";

const tutorials = [
  { 
    id: "ethical-hacking",
    title: "Ethical Hacking Basics", 
    icon: <Shield className="text-cyan-neon w-6 h-6" />, 
    href: "/learn/labs/ethical-hacking",
    desc: "Foundations of reconnaissance, scanning, and penetration testing.",
    color: "cyan",
    price: 50
  },
  { 
    id: "network-security",
    title: "Network Security Protocols", 
    icon: <Network className="text-purple-neon w-6 h-6" />, 
    href: "/learn/labs/network-security",
    desc: "Master SSL/TLS, VPN tunneling, and advanced firewall configuration.",
    color: "purple",
    price: 50
  },
  { 
    id: "ai-cybersecurity",
    title: "AI in Cybersecurity", 
    icon: <BookOpen className="text-cyan-neon w-6 h-6" />, 
    href: "/learn/labs/ai-cybersecurity",
    desc: "Implementing machine learning for threat detection and anomaly analysis.",
    color: "cyan",
    price: 50
  },
  { 
    id: "zero-day",
    title: "Zero-Day Analysis", 
    icon: <Shield className="text-purple-neon w-6 h-6" />, 
    href: "/learn/labs/zero-day",
    desc: "Reverse engineering and vulnerability discovery in modern software.",
    color: "purple",
    price: 50
  },
];

export default function Learn() {
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

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

  const handleUnlock = async (amount: number = 499) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    if (!scriptLoaded) {
      alert("Payment system initializing... please wait.");
      return;
    }
    
    setUnlockLoading(true);
    try {
      const orderRes = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount,
          userId: user.id || user._id 
        }),
      });
      const orderData = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder_id",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Sybrai Academy",
        description: "Pro Tactical Hub - Lifetime Access",
        order_id: orderData.id,
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              userId: user.id || user._id,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            setUser(verifyData.user);
            localStorage.setItem("sybrai_user", JSON.stringify(verifyData.user));
            alert("Mission Nodes Decrypted! Welcome to the Pro Hub.");
          } else {
            alert("Verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#00F5FF",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Error initializing payment.");
    } finally {
      setUnlockLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Background HUD Graphics */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-neon/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-neon/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-12">
            {/* Left Content Area (Academy Hub) */}
            <div className="lg:col-span-8">
               <header className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="font-orbitron font-bold text-4xl md:text-5xl text-white uppercase tracking-tighter">
                      Academy <span className="text-gradient">Tactical Hub</span>
                    </h1>
                    {user?.isPaid && (
                      <span className="px-3 py-1 bg-cyan-neon/20 border border-cyan-neon/50 text-cyan-neon text-[10px] font-bold uppercase tracking-widest rounded-full animate-pulse">
                        PRO HUB ACTIVATED
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 max-w-2xl text-sm font-mono uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-2 rounded-lg inline-block">
                    Available Missions: {tutorials.length} Module Nodes Detected
                  </p>
               </header>

               {user ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tutorials.map((tut, i) => {
                       const isPaid = user?.isPaid || user?.paidCourses?.includes(tut.id) || user?.isAdmin;
                       const isCompleted = user?.isCompleted && tut.id === 'network-security'; 
                       const isLocked = !isPaid && !user?.isAdmin;

                       return (
                         <div key={tut.id} onClick={() => isLocked && handleUnlock(tut.price)} className="group relative">
                           <motion.div
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: i * 0.1 }}
                             className={`glass-panel p-8 rounded-3xl cursor-pointer border border-white/5 hover:border-${tut.color}-neon/50 transition-all h-full relative overflow-hidden`}
                           >
                             {!isLocked && <Link href={tut.href} className="absolute inset-0 z-10" />}
                             
                             <div className="absolute top-0 right-0 p-8 opacity-5">
                                {tut.icon}
                             </div>

                             <div className="mb-6 flex items-center justify-between">
                               <div className={`p-4 rounded-2xl bg-${tut.color}-neon/10 border border-${tut.color}-neon/20 group-hover:scale-110 transition-transform`}>
                                 {tut.icon}
                               </div>
                               {isCompleted ? (
                                  <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full border border-green-500/30">
                                     <CheckCircle className="w-3 h-3" /> Certified
                                  </div>
                               ) : isLocked ? (
                                  <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30">
                                     <Lock className="w-3 h-3" /> Encrypted
                                  </div>
                               ) : (
                                  <div className="flex items-center gap-1 text-[10px] text-cyan-neon font-bold uppercase tracking-widest bg-cyan-neon/10 px-3 py-1 rounded-full border border-cyan-neon/30">
                                     <Zap className="w-3 h-3" /> Decrypted
                                  </div>
                               )}
                             </div>

                             <h3 className="font-orbitron font-bold text-xl text-white mb-3 group-hover:text-cyan-neon transition-colors underline decoration-white/10 decoration-2 underline-offset-8">{tut.title}</h3>
                             <p className="text-xs text-gray-500 leading-relaxed max-w-xs">{tut.desc}</p>
                             
                             <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                                <div className="flex flex-col gap-1">
                                   <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Node Complexity</span>
                                   <div className="flex gap-1">
                                      <div className={`w-2 h-1 rounded-full bg-${tut.color}-neon`} />
                                      <div className={`w-2 h-1 rounded-full bg-${tut.color}-neon`} />
                                      <div className="w-2 h-1 rounded-full bg-white/10" />
                                   </div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest group-hover:gap-4 transition-all">
                                   {unlockLoading && isLocked ? (
                                     <><Loader2 className="w-3 h-3 animate-spin" /> Processing</>
                                   ) : isLocked ? "Unlock Access" : "Initiate Mission"} <ArrowRight className="w-3 h-3 text-cyan-neon" />
                                </div>
                             </div>
                           </motion.div>
                         </div>
                       )
                    })}
                 </div>
               ) : (
                 <div className="glass-panel p-20 rounded-[40px] border-dashed border-white/10 text-center flex flex-col items-center justify-center space-y-8 bg-black/20">
                    <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                       <Lock className="w-10 h-10 text-red-500 animate-pulse" />
                    </div>
                    <div className="space-y-3 max-w-md">
                       <h3 className="text-3xl font-orbitron font-bold text-white uppercase tracking-tighter italic">SYSTEM ACCESS LOCKED</h3>
                       <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] leading-relaxed">
                          Academy tactical nodes are encrypted to prevent unauthorized data leaks. Please authenticate your student agent ID to decrypt mission dossiers.
                       </p>
                    </div>
                    <button 
                      onClick={() => setShowAuth(true)}
                      className="button-primary px-12 py-5 font-bold uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all"
                    >
                      <LogIn className="w-4 h-4" /> Authenticate Terminal
                    </button>
                 </div>
               )}
            </div>

           {/* Right Sidebar (Student Profile) */}
           <div className="lg:col-span-4 flex flex-col pt-10">
              {user ? (
                 <StudentProfile user={user} onLogout={handleLogout} />
              ) : (
                 <div className="glass-panel p-10 rounded-3xl border-white/5 text-center flex flex-col items-center justify-center space-y-6">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-dashed border-white/10 animate-pulse">
                       <UserIcon className="w-8 h-8 text-gray-700" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-tighter">Student ID Missing</h3>
                       <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
                          Please initialize your agent credentials to track XP, Ranks, and Certifications.
                       </p>
                    </div>
                    <button 
                      onClick={() => setShowAuth(true)}
                      className="w-full button-primary py-4 font-bold uppercase tracking-widest text-[10px]"
                    >
                      Authenticate System
                    </button>
                 </div>
              )}

              {/* Sidebar Mini Ad/Info Card */}
              <div className="mt-6 glass-panel p-6 rounded-3xl border-purple-neon/20 bg-purple-neon/5 relative overflow-hidden group">
                 <div className="absolute -right-4 -bottom-4 bg-purple-neon/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-purple-neon/20 transition-all" />
                 <h4 className="text-sm font-orbitron font-bold text-white mb-2 uppercase tracking-tighter">Pro Academy License</h4>
                 <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest leading-relaxed mb-4">
                    Unlock all current and future nodes for a one-time lifetime payment of ₹50.
                 </p>
                 <button 
                    onClick={() => handleUnlock(50)}
                    disabled={unlockLoading}
                    className="text-[10px] text-purple-neon font-bold uppercase tracking-widest hover:underline flex items-center gap-1 disabled:opacity-50"
                 >
                    {unlockLoading ? "Processing..." : "Upgrade to Pro"} <ArrowRight className="w-3 h-3" />
                 </button>
              </div>
           </div>
        </div>
      </div>

      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
      />
      <AnimatePresence>
        {showAuth && <AuthModal onSuccess={handleAuthSuccess} onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </div>
  );
}
