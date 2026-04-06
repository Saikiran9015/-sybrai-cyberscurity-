"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ChevronRight, BookOpen, Zap, Shield, Play, CheckCircle, Award, Terminal, Cpu, Bug, Target } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import Certificate from "@/components/Certificate";

// Lab Components
import HexAnalyzer from "@/components/labs/zeroday/HexAnalyzer";
import FuzzingSim from "@/components/labs/zeroday/FuzzingSim";
import PaymentGate from "@/components/PaymentGate";

const CHAPTERS = [
  { 
    id: 1, 
    title: "Zero-Day Introduction", 
    content: "A zero-day is a vulnerability unknown to developers. It is dangerous because no patch exists, and attackers exploit it instantly.",
    example: "Log4Shell vulnerability was a zero-day for years before discovery 🚨"
  },
  { 
    id: 2, 
    title: "Vulnerability Discovery", 
    content: "Methods include code analysis, fuzz testing, and behavior monitoring to identify hidden flaws in software architecture.",
    example: "Sending 10,000 random strings to a server to find input buffer crashes."
  },
  { 
    id: 3, 
    title: "Reverse Engineering", 
    content: "Understanding software by decompiling code and analyzing logic flow. This allows analysts to find vulnerabilities without source access.",
    example: "Using GDB or any Hex Editor to look for return-to-libc attack vectors."
  },
  { 
    id: 4, 
    title: "Patching & Defense", 
    content: "Once a vulnerability is found, developers must identify the issue, fix the code, and release an emergency patch or update.",
    example: "Adding bounds checking to a variable to prevent memory corruption."
  },
];

export default function ZeroDayPage() {
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<"theory" | "labs">("theory");
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [vulnerabilityFound, setVulnerabilityFound] = useState(false);
  const [systemCrashed, setSystemCrashed] = useState(false);

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

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-[#0A0A0A] text-white overflow-hidden relative">
      {/* Background HUD Decorations */}
      <div className="absolute top-0 right-0 w-full h-full bg-grid-cyber opacity-5 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-neon/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Access Control Gate */}
      {!user ? (
        <div className="absolute inset-0 z-[50] flex items-center justify-center bg-black/80 backdrop-blur-md">
           <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-dashed border-white/20">
                 <Lock className="w-8 h-8 text-purple-neon" />
              </div>
              <h2 className="text-2xl font-orbitron font-bold text-white uppercase tracking-widest">Authentication Required</h2>
              <button 
                onClick={() => setShowAuth(true)}
                className="bg-purple-neon hover:bg-purple-600 text-white px-10 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
              >
                Login to Access Lab
              </button>
           </div>
        </div>
      ) : (!user.isAdmin && !user.isPaid && !user.paidCourses?.includes("zero-day")) ? (
        <div className="absolute inset-0 z-[50] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
           <PaymentGate 
             user={user} 
             onSuccess={(updatedUser) => {
               setUser(updatedUser);
               localStorage.setItem("sybrai_user", JSON.stringify(updatedUser));
             }} 
           />
        </div>
      ) : null}

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-purple-neon text-sm font-mono mb-2 uppercase tracking-widest font-bold">
              <Bug className="w-4 h-4" /> Tactical Recon Module
            </div>
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold tracking-tighter uppercase italic">
              Zero-Day <span className="text-gradient">Analysis</span>
            </h1>
            <p className="text-gray-500 text-xs font-mono mt-2 uppercase tracking-widest">Reverse Engineering & Vulnerability Discovery</p>
          </div>
          
          <div className="flex gap-4">
             <div className="glass-panel px-6 py-2 rounded-xl flex items-center gap-3 border-white/5">
                <div className="text-right">
                   <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Target Status</p>
                   <p className="text-xs font-orbitron text-white uppercase tracking-tighter">Analyzing OS Binary...</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-neon/10 border border-purple-neon/20 flex items-center justify-center">
                   <Target className="w-5 h-5 text-purple-neon animate-pulse" />
                </div>
             </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Workspace */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex bg-white/5 p-1 rounded-2xl w-fit border border-white/10 uppercase tracking-widest font-bold text-[9px]">
              <button 
                onClick={() => setActiveTab("theory")}
                className={`px-8 py-2.5 rounded-xl transition-all ${activeTab === "theory" ? "bg-purple-neon text-white" : "text-gray-400 hover:text-white"}`}
              >
                Intelligence Briefing
              </button>
              <button 
                onClick={() => setActiveTab("labs")}
                className={`px-8 py-2.5 rounded-xl transition-all ${activeTab === "labs" ? "bg-purple-neon text-white" : "text-gray-400 hover:text-white"}`}
              >
                Exploit Laboratory
              </button>
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                {activeTab === "theory" ? (
                  <motion.div 
                    key="theory"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="space-y-6"
                  >
                    <div className="glass-panel p-10 rounded-[30px] border-white/5 relative overflow-hidden group min-h-[450px]">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                          <Terminal className="w-64 h-64" />
                       </div>
                       
                       <motion.div 
                        key={currentChapter}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8 relative z-10"
                       >
                         <div className="space-y-2">
                           <span className="text-[10px] text-purple-neon font-bold uppercase tracking-[0.5em]">Intel Node 0{CHAPTERS[currentChapter].id}</span>
                           <h2 className="text-3xl font-orbitron font-bold text-white uppercase tracking-tighter italic">{CHAPTERS[currentChapter].title}</h2>
                         </div>
                         
                         <p className="text-gray-400 text-lg leading-relaxed font-light">
                           {CHAPTERS[currentChapter].content}
                         </p>

                         <div className="p-6 bg-purple-neon/5 border-l-4 border-purple-neon rounded-r-2xl space-y-2">
                            <span className="text-[10px] font-bold text-purple-neon uppercase tracking-widest flex items-center gap-2 italic">
                               <Zap className="w-3 h-3" /> Field Intelligence Report
                            </span>
                            <p className="text-sm font-mono text-white/80">{CHAPTERS[currentChapter].example}</p>
                         </div>
                       </motion.div>

                       <div className="absolute bottom-10 right-10 flex gap-4">
                          <button 
                            disabled={currentChapter === 0}
                            onClick={() => setCurrentChapter(prev => prev - 1)}
                            className="p-3 rounded-xl border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          >
                             <ChevronRight className="w-5 h-5 rotate-180" />
                          </button>
                          {currentChapter < CHAPTERS.length - 1 ? (
                             <button 
                               onClick={() => setCurrentChapter(prev => prev + 1)}
                               className="bg-purple-neon hover:bg-purple-600 text-white px-8 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 group transition-all"
                             >
                               Next Intelligence Node <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                             </button>
                          ) : (
                             <button 
                               onClick={() => setActiveTab("labs")}
                               className="button-primary px-8 bg-gradient-to-r from-purple-neon to-purple-600 flex items-center gap-2"
                             >
                               Initiate Zero-Day Hunt <Play className="w-4 h-4" />
                             </button>
                          )}
                       </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="labs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                       <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-tighter italic">Step 1: File Behavior Scan & Analysis</h3>
                       <HexAnalyzer onVulnerabilityFound={() => setVulnerabilityFound(true)} />
                    </div>

                    <AnimatePresence>
                       {vulnerabilityFound && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-4 pt-8 border-t border-white/5"
                          >
                             <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-tighter italic text-red-500">Step 2: Exploit Simulation (Fuzz Testing)</h3>
                             <FuzzingSim onCrash={() => setSystemCrashed(true)} />
                          </motion.div>
                       )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Training Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
             <div className="glass-panel p-8 rounded-[40px] border-white/5 space-y-6 bg-black/40">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                   <div className="w-12 h-12 rounded-xl bg-purple-neon/10 border border-purple-neon/20 flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-neon" />
                   </div>
                   <div>
                      <h4 className="text-white font-orbitron font-bold text-sm uppercase">Mission Target</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">+1500 XP | Zero-Day Hunter Badge</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Tactical Progression</h4>
                   <div className="space-y-3">
                      {CHAPTERS.map((ch, i) => (
                         <div key={ch.id} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${i <= currentChapter ? 'bg-purple-neon border-purple-neon text-white' : 'border-white/10 text-gray-700'}`}>
                               {i < currentChapter ? <CheckCircle className="w-3 h-3" /> : <span className="text-[8px] font-bold">{ch.id}</span>}
                            </div>
                            <span className={`text-[10px] uppercase tracking-widest font-bold ${i <= currentChapter ? 'text-white' : 'text-gray-600'}`}>{ch.title}</span>
                         </div>
                      ))}
                      <div className="flex items-center gap-3">
                         <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${vulnerabilityFound ? 'bg-purple-neon border-purple-neon text-white' : 'border-white/10 text-gray-700'}`}>
                            <BookOpen className="w-3 h-3" />
                         </div>
                         <span className={`text-[10px] uppercase tracking-widest font-bold ${vulnerabilityFound ? 'text-white' : 'text-gray-600'}`}>Reverse Engineering</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${systemCrashed ? 'bg-red-500 border-red-500 text-white animate-pulse' : 'border-white/10 text-gray-700'}`}>
                            <Bug className="w-3 h-3" />
                         </div>
                         <span className={`text-[10px] uppercase tracking-widest font-bold ${systemCrashed ? 'text-white' : 'text-gray-600'}`}>Exploit Simulation</span>
                      </div>
                   </div>
                </div>

                <div className="pt-4">
                   <button 
                     onClick={() => setIsCompleted(true)}
                     className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px] transition-all ${systemCrashed ? 'bg-red-500 hover:bg-red-600 text-white opacity-100 shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'}`}
                     disabled={!systemCrashed}
                   >
                     Complete Mission <CheckCircle className="w-4 h-4" />
                   </button>
                </div>
             </div>

             <div className="glass-panel p-6 rounded-3xl border-purple-neon/20 bg-purple-neon/5 font-mono">
                <h4 className="text-white font-orbitron font-bold text-xs uppercase mb-2">Technical Insight</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-widest">
                  Zero-day exploits trade on the dark web for upwards of 1 million USD. Analysts who can discover them are among the highest-paid in the industry.
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-panel p-12 rounded-[40px] border-purple-neon/30 text-center max-w-xl relative overflow-hidden"
            >
               <div className="mb-8 relative">
                  <div className="absolute inset-0 bg-purple-neon/20 blur-[60px] rounded-full scale-150" />
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-neon to-red-500 rounded-[30px] flex items-center justify-center mx-auto relative z-10 shadow-[0_0_50px_rgba(123,97,255,0.4)] rotate-45">
                     <Bug className="w-12 h-12 text-white -rotate-45" />
                  </div>
               </div>

               <h2 className="text-4xl font-orbitron font-bold text-white uppercase tracking-tighter mb-4 italic">
                 Analyst <span className="text-gradient">Certified</span>
               </h2>
               <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest leading-relaxed mb-10 max-w-sm mx-auto">
                 Vulnerability discovery protocol successful. You've been promoted to Junior Zero-Day Analyst.
               </p>

               <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setShowCertificate(true)}
                    className="w-full py-4 button-primary bg-gradient-to-r from-purple-neon to-red-600 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs"
                  >
                    Generate Credentials
                  </button>
                  <button onClick={() => window.location.href = '/learn'} className="text-gray-500 hover:text-white uppercase text-[10px] tracking-widest font-bold transition-colors">
                    Back to Command Center
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCertificate && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-10 overflow-y-auto">
             <div className="max-w-5xl w-full relative">
                <button onClick={() => setShowCertificate(false)} className="absolute -top-12 right-0 text-white flex items-center gap-2 text-xs font-bold tracking-widest">
                   CLOSE [X]
                </button>
                <Certificate 
                  userName={user?.name || "Student Agent"} 
                  courseTitle="Zero-Day Analysis" 
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
