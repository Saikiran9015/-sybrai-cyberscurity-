"use client";

import { motion } from "framer-motion";

interface NetworkMapProps {
  activeNodes: number[];
  isAttacking: boolean;
}

export default function NetworkMap({ activeNodes, isAttacking }: NetworkMapProps) {
  const nodes = [
    { id: 1, x: 50, y: 50, label: "Your PC" },
    { id: 2, x: 200, y: 150, label: "Router" },
    { id: 3, x: 350, y: 50, label: "Web Server" },
    { id: 4, x: 350, y: 250, label: "Database" },
  ];

  const connections = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 2, to: 4 },
  ];

  return (
    <div className="w-full h-[400px] glass-panel rounded-xl flex items-center justify-center p-8 bg-black/20">
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Connections */}
        {connections.map((conn, i) => {
          const from = nodes.find((n) => n.id === conn.from)!;
          const to = nodes.find((n) => n.id === conn.to)!;
          return (
            <motion.line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={isAttacking ? "rgba(255, 59, 59, 0.5)" : "rgba(0, 245, 255, 0.2)"}
              strokeWidth="2"
              strokeDasharray="4 4"
              animate={{ 
                strokeDashoffset: isAttacking ? [0, -20] : 0 
              }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isActive = activeNodes.includes(node.id);
          return (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="10"
                fill={isActive ? (isAttacking ? "#FF3B3B" : "#00F5FF") : "#333"}
                className={isActive ? (isAttacking ? "glow-danger" : "glow-cyan") : ""}
                animate={{ scale: isActive ? [1, 1.2, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <text 
                x={node.x} 
                y={node.y + 25} 
                textAnchor="middle" 
                fill="white" 
                fontSize="10"
                className="font-mono text-xs opacity-60"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
