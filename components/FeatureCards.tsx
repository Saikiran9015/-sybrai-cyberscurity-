"use client";

import { Shield, Brain, Activity, Lock } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Smart AI Protection",
    description: "Our smart program spots viruses and stops them automatically before they ever reach you.",
    icon: <Brain className="w-8 h-8 text-cyan-neon" />,
    delay: 0.1,
  },
  {
    title: "Always On Guard",
    description: "We constantly watch over your network to block dangerous websites and bad downloads.",
    icon: <Activity className="w-8 h-8 text-purple-neon" />,
    delay: 0.2,
  },
  {
    title: "Always Safe Browsing",
    description: "Every connection is automatically double-checked to guarantee you are totally safe online.",
    icon: <Lock className="w-8 h-8 text-cyan-neon" />,
    delay: 0.3,
  },
  {
    title: "Automatic Fixes",
    description: "Sybrai fixes problems on its own, so you don't have to lift a finger to stay secure.",
    icon: <Shield className="w-8 h-8 text-purple-neon" />,
    delay: 0.4,
  },
];

export default function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-20 px-6 max-w-7xl mx-auto">
      {features.map((feature, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: feature.delay, duration: 0.5 }}
          className="glass-panel p-6 rounded-2xl hover:glow-cyan transition-all duration-500 group relative overflow-hidden"
        >
          {/* Background glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-neon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="mb-6">{feature.icon}</div>
          <h3 className="text-xl font-orbitron font-semibold mb-3 text-white">
            {feature.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
