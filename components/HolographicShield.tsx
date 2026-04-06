"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Sphere, Torus, MeshDistortMaterial, Float, Sparkles } from "@react-three/drei";

function ShieldCore() {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const ringsRef2 = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.y += 0.2 * delta;
      outerRef.current.rotation.x += 0.1 * delta;
      
      // Pulse outer shield opacity slightly
      const pulse = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      (outerRef.current.material as THREE.MeshPhysicalMaterial).opacity = pulse;
    }
    
    if (innerRef.current) {
      innerRef.current.rotation.y -= 0.5 * delta;
      innerRef.current.rotation.z += 0.2 * delta;
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.x += 0.8 * delta;
      ringsRef.current.rotation.y += 0.5 * delta;
    }
    
    if (ringsRef2.current) {
      ringsRef2.current.rotation.x -= 0.6 * delta;
      ringsRef2.current.rotation.z += 0.7 * delta;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group>
        {/* Outer Energy Shield Envelope */}
        <Sphere ref={outerRef} args={[2.5, 32, 32]}>
          <meshPhysicalMaterial 
            color="#00F5FF"
            transparent 
            opacity={0.15}
            roughness={0.1}
            transmission={0.9}
            thickness={1}
            wireframe={true}
          />
        </Sphere>
        
        {/* Inner Security Gyroscope Rings */}
        <group ref={ringsRef}>
          <Torus args={[3.2, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#7B61FF" emissive="#7B61FF" emissiveIntensity={2} />
          </Torus>
          <Torus args={[2.8, 0.04, 16, 100]} rotation={[0, Math.PI / 2, 0]}>
            <meshStandardMaterial color="#00F5FF" emissive="#00F5FF" emissiveIntensity={2} />
          </Torus>
        </group>
        
        {/* Counter-rotating Gyroscope Rings */}
        <group ref={ringsRef2}>
          <Torus args={[3.0, 0.03, 16, 100]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <meshStandardMaterial color="#7B61FF" emissive="#7B61FF" emissiveIntensity={2} wireframe />
          </Torus>
          <Torus args={[2.6, 0.05, 16, 100]} rotation={[0, 0, Math.PI / 4]}>
            <meshStandardMaterial color="#00F5FF" emissive="#00F5FF" emissiveIntensity={3} />
          </Torus>
        </group>

        {/* Inner Distorting Emissive Core (The 'Shield' Node Power Source) */}
        <Sphere ref={innerRef} args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color="#00F5FF"
            emissive="#004455"
            emissiveIntensity={2}
            distort={0.4}
            speed={3}
            roughness={0.2}
            metalness={0.8}
            wireframe
          />
        </Sphere>

        {/* Ambient Particle Energy Field */}
        <Sparkles count={150} scale={6} size={2} speed={0.4} opacity={0.8} color="#00F5FF" />
        <Sparkles count={100} scale={7} size={1.5} speed={0.6} opacity={0.6} color="#7B61FF" />

        <pointLight position={[0, 0, 0]} intensity={15} color="#00F5FF" distance={10} />
      </group>
    </Float>
  );
}

export default function HolographicShield() {
  return (
    <div className="w-full h-[400px] pointer-events-none relative flex items-center justify-center">
      {/* Background neon bloom aura */}
      <div className="absolute w-[300px] h-[300px] bg-cyan-neon/10 rounded-full blur-[100px] z-0" />
      <div className="absolute w-[200px] h-[200px] bg-purple-neon/20 rounded-full blur-[80px] z-0" />
      
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} className="z-10 absolute inset-0">
        <ambientLight intensity={0.5} />
        <ShieldCore />
      </Canvas>
    </div>
  );
}
