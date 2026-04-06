"use client";

import { motion } from "framer-motion";
import { Shield, Award, Calendar, Download, Share2, Star, CheckCircle, QrCode } from "lucide-react";
import { useRef, useMemo, useState, useEffect } from "react";

interface CertificateProps {
  userName: string;
  courseTitle: string;
  date: string;
}

export default function Certificate({ userName, courseTitle, date }: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);

  // Generate a Unique Certificate ID only on the client to avoid hydration mismatch
  const [certId, setCertId] = useState<string>("SYB-2026-PENDING");

  useEffect(() => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCertId(`SYB-2026-${random}`);
  }, []);

  const printCertificate = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center gap-8 py-10 w-full printable-certificate">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        ref={certRef}
        className="w-[842px] h-[595px] bg-[#0A0A0A] relative overflow-hidden shadow-[0_0_100px_rgba(0,245,255,0.15)] border-none rounded-none"
      >
        {/* Neon Gradient Border (Cyan -> Blue -> Purple) */}
        <div className="absolute inset-0 p-[2px] bg-gradient-to-r from-[#00F5FF] via-[#3B82F6] to-[#7B61FF]">
          <div className="w-full h-full bg-[#0A0A0A] relative flex flex-col p-10 overflow-hidden">
            
            {/* Background Texture / Grid Overlay */}
            <div className="absolute inset-0 bg-grid-cyber opacity-10 pointer-events-none" />
            
            {/* Glass-style Background Accent */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-purple-neon/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-cyan-neon/5 via-transparent to-transparent pointer-events-none" />

            {/* HEADER: MSME Logo | SYBRAI LOGO */}
            <div className="flex justify-between items-start z-10 mb-6 w-full">
              {/* MSME LOGO - Standard Size */}
              <div className="w-20 h-20 flex items-center justify-center">
                 <img src="/msme.png" alt="MSME Logo" className="w-full h-full object-contain" />
              </div>

              {/* SYBRAI LOGO - Standard Size */}
              <div className="w-20 h-20 flex items-center justify-center">
                 <img src="/logo_sybrai.png" alt="Sybrai Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* CORE CONTENT */}
            <div className="flex-1 flex flex-col items-center justify-center text-center z-10 py-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-cyan-neon font-orbitron text-sm font-bold tracking-[0.5em] uppercase">Certificate of Completion</h3>
                  <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-neon/50 to-transparent mx-auto" />
                </div>

                <div className="space-y-2">
                   <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">This is to certify that student agent</p>
                   <h1 className="text-5xl font-cinzel font-bold text-white tracking-widest bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text">
                      {userName.toUpperCase()}
                   </h1>
                </div>

                <div className="max-w-xl mx-auto space-y-4">
                   <p className="text-[11px] text-gray-400 font-light leading-relaxed tracking-wide">
                     Has successfully mastered the professional curriculum and tactical requirements for the specialized track in
                   </p>
                   <div className="relative inline-block px-12 py-3">
                      <div className="absolute inset-0 bg-cyan-neon/5 border border-cyan-neon/20 skew-x-[-12deg] rounded-lg" />
                      <h2 className="relative text-2xl font-orbitron font-bold text-cyan-neon tracking-wider">
                        {courseTitle.toUpperCase()}
                      </h2>
                   </div>
                   <p className="text-[10px] text-gray-500 font-mono tracking-[0.2em] italic">
                     Demonstrating exceptional proficiency in cybersecurity protocols and network defense.
                   </p>
                </div>
              </motion.div>
            </div>

            {/* FOOTER: Date | ID | SIGNATURE */}
            <div className="flex justify-between items-end z-10 pt-4 border-t border-white/5 w-full px-2">
              {/* Left: Date */}
              <div className="flex flex-col gap-1">
                 <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Date Issued</span>
                 <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                    <Calendar className="w-3 h-3 text-cyan-neon" /> {date}
                 </div>
              </div>

              {/* Center: Unique ID */}
              <div className="flex flex-col items-center gap-1 pb-2">
                 <div className="text-[7px] text-gray-600 font-bold uppercase tracking-widest">Verification Node ID</div>
                 <div className="px-4 py-1 bg-white/5 border border-white/5 rounded text-[10px] font-mono text-cyan-neon/70 tracking-widest">
                   {certId}
                 </div>
              </div>

              {/* Right: Signature */}
              <div className="flex flex-col items-center gap-2">
                 <div className="relative px-6">
                    {/* Simulated elegant digital signature */}
                    {/* Digital signature image */}
                    <img src="/sw.png" alt="Signature" className="h-16 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
                    <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
                 </div>
                 <div className="flex flex-col items-center">
                    <span className="text-[8px] text-white font-bold tracking-widest uppercase">SYBRAI ACADEMY</span>
                    <span className="text-[7px] text-gray-600 tracking-widest uppercase">Director of Intelligence</span>
                 </div>
              </div>
            </div>

            {/* Corner Decorative Ornaments */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-cyan-neon/30 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-cyan-neon/30 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-cyan-neon/30 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-cyan-neon/30 rounded-br-lg" />

          </div>
        </div>
      </motion.div>

      {/* Control Overlay (Hidden during print) */}
      <div className="flex gap-6 print:hidden">
         <button 
           onClick={printCertificate} 
           className="px-12 py-4 bg-gradient-to-r from-cyan-neon to-purple-neon text-white font-bold rounded-xl flex items-center gap-3 shadow-[0_0_40px_rgba(0,245,255,0.3)] hover:shadow-[0_0_60px_rgba(123,97,255,0.4)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs"
         >
            <Download className="w-5 h-5" /> Download Professional PDF
         </button>
         <button onClick={() => window.print()} className="glass-panel px-10 py-4 border-white/10 text-white font-bold rounded-xl flex items-center gap-3 hover:bg-white/5 transition-all uppercase tracking-widest text-xs">
            <Share2 className="w-4 h-4" /> Verify Credential
         </button>
      </div>
    </div>
  );
}
