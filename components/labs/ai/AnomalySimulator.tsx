"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Shield, AlertTriangle, CheckCircle, Activity, Zap, Server } from "lucide-react";

const initialData = Array.from({ length: 40 }, (_, i) => ({
  time: i,
  traffic: 40, // Fixed baseline for hydration stability
  anomaly: 0
}));

export default function AnomalySimulator() {
  const [data, setData] = useState(initialData);
  const [step, setStep] = useState(0); // 0: Load, 1: Training, 2: Monitoring, 3: Detected, 4: Responded
  const [isAnomalyPresent, setIsAnomalyPresent] = useState(false);
  const [complexity, setComplexity] = useState("Medium"); // Low, Medium, High
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Initializing AI Engine..."]);

  const log = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));

  // Simulation Interval
  useEffect(() => {
    if (step < 2) return;

    const interval = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        const nextTime = last.time + 1;
        let nextTraffic = Math.floor(Math.random() * 20) + 30;
        
        // Inject Anomaly if step is Monitoring
        if (step === 2 && Math.random() > 0.92 && !isAnomalyPresent) {
           nextTraffic = 120 + Math.floor(Math.random() * 30);
           setIsAnomalyPresent(true);
           setStep(3);
           log("🚨 CRITICAL: UNUSUAL TRAFFIC SPIKE DETECTED!");
        }

        const newData = [...prev.slice(1), { time: nextTime, traffic: nextTraffic, anomaly: 0 }];
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, isAnomalyPresent]);

  const handleStep0 = () => {
    setStep(1);
    log("Loading Dataset: Traffic_Global_Node_v4.csv");
    let p = 0;
    const interval = setInterval(() => {
       p += 5;
       setProgress(p);
       if (p === 30) log("Preprocessing feature vectors...");
       if (p === 60) log("Training Supervised Model (RandomForest)...");
       if (p === 100) {
          clearInterval(interval);
          setStep(2);
          log("✅ Training Complete. AI Defender Online.");
       }
    }, 150);
  };

  const handleMitigate = () => {
    setStep(4);
    setIsAnomalyPresent(false);
    log("✅ Action Taken: Malicious IP Blocked. System Secured.");
  };

  const complexityColors: any = {
    Low: "text-green-500 bg-green-500/10",
    Medium: "text-yellow-500 bg-yellow-500/10",
    High: "text-red-500 bg-red-500/10"
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border-white/5 bg-black/40 min-h-[500px] flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${step >= 2 ? 'bg-cyan-neon/10 text-cyan-neon animate-pulse' : 'bg-gray-800 text-gray-500'}`}>
               <Activity className="w-5 h-5" />
            </div>
            <div>
               <h3 className="font-orbitron font-bold text-white text-sm uppercase tracking-tighter">AI Threat Engine</h3>
               <p className="text-[10px] text-gray-500 font-mono">STATUS: {step === 0 ? "IDLE" : step === 1 ? "TRAINING" : step === 2 ? "MONITORING" : step === 3 ? "ALERT" : "SECURED"}</p>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Complexity:</span>
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 ${complexityColors[complexity]}`}>
               {complexity}
            </div>
         </div>
      </div>

      <div className="flex-1 min-h-[300px] relative">
         {step < 2 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
               {step === 0 ? (
                  <button onClick={handleStep0} className="button-primary px-8 py-4 flex items-center gap-2 group">
                     <Zap className="w-4 h-4 group-hover:animate-pulse" /> LOAD DATASET & TRAIN
                  </button>
               ) : (
                  <div className="flex flex-col items-center gap-4 w-64">
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${progress}%` }}
                           className="h-full bg-cyan-neon shadow-[0_0_10px_#00F5FF]"
                        />
                     </div>
                     <span className="text-[10px] font-mono text-cyan-neon animate-pulse">OPTIMIZING WEIGHTS: {progress}%</span>
                  </div>
               )}
            </div>
         ) : (
            <div className="h-full w-full">
               <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data}>
                     <defs>
                        <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor={step === 3 ? "#FF3B3B" : "#00F5FF"} stopOpacity={0.3} />
                           <stop offset="95%" stopColor={step === 3 ? "#FF3B3B" : "#00F5FF"} stopOpacity={0} />
                        </linearGradient>
                     </defs>
                     <XAxis dataKey="time" hide />
                     <YAxis hide domain={[0, 160]} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #333' }}
                        itemStyle={{ color: '#00F5FF', fontSize: '10px' }}
                     />
                     <Area 
                        type="monotone" 
                        dataKey="traffic" 
                        stroke={step === 3 ? "#FF3B3B" : "#00F5FF"} 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorTraffic)"
                        animationDuration={300}
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         )}

         {step === 3 && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-panel p-6 border-red-500/50 bg-red-500/5 text-center flex flex-col items-center gap-4 z-20"
            >
               <AlertTriangle className="w-8 h-8 text-red-500 animate-bounce" />
               <div>
                  <h4 className="text-white font-orbitron font-bold uppercase tracking-tighter">ANOMALY AUTH DETECTED</h4>
                  <p className="text-[10px] text-gray-500 mt-1">Confidence Score: 0.982 | Deviation: +328%</p>
               </div>
               <button onClick={handleMitigate} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all">
                  BLOCK MALICIOUS NODE
               </button>
            </motion.div>
         )}

         {step === 4 && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="absolute inset-0 bg-green-500/5 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20"
            >
               <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
               </div>
               <h4 className="text-white font-orbitron font-bold uppercase tracking-tighter">Mission Accomplished</h4>
               <p className="text-[10px] text-gray-500 max-w-xs text-center uppercase tracking-widest leading-relaxed">
                  Your AI model successfully neutralized the zero-day threat. You've earned +500 XP.
               </p>
               <button onClick={() => setStep(2)} className="text-[10px] text-cyan-neon font-bold uppercase tracking-widest hover:underline">
                  Resume Monitoring
               </button>
            </motion.div>
         )}
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="glass-panel p-4 rounded-2xl bg-white/5 border-white/10 font-mono text-[9px] text-gray-500 overflow-hidden">
            <h4 className="border-b border-white/5 pb-2 mb-2 text-gray-400 font-bold uppercase tracking-widest">Real-time Telemetry</h4>
            <div className="space-y-1">
               {logs.map((L, i) => (
                  <div key={i} className={i === 0 ? "text-cyan-neon" : ""}>{L}</div>
               ))}
            </div>
         </div>
         <div className="glass-panel p-4 rounded-2xl bg-white/5 border-white/10 space-y-4">
            <h4 className="border-b border-white/5 pb-2 mb-1 text-gray-400 font-bold uppercase tracking-widest text-[9px]">Node Scale</h4>
            <div className="flex gap-2">
               {["Low", "Medium", "High"].map(L => (
                  <button 
                     key={L}
                     onClick={() => setComplexity(L)}
                     className={`flex-1 py-2 rounded-lg text-[8px] font-bold uppercase tracking-widest border transition-all ${complexity === L ? 'bg-cyan-neon text-black border-cyan-neon' : 'bg-white/5 text-gray-500 border-white/10'}`}
                  >
                     {L}
                  </button>
               ))}
            </div>
            <div className="flex items-center justify-between text-[9px]">
               <span className="text-gray-500">Latency: <span className="text-white">{complexity === 'High' ? '42ms' : complexity === 'Medium' ? '12ms' : '2ms'}</span></span>
               <span className="text-gray-500">Throughput: <span className="text-white">{complexity === 'High' ? '8.4 GB/s' : '1.2 GB/s'}</span></span>
            </div>
         </div>
      </div>
    </div>
  );
}
