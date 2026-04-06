"use client";

import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function ThreatDashboard() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate initial flat-ish data
    const initData = Array.from({ length: 20 }).map((_, i) => ({
      time: i,
      threats: Math.floor(Math.random() * 50) + 10,
    }));
    setData(initData);

    const interval = setInterval(() => {
      setData((currentData) => {
        const newData = [...currentData.slice(1)];
        // Spikes simulate attacks
        const isSpike = Math.random() > 0.8;
        newData.push({
          time: currentData[currentData.length - 1].time + 1,
          threats: isSpike ? Math.floor(Math.random() * 300) + 100 : Math.floor(Math.random() * 50) + 10,
        });
        return newData;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full min-h-[200px] bg-black/50 p-4 rounded-xl border border-white/5 relative">
       {/* Blinking Attack Dots overlay */}
       <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {data.map((d, i) => d.threats > 200 && (
            <motion.div 
               key={d.time}
               initial={{ opacity: 1, scale: 0 }}
               animate={{ opacity: 0, scale: 3 }}
               transition={{ duration: 1 }}
               className="absolute w-4 h-4 bg-red-500 rounded-full"
               style={{ left: `${(i / 20) * 100}%`, top: `${100 - (d.threats / 400) * 100}%` }}
            />
          ))}
       </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#7B61FF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="time" hide />
          <YAxis hide domain={[0, 400]} />
          <Tooltip 
            contentStyle={{ backgroundColor: "#0A0A0A", borderColor: "#7B61FF", borderRadius: "8px" }} 
            itemStyle={{ color: "#00F5FF" }} 
            labelStyle={{ display: "none" }}
          />
          <Area 
            type="monotone" 
            dataKey="threats" 
            stroke="#00F5FF" 
            fillOpacity={1} 
            fill="url(#colorThreats)" 
            isAnimationActive={true}
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
