"use client";

import { motion } from "framer-motion";
import { Download as DownloadIcon, Monitor, Apple, Terminal, Smartphone, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import HolographicShield from "@/components/HolographicShield";

export default function Download() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLaunched, setIsLaunched] = useState(false);

  useEffect(() => {
    const targetDate = new Date("2026-10-01T00:00:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsLaunched(true);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = (os: string) => {
    setDownloading(os);
    setTimeout(() => {
      setDownloading(null);
      
      let fileUrl = "";
      let fileName = "";
      
      if (os === 'Windows') { fileUrl = "/downloads/SybraiWindows.exe"; fileName = "Sybrai_Installer.exe"; }
      if (os === 'Linux') { fileUrl = "/downloads/SybraiLinux.deb"; fileName = "Sybrai_Linux.deb"; }
      if (os === 'macOS') { fileUrl = "/downloads/SybraiMac.dmg"; fileName = "Sybrai_Mac.dmg"; }
      if (os === 'Android') { fileUrl = "/downloads/SybraiAndroid.apk"; fileName = "SybraiApp.apk"; }
      
      if (fileUrl) {
         const link = document.createElement("a");
         link.href = fileUrl;
         link.download = fileName;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
      }
    }, 2000);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen text-center">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-6">
          Download Sybrai <span className="text-cyan-neon">Antivirus</span>
        </h1>
        
        {!isLaunched ? (
          <div className="mb-8">
            <p className="text-purple-neon font-bold mb-4 tracking-widest text-sm">GLOBAL LAUNCH COUNTDOWN</p>
            <div className="flex justify-center gap-4">
               <div className="glass-panel p-4 rounded-xl min-w-[80px]">
                 <div className="text-3xl font-orbitron font-bold text-cyan-neon">{timeLeft.days}</div>
                 <div className="text-xs text-gray-500 mt-1">DAYS</div>
               </div>
               <div className="glass-panel p-4 rounded-xl min-w-[80px]">
                 <div className="text-3xl font-orbitron font-bold text-cyan-neon">{timeLeft.hours}</div>
                 <div className="text-xs text-gray-500 mt-1">HOURS</div>
               </div>
               <div className="glass-panel p-4 rounded-xl min-w-[80px]">
                 <div className="text-3xl font-orbitron font-bold text-cyan-neon">{timeLeft.minutes}</div>
                 <div className="text-xs text-gray-500 mt-1">MINS</div>
               </div>
               <div className="glass-panel p-4 rounded-xl min-w-[80px]">
                 <div className="text-3xl font-orbitron font-bold text-cyan-neon">{timeLeft.seconds}</div>
                 <div className="text-xs text-gray-500 mt-1">SECS</div>
               </div>
            </div>
            <p className="text-gray-400 mt-6 text-sm">
              Downloads will unlock instantly on October 1, 2026.
            </p>
          </div>
        ) : (
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            The software is now globally available! Get the best and smartest protection for your personal computer or phone right now.
          </p>
        )}

        {/* 3D Rotating Holographic Shield */}
        <div className="w-full mb-12">
           <HolographicShield />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
           <div className="glass-panel p-8 rounded-2xl flex flex-col items-center hover:glow-cyan transition-shadow">
             <Monitor className="w-12 h-12 text-cyan-neon mb-4" />
             <h3 className="font-bold text-xl mb-2">Windows</h3>
             <p className="text-xs text-gray-500 mb-6">Windows 10/11 64-bit</p>
             <button 
               onClick={() => handleDownload('Windows')}
               className="w-full py-2 bg-white/10 hover:bg-cyan-neon hover:text-black rounded transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
               disabled={!isLaunched || !!downloading}
             >
               {!isLaunched ? <><Lock className="w-4 h-4"/> Locked</> : downloading === 'Windows' ? 'Downloading...' : <><DownloadIcon className="w-4 h-4"/> Download</>}
             </button>
           </div>

           <div className="glass-panel border-purple-neon/30 p-8 rounded-2xl flex flex-col items-center hover:glow-purple transition-shadow relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-purple-neon text-xs font-bold px-2 py-1 rounded-bl-lg text-black">RECOMMENDED</div>
             <Terminal className="w-12 h-12 text-purple-neon mb-4" />
             <h3 className="font-bold text-xl mb-2">Linux</h3>
             <p className="text-xs text-gray-500 mb-6">Ubuntu 20.04+, Debian</p>
             <button 
               onClick={() => handleDownload('Linux')}
               className="w-full py-2 bg-purple-neon text-black hover:shadow-[0_0_15px_rgba(123,97,255,0.8)] rounded transition font-bold disabled:opacity-50 flex items-center justify-center gap-2"
               disabled={!isLaunched || !!downloading}
             >
               {!isLaunched ? <><Lock className="w-4 h-4"/> Locked</> : downloading === 'Linux' ? 'Downloading...' : <><DownloadIcon className="w-4 h-4"/> Download</>}
             </button>
           </div>

           <div className="glass-panel p-8 rounded-2xl flex flex-col items-center hover:glow-cyan transition-shadow">
             <Apple className="w-12 h-12 text-cyan-neon mb-4" />
             <h3 className="font-bold text-xl mb-2">macOS</h3>
             <p className="text-xs text-gray-500 mb-6">macOS 12.0+ (M1/Intel)</p>
             <button 
               onClick={() => handleDownload('macOS')}
               className="w-full py-2 bg-white/10 hover:bg-cyan-neon hover:text-black rounded transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
               disabled={!isLaunched || !!downloading}
             >
               {!isLaunched ? <><Lock className="w-4 h-4"/> Locked</> : downloading === 'macOS' ? 'Downloading...' : <><DownloadIcon className="w-4 h-4"/> Download</>}
             </button>
           </div>

           <div className="glass-panel p-8 rounded-2xl flex flex-col items-center hover:glow-cyan transition-shadow">
             <Smartphone className="w-12 h-12 text-cyan-neon mb-4" />
             <h3 className="font-bold text-xl mb-2">Android</h3>
             <p className="text-xs text-gray-500 mb-6">Android 10+ (APK)</p>
             <button 
               onClick={() => handleDownload('Android')}
               className="w-full py-2 bg-white/10 hover:bg-cyan-neon hover:text-black rounded transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
               disabled={!isLaunched || !!downloading}
             >
               {!isLaunched ? <><Lock className="w-4 h-4"/> Locked</> : downloading === 'Android' ? 'Downloading...' : <><DownloadIcon className="w-4 h-4"/> Download</>}
             </button>
           </div>
        </div>

        {/* Progress Bar Demo */}
        {downloading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 max-w-md mx-auto p-6 glass-panel rounded-xl">
             <p className="text-sm font-mono text-cyan-neon mb-2">Establishing secure connection... {downloading}</p>
             <div className="w-full h-2 bg-black rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-gradient-to-r from-purple-neon to-cyan-neon shadow-[0_0_10px_#00F5FF]"
                 initial={{ width: "0%" }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 1.8, ease: "linear" }}
               />
             </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
