"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ChevronRight, BookOpen, Zap, Shield, Play, CheckCircle, Award, LogIn } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import PaymentGate from "@/components/PaymentGate";
import Certificate from "@/components/Certificate";
import TrialTimer from "@/components/TrialTimer";

// Lab Modules
import PacketSniffer from "@/components/labs/netsec/PacketSniffer";
import CommunicationComparer from "@/components/labs/netsec/CommunicationComparer";
import FirewallManager from "@/components/labs/netsec/FirewallManager";
import VPNTunnelSim from "@/components/labs/netsec/VPNTunnelSim";
import MITMNodeGraph from "@/components/labs/netsec/MITMNodeGraph";

const CHAPTERS = [
  { id: 1, title: "Fundamentals", topics: ["What is Network Security", "OSI Model", "Common Attacks"] },
  { id: 2, title: "Core Protocols", topics: ["SSL/TLS", "HTTP vs HTTPS", "SSH & VPN"] },
  { id: 3, title: "Attack & Defense", topics: ["Packet Sniffing", "Man-in-the-Middle", "Firewalls"] },
  { id: 4, title: "Advanced Security", topics: ["Zero Trust", "Network Segmentation", "AI Security"] },
];

const LABS = [
  { id: "lab-1", title: "Packet Sniffing", desc: "Capture and analyze HTTP data packets." },
  { id: "lab-2", title: "Secure Comm", desc: "Compare HTTP (Plain) vs HTTPS (Encrypted)." },
  { id: "lab-3", title: "Firewall Configuration", desc: "Block unauthorized traffic using rules." },
  { id: "lab-4", title: "VPN Tunneling", desc: "Simulate an encrypted data tunnel." },
  { id: "lab-5", title: "MITM Defense", desc: "Stop an attacker from stealing user data." },
];

export default function NetSecLabPage() {
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<"theory" | "labs">("theory");
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentLab, setCurrentLab] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("sybrai_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handlePaymentSuccess = (updatedUser: any) => {
    setUser(updatedUser);
    localStorage.setItem("sybrai_user", JSON.stringify(updatedUser));
  };

  const completeCourse = async () => {
    const token = localStorage.getItem("sybrai_token");
    if (!token) {
       setIsCompleted(true); // Allow demo completion even without login
       return;
    }
    try {
      const res = await fetch("/api/user/complete", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setIsCompleted(true);
      }
    } catch (err) {
      console.error(err);
      setIsCompleted(true);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-purple-neon text-sm font-mono mb-2 uppercase tracking-widest">
              <Shield className="w-4 h-4" /> Sybrai Academy Module
            </div>
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold tracking-tighter">
              Network Security <span className="text-gradient">Protocols</span>
            </h1>
          </div>
          {user?.trialExpiresAt && !user.isPaid && (
            <TrialTimer 
              expiresAt={user.trialExpiresAt} 
              onExpire={() => {
                const updatedUser = { ...user, trialExpiresAt: null };
                setUser(updatedUser);
                localStorage.setItem("sybrai_user", JSON.stringify(updatedUser));
              }} 
            />
          )}
        </header>

        {/* Access Control Gate */}
        {!user ? (
          <div className="glass-panel p-20 rounded-[40px] border-dashed border-white/10 text-center flex flex-col items-center justify-center space-y-8 bg-black/40 min-h-[400px]">
             <div className="w-24 h-24 bg-purple-neon/10 rounded-3xl flex items-center justify-center mx-auto border border-purple-neon/30 shadow-[0_0_30px_rgba(123,97,255,0.2)]">
                <Lock className="w-10 h-10 text-purple-neon animate-pulse" />
             </div>
             <div className="space-y-3 max-w-md">
                <h3 className="text-3xl font-orbitron font-bold text-white uppercase tracking-tighter italic">AUTHENTICATION REQUIRED</h3>
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] leading-relaxed">
                   Please authenticate your student agent ID to unlock the network security tactical node.
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
          <div className="grid lg:grid-cols-12 gap-8">
              {/* Left Rail - Progression */}
              <div className="lg:col-span-4 space-y-6">
                {/* Navigation Tabs */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  <button 
                    onClick={() => setActiveTab("theory")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'theory' ? 'bg-purple-neon text-white' : 'text-gray-500 hover:text-white'}`}
                  >
                    Theory
                  </button>
                  <button 
                    onClick={() => setActiveTab("labs")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'labs' ? 'bg-cyan-neon text-black shadow-[0_0_15px_#00F5FF]' : 'text-gray-500 hover:text-white'}`}
                  >
                    Labs
                  </button>
                </div>

                {/* Syllabus List */}
                <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-4">
                  {activeTab === "theory" ? (
                    CHAPTERS.map((ch, i) => (
                      <button 
                        key={ch.id}
                        onClick={() => setCurrentChapter(i)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${currentChapter === i ? 'bg-purple-neon/10 border-purple-neon text-white' : 'bg-transparent border-white/5 text-gray-500 hover:border-white/20'}`}
                      >
                        <div className="text-[10px] uppercase tracking-widest mb-1 opacity-50">Chapter {ch.id}</div>
                        <div className="font-bold">{ch.title}</div>
                      </button>
                    ))
                  ) : (
                    LABS.map((lab, i) => (
                      <button 
                        key={lab.id}
                        onClick={() => setCurrentLab(lab.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${currentLab === lab.id ? 'bg-cyan-neon/10 border-cyan-neon text-white' : 'bg-transparent border-white/5 text-gray-500 hover:border-white/20'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-[10px] uppercase tracking-widest opacity-50">Simulation {i + 1}</div>
                          {currentLab === lab.id && <Play className="w-3 h-3 text-cyan-neon animate-pulse" />}
                        </div>
                        <div className="font-bold">{lab.title}</div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Right Main - Content Display */}
              <div className="lg:col-span-8 min-h-[600px] flex flex-col">
                <AnimatePresence mode="wait">
                  {activeTab === "theory" ? (
                    <motion.div 
                      key={CHAPTERS[currentChapter].id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="glass-panel p-10 rounded-3xl border-white/5 h-full relative overflow-hidden"
                    >
                      <BookOpen className="absolute top-10 right-10 w-32 h-32 text-purple-neon/5 -rotate-12" />
                      <div className="relative z-10">
                        <h2 className="text-3xl font-orbitron font-bold mb-6">Chapter {CHAPTERS[currentChapter].id}: <span className="text-purple-neon">{CHAPTERS[currentChapter].title}</span></h2>
                        <div className="space-y-6 text-gray-400 leading-relaxed">
                          <p>In this chapter, we explore the core principles that govern professional networking security.</p>
                          <div className="grid md:grid-cols-2 gap-4">
                            {CHAPTERS[currentChapter].topics.map((topic, i) => (
                              <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                                <CheckCircle className="w-4 h-4 text-purple-neon" />
                                <span className="text-sm font-bold text-white uppercase tracking-tight">{topic}</span>
                              </div>
                            ))}
                          </div>
                          <p className="mt-8">Understanding these concepts is vital before entering the tactical simulation environment. Ensure you have mastered the OSI model layers and protocol encryption before proceeding to the labs.</p>
                        </div>
                        <button 
                          onClick={() => setActiveTab("labs")}
                          className="mt-10 flex items-center gap-2 text-cyan-neon font-bold uppercase tracking-widest text-xs hover:gap-4 transition-all"
                        >
                          Enter Simulation Lab <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key={currentLab || 'empty'}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex-1 bg-black rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center p-20"
                    >
                      {!currentLab ? (
                        <div className="space-y-6">
                          <div className="w-20 h-20 bg-cyan-neon/10 rounded-full flex items-center justify-center mx-auto border border-cyan-neon/30">
                            <Zap className="w-10 h-10 text-cyan-neon glow-cyan" />
                          </div>
                          <h2 className="text-2xl font-orbitron font-bold">Select a Lab to Start</h2>
                          <p className="text-gray-500 max-w-sm">Use the left panel to choose a tactical simulation module.</p>
                        </div>
                      ) : (
                        <div className="space-y-8 w-full p-6">
                           <div className="text-sm font-mono text-cyan-neon uppercase tracking-[0.3em] mb-2">Simulation Mode Active</div>
                           <h2 className="text-5xl font-orbitron font-bold tracking-tighter mb-4">{LABS.find(l => l.id === currentLab)?.title}</h2>
                           <p className="text-gray-400 max-w-lg mx-auto text-lg">{LABS.find(l => l.id === currentLab)?.desc}</p>
                           
                           <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
                              {currentLab === "lab-1" && <PacketSniffer onComplete={() => {}} />}
                              {currentLab === "lab-2" && <CommunicationComparer onComplete={() => {}} />}
                              {currentLab === "lab-3" && <FirewallManager onComplete={() => {}} />}
                              {currentLab === "lab-4" && <VPNTunnelSim onComplete={() => {}} />}
                              {currentLab === "lab-5" && <MITMNodeGraph onComplete={() => {}} />}
                           </div>

                           <div className="flex gap-4 justify-center mt-6">
                              <button 
                                onClick={completeCourse}
                                className="px-8 py-3 button-primary text-xs uppercase font-bold tracking-widest flex items-center gap-2"
                              >
                                Finalize Mission <CheckCircle className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
          </div>
        )}
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
          >
            <div className="max-w-xl w-full glass-panel p-10 rounded-3xl border-purple-neon/30 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-neon via-cyan-neon to-purple-neon" />
               <Award className="w-16 h-16 text-purple-neon mx-auto mb-6 glow-cyan" />
               <h2 className="text-4xl font-orbitron font-bold mb-4 uppercase">Course Certified</h2>
               <p className="text-gray-400 mb-8 leading-relaxed">
                 Mission accomplished! You have successfully completed the Network Security Protocols training. Your digital credentials are now ready for validation.
               </p>
               {!user && (
                 <div className="mb-8 max-w-sm mx-auto">
                    <label className="block text-[8px] text-gray-500 uppercase tracking-widest font-bold mb-3 text-left">Initialize Agent Name for Certification</label>
                    <input 
                      type="text" 
                      placeholder="Enter Agent Name..." 
                      className="w-full bg-white/5 border border-white/20 px-4 py-3 rounded-xl text-white font-mono focus:outline-none focus:border-purple-neon transition-colors"
                      onChange={(e) => {
                        const guestUser = { name: e.target.value };
                        setUser(guestUser); // Temporary guest user for certificate
                      }}
                    />
                 </div>
               )}
               <div className="flex flex-col gap-3">
                 <button 
                   onClick={() => setShowCertificate(true)}
                   className="w-full py-4 button-primary flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs"
                 >
                   Generate Graduation Certificate
                 </button>
                 <button onClick={() => window.location.href = '/learn'} className="text-gray-500 hover:text-white uppercase text-[10px] tracking-widest font-bold transition-colors">
                   Return to Academy
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-10 overflow-y-auto">
             <div className="max-w-5xl w-full relative">
                <button onClick={() => setShowCertificate(false)} className="absolute -top-12 right-0 text-white flex items-center gap-2 text-xs font-bold tracking-widest">
                   CLOSE [X]
                </button>
                <Certificate 
                  userName={user?.name || "Student Agent"} 
                  courseTitle="Network Security Protocols" 
                  date={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                />
             </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuth && <AuthModal onSuccess={handleAuthSuccess} onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </div>
  );
}
