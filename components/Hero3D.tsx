"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function InfiniteGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current) {
      // Moves the grid towards the camera to create infinite forward motion
      const speed = 2; // grid scroll speed
      gridRef.current.position.z = (state.clock.elapsedTime * speed) % 2;
    }
  });

  return (
    <group position={[0, -1.5, 0]}>
      {/* Primary Cyan Grid */}
      <gridHelper 
        ref={gridRef} 
        args={[100, 100, 0x00F5FF, 0x00F5FF]} 
        position={[0, 0, 0]} 
      />
      {/* Fading away into the distance using fog */}
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 1.5, 5], fov: 60 }} className="w-full h-full">
        <fog attach="fog" args={["#0A0A0A", 2, 15]} />
        <ambientLight intensity={0.5} />
        <InfiniteGrid />
      </Canvas>
      {/* Vertical gradient to blend the top of the grid smoothly */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-bg-dark/50 to-bg-dark" />
    </div>
  );
}
