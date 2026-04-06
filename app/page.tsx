"use client";

import Hero3D from "@/components/Hero3D";
import AnimatedGrid from "@/components/AnimatedGrid";
import FeatureCards from "@/components/FeatureCards";
import GlobalThreatDashboard from "@/components/GlobalThreatDashboard";
import DataStreamWave from "@/components/DataStreamWave";
import TacticalHUD from "@/components/TacticalHUD";
import { motion } from "framer-motion";
import Link from "next/link";
import { Activity, Shield, Lock, Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A]">
      <AnimatedGrid />
      <TacticalHUD />
      
      {/* Hero Section */}
      <section id="hero-section" className="relative h-screen flex items-center justify-center overflow-hidden">
        <Hero3D />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/40 to-black/80 pointer-events-none" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block py-1 px-3 rounded-full glass-panel border border-cyan-neon/40 text-cyan-neon text-sm font-semibold mb-6 tracking-widest"
          >
            SYBRAI ENGINE v4.2 ONLINE
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-orbitron text-5xl md:text-[5.5rem] font-bold mb-6 tracking-tighter leading-[0.9]"
          >
            THE FUTURE OF <br className="hidden md:block"/>
            <span className="text-gradient">CYBER DEFENSE</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-400 text-lg md:text-xl mb-10 font-mono uppercase tracking-[0.2em] max-w-2xl mx-auto opacity-70"
          >
            Automatically detecting & neutralizing digital threats before they reach your network. Simple for everyone.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link id="cta-download-btn" href="/download" className="w-full sm:w-auto button-primary text-center">
              Download Now
            </Link>
            <Link id="cta-explore-btn" href="/learn" className="w-full sm:w-auto px-8 py-3 glass-panel border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300 text-center">
              Explore Tech
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Global Threat Intelligence Dashboard */}
      <section id="simulation-section" className="py-20 relative z-10 px-4">
          <GlobalThreatDashboard />
      </section>

      {/* Data Stream Wave Animation */}
      <section id="ai-attack-section" className="py-20 bg-[#0A0A0A] relative z-10 px-4 border-t border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold">
            Real-Time <span className="text-cyan-neon">Data Streams</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Sybrai constantly checks all your internet traffic to keep you secure. Watch how data safely flows across your network.
          </p>
        </motion.div>
        
        <DataStreamWave />
      </section>

      {/* Features Section */}
      <section id="features-section" className="relative z-10 bg-[#0A0A0A]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center pt-20 px-6"
        >
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold">
            Why <span className="text-cyan-neon">Sybrai?</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Easily protect yourself with the smartest AI security tool built for everyday users.
          </p>
        </motion.div>
        <FeatureCards />
      </section>
    </div>
  );
}
