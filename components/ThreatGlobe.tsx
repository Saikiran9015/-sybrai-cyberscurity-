"use client";

import Globe from "react-globe.gl";
import { useEffect, useRef, useState } from "react";

export default function ThreatGlobe() {
  const globeEl = useRef<any>(null);
  const [arcsData, setArcsData] = useState<any[]>([]);

  useEffect(() => {
    // Generate random arcs for attacks
    const generateArcs = () => {
       const N = 15;
       const arcs = [...Array(N).keys()].map(() => ({
         startLat: (Math.random() - 0.5) * 180,
         startLng: (Math.random() - 0.5) * 360,
         endLat: (Math.random() - 0.5) * 180,
         endLng: (Math.random() - 0.5) * 360,
         color: Math.random() > 0.5 ? ['#FF0055', '#00F5FF'] : ['#7B61FF', '#00F5FF']
       }));
       setArcsData(arcs);
    };

    generateArcs();

    if (globeEl.current) {
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 1.2;
    }
    
    const interval = setInterval(generateArcs, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Globe
      ref={globeEl}
      width={700}
      height={600}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      backgroundColor="rgba(0,0,0,0)"
      showAtmosphere={true}
      atmosphereColor="#00F5FF"
      atmosphereAltitude={0.15}
      arcsData={arcsData}
      arcColor="color"
      arcDashLength={() => Math.random()}
      arcDashGap={() => Math.random()}
      arcDashAnimateTime={() => Math.random() * 4000 + 500}
      arcStroke={1.5}
    />
  );
}
