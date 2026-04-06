"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Cpu } from "lucide-react";

function WaveParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create a grid of points
  const segmentsX = 150;
  const segmentsZ = 40;
  const count = segmentsX * segmentsZ;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    let i = 0;
    
    const colorCyan = new THREE.Color("#00F5FF");
    const colorPurple = new THREE.Color("#7B61FF");
    
    for (let ix = 0; ix < segmentsX; ix++) {
      for (let iz = 0; iz < segmentsZ; iz++) {
        // Spread points out
        const x = (ix - segmentsX / 2) * 0.15;
        const z = (iz - segmentsZ / 2) * 0.15;
        const y = 0; // y will be animated
        
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
        
        // Gradient color: Cyan to Purple based on depth (Z)
        const mixRatio = iz / segmentsZ;
        const vertexColor = colorCyan.clone().lerp(colorPurple, mixRatio);
        
        // Occasionally make a point bright white to simulate data packets
        if (Math.random() > 0.95) {
            col[i * 3] = 1;
            col[i * 3 + 1] = 1;
            col[i * 3 + 2] = 1;
        } else {
            col[i * 3] = vertexColor.r;
            col[i * 3 + 1] = vertexColor.g;
            col[i * 3 + 2] = vertexColor.b;
        }
        
        i++;
      }
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // Animate the wave
    const time = state.clock.getElapsedTime() * 1.5;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    let i = 0;
    for (let ix = 0; ix < segmentsX; ix++) {
      for (let iz = 0; iz < segmentsZ; iz++) {
        const x = (ix - segmentsX / 2) * 0.15;
        const z = (iz - segmentsZ / 2) * 0.15;
        
        // Complex sine wave math for flowing organic ribbon
        const y = Math.sin(x * 0.5 + time) * 1.0 + Math.cos(z * 0.8 + time * 0.8) * 0.5;
        
        positions[i * 3 + 1] = y;
        i++;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.06} 
        vertexColors={true} 
        transparent 
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function DataStreamWave() {
  return (
    <div className="w-full max-w-5xl mx-auto glass-panel border border-cyan-neon/20 rounded-2xl p-4 md:p-8 relative overflow-hidden bg-black/60 shadow-[0_0_40px_rgba(0,245,255,0.1)]">
       {/* UI Header */}
       <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 relative z-20">
          <div className="flex items-center gap-3 text-cyan-neon">
             <Cpu className="w-6 h-6 animate-pulse" />
             <h3 className="font-orbitron font-bold tracking-widest textShadow">DATA STREAM TELEMETRY</h3>
          </div>
          <div className="text-xs font-mono border border-cyan-neon/30 text-cyan-neon px-3 py-1 rounded bg-cyan-neon/10 animate-pulse">
             ANALYZING TRAFFIC
          </div>
       </div>

       {/* Simulation Arena */}
       <div className="w-full h-[400px] bg-[#020202] relative rounded-xl border border-white/5 overflow-hidden">
           {/* Background glow lines */}
           <div className="absolute inset-0 bg-gradient-to-t from-purple-neon/20 via-cyan-neon/5 to-transparent blur-[60px] pointer-events-none" />
           
           <Canvas camera={{ position: [5, 3, 5], fov: 50 }} className="absolute inset-0 z-10 pointer-events-none">
             <fog attach="fog" args={["#020202", 3, 12]} />
             <WaveParticles />
           </Canvas>
           
           {/* UI Overlay on top of 3D Canvas */}
           <div className="absolute top-4 left-4 z-20">
               <div className="text-xs font-mono text-cyan-neon/70">PACKET INTERCEPTION: ENGAGED</div>
               <div className="text-[10px] font-mono text-purple-neon/70 mt-1">LATENCY: 4ms</div>
           </div>
       </div>
    </div>
  );
}
