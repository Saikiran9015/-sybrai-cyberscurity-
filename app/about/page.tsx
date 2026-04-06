"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-orbitron text-4xl md:text-6xl font-bold mb-6 text-cyan-neon">
          About Sybrai
        </h1>
        <p className="text-xl text-gray-300 mb-12">
          Making the internet a safer place for everyone using smart AI.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="glass-panel p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 text-purple-neon">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">
              To keep you safe by automatically blocking viruses and hackers without you ever needing to worry.
            </p>
          </div>
          <div className="glass-panel p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 text-cyan-neon">Vision</h2>
            <p className="text-gray-400 leading-relaxed">
              A world where you can browse the internet stress-free while our smart tool protects you from hackers in the background.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-orbitron font-bold mb-10 text-center">Core Technologies</h2>
          <div className="space-y-6 relative border-l-2 border-white/10 pl-6 ml-4">
             <div className="relative">
               <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-cyan-neon glow-cyan"></span>
               <h3 className="text-xl font-bold text-white">Smart Learning Tech</h3>
               <p className="text-gray-400 mt-2">Sybrai learns fast and checks millions of websites to keep you secure.</p>
             </div>
             <div className="relative">
               <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-purple-neon glow-purple"></span>
               <h3 className="text-xl font-bold text-white">Fast Cloud Protection</h3>
               <p className="text-gray-400 mt-2">Our servers run super fast to keep your internet connection smooth and safe.</p>
             </div>
             <div className="relative">
               <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-cyan-neon glow-cyan"></span>
               <h3 className="text-xl font-bold text-white">Global Safety Network</h3>
               <p className="text-gray-400 mt-2">If we find a dangerous virus anywhere, we instantly protect all our users against it.</p>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
