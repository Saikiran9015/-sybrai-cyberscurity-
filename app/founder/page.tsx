"use client";

import { motion, useScroll, useTransform, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users } from "lucide-react";

function AnimatedCounter({ from, to }: { from: number, to: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      const controls = animate(from, to, {
        duration: 2,
        onUpdate(value) {
          node.textContent = Math.round(value).toLocaleString();
        },
      });
      return () => controls.stop();
    }
  }, [from, to]);

  return <span ref={nodeRef} />;
}

export default function Founder() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const team = [
    { name: "Muneera", role: "Software Developer", image: "/team/muneera.png", followers: 45200, iconColor: "text-cyan-neon" },
    { name: "Shyam", role: "Software Developer", image: "/team/shyam.png", followers: 31800, iconColor: "text-purple-neon" },
    { name: "Sreeja Reddy", role: "Social Media Conter", image: "/team/sreeja.png", followers: 154000, iconColor: "text-blue-500" }
  ];
  
  // Parallax effects
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={ref} className="min-h-screen bg-black">
      {/* Cinematic Intro Header */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: imageY, opacity }} 
          className="absolute inset-0 z-0"
        >
          {/* We use the custom generated founder avatar placed in public folder */}
          <div className="absolute inset-0 bg-[url('/founder.png')] bg-cover bg-center brightness-50 contrast-125 saturate-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        </motion.div>

        <motion.div 
          style={{ y: textY }}
          initial={{ opacity: 0, y: 50, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center max-w-4xl px-4"
        >
          <div className="inline-block px-4 py-1 mb-6 border border-purple-neon/50 bg-black/50 backdrop-blur-md rounded-full text-purple-neon tracking-widest text-sm font-bold glow-purple">
            THE MIND BEHIND SYBRAI
          </div>
          <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-white mb-4">
            A Visionary Building the Future of AI Security.
          </h1>
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto relative z-20">
        <div className="space-y-24">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-orbitron font-bold text-cyan-neon mb-6 border-b border-white/10 pb-4">The Story</h2>
              <p className="text-gray-300 leading-relaxed tracking-wide">
                Started with a deep passion for hacking & artificial intelligence. Built Sybrai from the ground up to solve real-world cyber threats by heavily focusing on absolute automation and intelligence.
              </p>
            </div>
            <div className="w-full md:w-1/2 h-64 glass-panel rounded-xl flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-neon/20 to-transparent">
              <div className="w-16 h-16 rounded-full bg-cyan-neon animate-pulse blur-xl" />
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 80, filter: "blur(10px)", scale: 0.95 }}
             whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 1, ease: "easeOut" }}
             className="text-center bg-white/5 border border-purple-neon/30 p-12 rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-neon/10 to-cyan-neon/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <h2 className="text-xl md:text-3xl font-orbitron font-bold text-white italic relative z-10">
              "To create self-defending systems that eliminate cyber threats before they happen."
            </h2>
            <p className="text-purple-neon font-bold tracking-widest mt-6 relative z-10">— THE VISION</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl font-orbitron font-bold text-cyan-neon mb-8 text-right border-b border-white/10 pb-4">Achievements</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "AI Cybersecurity Platform", desc: "Creator of Sybrai core engine." },
                { title: "Threat Detection System", desc: "Built advanced prediction models." },
                { title: "Real-time Monitoring", desc: "Engineered high-scale graph networks." },
              ].map((achieve, i) => (
                <div key={i} className="glass-panel p-6 rounded-xl hover:glow-cyan transition-shadow">
                   <h3 className="font-bold text-white mb-2">{achieve.title}</h3>
                   <p className="text-sm text-gray-400">{achieve.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Core Team Section */}
          <motion.div 
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8 }}
             className="pt-10"
          >
             <h2 className="text-3xl font-orbitron font-bold mb-4 text-center">SYBRAI <span className="text-purple-neon">CORE NODES</span></h2>
             <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">The brilliant cyber-specialists powering our ecosystem.</p>

             <div className="grid md:grid-cols-3 gap-8">
               {team.map((member, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.2, duration: 0.5 }}
                   className="glass-panel rounded-2xl overflow-hidden hover:glow-cyan group relative transition-all duration-500"
                 >
                   <div className="h-48 overflow-hidden relative">
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent z-10 opacity-80" />
                     {/* The generated avatar */}
                     <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   </div>
                   
                   <div className="p-6 relative z-20 -mt-8 bg-black/50 backdrop-blur-sm border-t border-white/10 h-full">
                     <h3 className="text-xl font-bold font-orbitron text-white">{member.name}</h3>
                     <p className={`text-sm font-semibold tracking-wider uppercase mb-6 ${member.iconColor}`}>{member.role}</p>

                     {/* Animated Social Matrix */}
                     <div className="flex flex-col gap-3">
                       <div className="flex items-center gap-3">
                         <div className="p-2 border border-white/10 rounded-lg bg-white/5 group-hover:border-cyan-neon transition-colors">
                            <Users className="w-4 h-4 text-gray-300 group-hover:text-cyan-neon transition-colors" />
                         </div>
                         <div className="text-sm font-mono text-gray-400">
                           Social Grid: <strong className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"><AnimatedCounter from={0} to={member.followers} /></strong>
                         </div>
                       </div>
                       
                       <div className="flex gap-3 mt-2">
                         <a href="#" className="p-2 glass-panel rounded-lg hover:bg-cyan-neon text-gray-400 hover:text-black transition-all">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                         </a>
                         <a href="#" className="p-2 glass-panel rounded-lg hover:bg-cyan-neon text-gray-400 hover:text-black transition-all">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                         </a>
                         <a href="#" className="p-2 glass-panel rounded-lg hover:bg-cyan-neon text-gray-400 hover:text-black transition-all">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                         </a>
                       </div>
                     </div>
                   </div>
                 </motion.div>
               ))}
             </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9, filter: "blur(15px)" }}
             whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
             transition={{ duration: 1.5, ease: "easeInOut" }}
             viewport={{ once: true }}
             className="text-center py-20 border-t border-white/10"
          >
             <h2 className="text-2xl md:text-4xl font-semibold text-gray-300 font-serif italic mb-6">
               "Security is no longer reactive.<br/> <span className="text-white not-italic font-orbitron glow-text text-5xl mt-4 block">It must be intelligent.</span>"
             </h2>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
