"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TerminalSim from "./TerminalSim";
import NetworkMap from "./NetworkMap";
import AIHelper from "./AIHelper";
import ProgressTracker from "./ProgressTracker";
import Certificate from "../Certificate";
import { ShieldCheck, AlertTriangle, Zap, ChevronRight, Award, X } from "lucide-react";

const LAB_STEPS = [
  {
    id: "recon",
    title: "Footprinting & Reconnaissance",
    objective: "Gather information about the target system 'target.com'.",
    hint: "Try using 'whois target.com' to see registered owner details or 'nslookup target.com' for DNS records.",
    command: "whois target.com",
    successOutput: [
      "> whois target.com",
      "Retrieving WHOIS record for target.com...",
      "[+] domain: target.com",
      "[+] registrar: Sybrai Safe-Registrar",
      "[+] server: ns1.sybrai.io",
      "[+] creation: 2026-01-10",
      "[*] RECON COMPLETE. Target identified."
    ],
    nextStep: "scanning"
  },
  {
    id: "scanning",
    title: "Network Scanning",
    objective: "Discover open ports and services on the target network.",
    hint: "Use 'nmap -sS target.com' to perform a stealth TCP SYN scan.",
    command: "nmap -sS target.com",
    successOutput: [
      "> nmap -sS target.com",
      "Starting Nmap 7.92 ( https://nmap.org ) at 2026-04-06 02:10 UTC",
      "Nmap scan report for target.com (192.168.1.42)",
      "Host is up (0.00042s latency).",
      "Not shown: 998 closed ports",
      "PORT   STATE SERVICE",
      "22/tcp open  ssh",
      "80/tcp open  http",
      "[*] SCANNING COMPLETE. Ports 22 and 80 are vulnerable."
    ],
    nextStep: "enumeration"
  },
  {
    id: "enumeration",
    title: "Enumeration",
    objective: "Find specific vulnerabilities in the open services.",
    hint: "Try to detect service versions using 'nmap -sV target.com'.",
    command: "nmap -sV target.com",
    successOutput: [
      "> nmap -sV target.com",
      "Scanning service versions...",
      "PORT   STATE SERVICE VERSION",
      "22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.8",
      "80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))",
      "[!] VULNERABILITY FOUND: CVE-2026-4242 in Apache 2.4.18"
    ],
    nextStep: "exploitation"
  },
  {
    id: "exploitation",
    title: "Exploitation Basics",
    objective: "Exploit the identified vulnerability to gain a shell.",
    hint: "Run the exploit command: './exploit --target target.com'.",
    command: "./exploit --target target.com",
    successOutput: [
      "> ./exploit --target target.com",
      "[*] Launching exploit for CVE-2026-4242...",
      "[*] Sending payload (1024 bytes)...",
      "[*] Triggering buffer overflow...",
      "[+] EXPLOIT SUCCESSFUL.",
      "[+] Opening reverse shell on port 4444...",
      "student@target-machine:~$ "
    ],
    nextStep: "privesc"
  },
  {
    id: "privesc",
    title: "Privilege Escalation",
    objective: "Gain administrative/root access on the target machine.",
    hint: "Look for misconfigured files. Type 'sudo -l' to check permissions.",
    command: "sudo -l",
    successOutput: [
      "> sudo -l",
      "Matching Defaults entries for student on target-machine:",
      "    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin\\:/snap/bin",
      "",
      "User student may run the following commands on target-machine:",
      "    (ALL : ALL) NOPASSWD: /usr/bin/find",
      "[*] MISCONFIGURATION DETECTED: 'find' can be used for privesc.",
      "student@target-machine:~$ sudo find . -exec /bin/sh \\; -quit",
      "# id",
      "uid=0(root) gid=0(root) groups=0(root)"
    ],
    nextStep: "reporting"
  },
  {
    id: "reporting",
    title: "Reporting Findings",
    objective: "Complete the mission by generating a security report.",
    hint: "Type 'generate report' to finish the lab.",
    command: "generate report",
    successOutput: [
      "> generate report",
      "[*] Finalizing security assessment...",
      "[*] Generating PDF report...",
      "[+] MISSION ACCOMPLISHED.",
      "[+] XP GRANTED: +500",
      "[+] BADGE EARNED: JUNIOR ETHICAL HACKER"
    ],
    nextStep: "complete"
  }
];

export default function LabLayout() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [output, setOutput] = useState<string[]>([
    "CONNECTED TO SYBRAI LAB NETWORK v4.2",
    "RECONNAISSANCE MODE INITIALIZED.",
    "------------------------------------",
    "Welcome student. Follow instructions to proceed."
  ]);
  const [xp, setXp] = useState(0);
  const [activeNodes, setActiveNodes] = useState<number[]>([1]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("sybrai_user");
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
  }, []);

  const handleClaimCertificate = async () => {
    const token = localStorage.getItem("sybrai_token");
    if (!token) {
      setShowCertificate(true);
      return;
    }
    try {
      const res = await fetch("/api/user/complete", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setShowCertificate(true);
      }
    } catch (err) {
      console.error("Failed to mark completion:", err);
      // Fallback for network errors to allow viewing certificate anyway
      setShowCertificate(true);
    }
  };

  const currentStep = LAB_STEPS[currentStepIndex];

  const handleCommand = (cmd: string) => {
    setOutput((prev) => [...prev, `> ${cmd}`]);

    if (cmd === currentStep.command) {
      // Success logic
      setIsAttacking(true);
      setTimeout(() => {
        setOutput((prev) => [...prev, ...currentStep.successOutput.filter(l => !l.startsWith('>'))]);
        setXp((prev) => prev + 100);
        
        // Update network map based on step
        if (currentStep.id === "recon") setActiveNodes([1, 2]);
        if (currentStep.id === "scanning") setActiveNodes([1, 2, 3, 4]);
        
        setIsAttacking(false);

        if (currentStepIndex < LAB_STEPS.length - 1) {
          setTimeout(() => {
            setCurrentStepIndex(currentStepIndex + 1);
            setOutput((prev) => [...prev, "--- NEW OBJECTIVE UNLOCKED ---"]);
          }, 1500);
        } else {
          setIsComplete(true);
        }
      }, 1000);
    } else {
      // Failure logic
      setTimeout(() => {
        setOutput((prev) => [...prev, `[-] Error: Command '${cmd}' failed or invalid for current objective.`]);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Section */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Main Interface (Left+Center) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between glass-panel p-4 rounded-xl border-white/10">
            <div className="flex items-center gap-4">
               <div className="p-2 bg-cyan-neon/20 rounded-lg">
                 <ShieldCheck className="w-6 h-6 text-cyan-neon" />
               </div>
               <div>
                 <h2 className="text-xl font-orbitron font-bold text-white tracking-widest uppercase">{currentStep.title}</h2>
                 <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 rounded-full bg-cyan-neon animate-pulse shadow-[0_0_8px_#00F5FF]" />
                   <span className="text-[10px] text-gray-500 font-mono">LAB ACTIVE • SEVERITY: LOW</span>
                 </div>
               </div>
            </div>
            <div className="hidden md:flex gap-4">
               <div className="flex flex-col items-end">
                 <span className="text-[10px] text-gray-500 uppercase tracking-widest">Efficiency</span>
                 <span className="text-sm font-mono text-white font-bold">94.2%</span>
               </div>
               <div className="flex flex-col items-end">
                 <span className="text-[10px] text-gray-500 uppercase tracking-widest">Time</span>
                 <span className="text-sm font-mono text-white font-bold">04:22:15</span>
               </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <TerminalSim onCommand={handleCommand} output={output} />
            <NetworkMap activeNodes={activeNodes} isAttacking={isAttacking} />
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-4 h-full">
          <AIHelper 
            currentLab={currentStep.objective} 
            hint={currentStep.hint} 
            xp={xp} 
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full">
        <ProgressTracker 
          currentStep={currentStepIndex} 
          totalSteps={LAB_STEPS.length} 
          steps={LAB_STEPS.map(s => s.id)}
        />
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-xl w-full glass-panel p-10 rounded-3xl border-cyan-neon/30 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-neon via-purple-neon to-cyan-neon" />
              <div className="mb-6 inline-block p-4 bg-cyan-neon/20 rounded-2xl">
                <Zap className="w-12 h-12 text-cyan-neon glow-cyan animate-bounce" />
              </div>
              <h2 className="text-4xl font-orbitron font-bold text-white mb-4">MISSION COMPLETED</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Congratulations student! You have successfully mastered the fundamentals of the Ethical Hacking Basics module. Your profile has been updated with new credentials.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">XP Earned</div>
                  <div className="text-2xl font-orbitron font-bold text-cyan-neon">+600</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Rank Up</div>
                  <div className="text-2xl font-orbitron font-bold text-purple-neon">JUNIOR HACKER</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                 <button 
                   onClick={handleClaimCertificate}
                   className="w-full py-4 button-primary flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold"
                 >
                   <Award className="w-5 h-5" /> Claim Your Certificate
                 </button>
                 <div className="flex gap-3">
                   <button onClick={() => window.location.href = '/learn'} className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition font-bold uppercase tracking-widest text-[10px]">
                     Academy
                   </button>
                   <button onClick={() => window.location.reload()} className="flex-1 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl transition font-bold uppercase tracking-widest text-[10px]">
                     Restart
                   </button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Certificate Modal */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10 overflow-y-auto"
          >
            <div className="max-w-5xl w-full relative">
              <button 
                onClick={() => setShowCertificate(false)}
                className="absolute -top-12 right-0 text-white/50 hover:text-white flex items-center gap-2 uppercase text-[10px] tracking-widest transition-colors"
              >
                CLOSE <X className="w-4 h-4" />
              </button>
              <Certificate 
                userName={userData?.name || "Student Agent"} 
                courseTitle="Ethical Hacking Basics" 
                date={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
