"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

function Particles() {
  const count = 300;
  const pointsRef = useRef<THREE.Points>(null);
  
  // Track mouse explicitly within canvas space
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // normalize
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initPos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
       // Spread them out fully
       const x = (Math.random() - 0.5) * 20;
       const y = (Math.random() - 0.5) * 20;
       const z = (Math.random() - 0.5) * 20;
       
       pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z;
       initPos[i*3] = x; initPos[i*3+1] = y; initPos[i*3+2] = z;
    }
    return [pos, initPos];
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x += 0.0005;

      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
         const i3 = i * 3;
         // Slight sine wave bobbing
         positions[i3 + 1] = initialPositions[i3 + 1] + Math.sin(state.clock.elapsedTime + initialPositions[i3]) * 0.5;

         // Interaction: Repel from mouse slightly
         // Because canvas coordinates vs mouse coordinates are tricky, we'll apply a macro repel based on mouse vector
         const dx = positions[i3] - (mouse.x * 10);
         const dy = positions[i3 + 1] - (mouse.y * 10);
         const distance = Math.sqrt(dx*dx + dy*dy);
         if (distance < 3) {
            positions[i3] += dx * 0.02;
            positions[i3+1] += dy * 0.02;
         } else {
            // Return towards original X slowly
            positions[i3] += (initialPositions[i3] - positions[i3]) * 0.05;
         }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#7B61FF"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

export default function ParticleNetwork() {
  return (
    <div className="absolute inset-0 z-[-1] pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <Particles />
      </Canvas>
    </div>
  );
}
