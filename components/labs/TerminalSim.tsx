"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface TerminalSimProps {
  onCommand: (cmd: string) => void;
  output: string[];
}

export default function TerminalSim({ onCommand, output }: TerminalSimProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-[400px] w-full glass-panel rounded-xl overflow-hidden font-mono text-sm border-white/20">
      <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <div className="text-gray-500 text-xs">kali@sybrai: ~</div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-black/40"
      >
        {output.map((line, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-1 ${line.startsWith('>') ? 'text-cyan-neon' : 'text-gray-300'}`}
          >
            {line}
          </motion.div>
        ))}
        
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
          <span className="text-purple-neon">student@sybrai:~$</span>
          <input
            autoFocus
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 p-0"
          />
        </form>
      </div>
    </div>
  );
}
