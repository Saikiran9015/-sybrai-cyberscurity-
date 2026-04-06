"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ChevronRight, BookOpen, Zap, Shield, Play, CheckCircle, Award, Brain, Activity, Target, Cpu } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import Certificate from "@/components/Certificate";
import TrialTimer from "@/components/TrialTimer";

// Lab Modules
import AIBrainAnimation from "@/components/labs/ai/AIBrainAnimation";
import AnomalySimulator from "@/components/labs/ai/AnomalySimulator";
import PaymentGate from "@/components/PaymentGate";

const CHAPTERS = [
  { 
    id: 1, 
    title: "Introduction to AI in Security", 
    content: "AI uses machine learning algorithms to analyze large data, detect unusual patterns, and predict cyber attacks.",
    example: "If a user logs in from India daily and suddenly logs in from another country → AI flags it 🚨"
  },
  { 
    id: 2, 
    title: "Threat Detection Using ML", 
    content: "Supervised Learning uses known attack patterns, while Unsupervised Learning identifies unknown anomalies through real-time monitoring.",
    example: "AI learns behavior → compares → detects abnormal activity."
  },
  { 
    id: 3, 
    title: "Anomaly Detection", 
    content: "An anomaly is anything different from normal behavior, such as unusual login times, high data transfer, or unknown processes running.",
    example: "System detects a 500% spike in outbound traffic at 3 AM."
  },
  { 
    id: 4, 
    title: "AI Security Pipeline", 
    content: "The standard pipeline follows: Data → Training → Detection → Alert → Response.",
    example: "Raw logs are processed into feature vectors for the neural engine."
  },
];

export default function AICybersecurityPage() {
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<"theory" | "labs">("theory");
  const [currentChapter, setCurrentChapter] = useState(0);
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

  const completeCourse = () => {
    setIsCompleted(true);
  };

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-[#0A0A0A] text-white overflow-hidden relative">
      {/* Background HUD Decorations */}
      <div className="absolute top-0 right-0 w-full h-full bg-grid-cyber opacity-5 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-neon/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Access Control Gate */}
      {!user ? (
        <div className="absolute inset-0 z-[50] flex items-center justify-center bg-black/80 backdrop-blur-md">
           <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-dashed border-white/20">
                 <Lock className="w-8 h-8 text-cyan-neon" />
              </div>
              <h2 className="text-2xl font-orbitron font-bold text-white uppercase tracking-widest">Authentication Required</h2>
              <button 
                onClick={() => setShowAuth(true)}
                className="button-primary px-10 py-3 text-xs font-bold uppercase tracking-widest"
              >
                Login to Access Lab
              </button>
           </div>
        </div>
      ) : (!user.isAdmin && !user.isPaid && !user.paidCourses?.includes("ai-cybersecurity")) ? (
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
            <div className="flex items-center gap-2 text-cyan-neon text-sm font-mono mb-2 uppercase tracking-widest">
              <Brain className="w-4 h-4" /> Tactical AI Module
            </div>
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold tracking-tighter uppercase">
              AI in <span className="text-gradient">Cybersecurity</span>
            </h1>
            <p className="text-gray-500 text-xs font-mono mt-2 uppercase tracking-widest">Mastering ML Threat Detection & Anomaly Analysis</p>
          </div>
          
          <div className="flex gap-4">
             <div className="glass-panel px-6 py-2 rounded-xl flex items-center gap-3 border-white/5">
                <div className="text-right">
                   <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Current Rank</p>
                   <p className="text-xs font-orbitron text-white uppercase tracking-tighter">Initiate Analyst</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-cyan-neon/10 border border-cyan-neon/20 flex items-center justify-center">
                   <Target className="w-5 h-5 text-cyan-neon" />
                </div>
             </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Workspace */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex bg-white/5 p-1 rounded-2xl w-fit border border-white/10">
              <button 
                onClick={() => setActiveTab("theory")}
                className={`px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "theory" ? "bg-cyan-neon text-black" : "text-gray-400 hover:text-white"}`}
              >
                Theory Archive
              </button>
              <button 
                onClick={() => setActiveTab("labs")}
                className={`px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "labs" ? "bg-cyan-neon text-black" : "text-gray-400 hover:text-white"}`}
              >
                Simulation Lab
              </button>
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                {activeTab === "theory" ? (
                  <motion.div 
                    key="theory"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="glass-panel p-10 rounded-3xl border-white/5 relative overflow-hidden group min-h-[450px]">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                          <Brain className="w-64 h-64" />
                       </div>
                       
                       <motion.div 
                        key={currentChapter}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8 relative z-10"
                       >
                         <div className="space-y-2">
                           <span className="text-[10px] text-cyan-neon font-bold uppercase tracking-[0.5em]">Chapter 0{CHAPTERS[currentChapter].id}</span>
                           <h2 className="text-3xl font-orbitron font-bold text-white uppercase tracking-tighter">{CHAPTERS[currentChapter].title}</h2>
                         </div>
                         
                         <p className="text-gray-400 text-lg leading-relaxed font-light">
                           {CHAPTERS[currentChapter].content}
                         </p>

                         <div className="p-6 bg-cyan-neon/5 border-l-4 border-cyan-neon rounded-r-2xl space-y-2">
                            <span className="text-[10px] font-bold text-cyan-neon uppercase tracking-widest flex items-center gap-2 italic">
                               <Zap className="w-3 h-3" /> Tactical Instance Example
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
                               className="button-primary px-8 flex items-center gap-2 group"
                             >
                               Next Data Node <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                             </button>
                          ) : (
                             <button 
                               onClick={() => setActiveTab("labs")}
                               className="button-primary px-8 bg-gradient-to-r from-purple-neon to-cyan-neon flex items-center gap-2"
                             >
                               Initiate Simulation <Play className="w-4 h-4" />
                             </button>
                          )}
                       </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="labs"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <AnomalySimulator />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Training Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
             <div className="glass-panel p-8 rounded-3xl border-white/5 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                   <div className="w-12 h-12 rounded-xl bg-purple-neon/10 border border-purple-neon/20 flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-neon" />
                   </div>
                   <div>
                      <h4 className="text-white font-orbitron font-bold text-sm uppercase">Mission Rewards</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">+1250 XP | Neural Badge</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Training Progress</h4>
                   <div className="space-y-3">
                      {CHAPTERS.map((ch, i) => (
                         <div key={ch.id} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${i <= currentChapter ? 'bg-cyan-neon border-cyan-neon text-black' : 'border-white/10 text-gray-700'}`}>
                               {i < currentChapter ? <CheckCircle className="w-3 h-3" /> : <span className="text-[8px] font-bold">{ch.id}</span>}
                            </div>
                            <span className={`text-[10px] uppercase tracking-widest font-bold ${i <= currentChapter ? 'text-white' : 'text-gray-600'}`}>{ch.title}</span>
                         </div>
                      ))}
                      <div className="flex items-center gap-3">
                         <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${activeTab === 'labs' ? 'bg-purple-neon border-purple-neon text-white animate-pulse' : 'border-white/10 text-gray-700'}`}>
                            <Activity className="w-3 h-3" />
                         </div>
                         <span className={`text-[10px] uppercase tracking-widest font-bold ${activeTab === 'labs' ? 'text-white' : 'text-gray-600'}`}>Lab: AI Threat Engine</span>
                      </div>
                   </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                   <AIBrainAnimation />
                </div>

                <div className="pt-4">
                   <button 
                     onClick={completeCourse}
                     className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px] transition-all ${activeTab === 'labs' ? 'button-primary opacity-100' : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'}`}
                     disabled={activeTab !== 'labs'}
                   >
                     Complete AI Mission <CheckCircle className="w-4 h-4" />
                   </button>
                </div>
             </div>

             <div className="glass-panel p-6 rounded-3xl border-cyan-neon/20 bg-cyan-neon/5">
                <h4 className="text-white font-orbitron font-bold text-xs uppercase mb-2">Did you know?</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed font-mono uppercase tracking-widest">
                  Modern AI security systems can reduce the "Time to Identify" (TTI) a breach from 200+ days down to just minutes.
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="glass-panel p-10 rounded-[40px] border-cyan-neon/30 text-center max-w-xl relative z-10 overflow-hidden"
            >
               {/* Success Graphics */}
               <div className="mb-8 relative">
                  <div className="absolute inset-0 bg-cyan-neon/20 blur-[60px] rounded-full scale-150" />
                  <div className="w-24 h-24 bg-gradient-to-br from-cyan-neon to-purple-neon rounded-[30px] flex items-center justify-center mx-auto relative z-10 shadow-[0_0_50px_rgba(0,245,255,0.4)] rotate-12">
                     <Award className="w-12 h-12 text-white -rotate-12" />
                  </div>
               </div>

               <h2 className="text-4xl font-orbitron font-bold text-white uppercase tracking-tighter mb-4 italic">
                 Mission <span className="text-gradient">Complete</span>
               </h2>
               <p className="text-gray-500 text-xs font-mono uppercase tracking-widest leading-relaxed mb-10 max-w-sm mx-auto">
                 You have successfully decrypted the AI Cybersecurity matrix. You are now authorized for graduation.
               </p>

               <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setShowCertificate(true)}
                    className="w-full py-4 button-primary flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs"
                  >
                    View Graduation Protocols
                  </button>
                  <button onClick={() => window.location.href = '/learn'} className="text-gray-500 hover:text-white uppercase text-[10px] tracking-widest font-bold transition-colors">
                    Return to Academy Command
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
                  courseTitle="AI in Cybersecurity" 
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
