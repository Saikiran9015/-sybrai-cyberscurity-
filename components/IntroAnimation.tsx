"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComposableMap, Geographies, Geography, Graticule, Line, Marker } from "react-simple-maps";

const geoUrl = "/features.json";

// Random high-traffic coordinates to simulate cyber network traffic
const trafficLinks = [
  { from: [-74.006, 40.7128], to: [-0.1276, 51.5072] }, // NY to London
  { from: [-0.1276, 51.5072], to: [139.6917, 35.6895] }, // London to Tokyo
  { from: [139.6917, 35.6895], to: [151.2093, -33.8688] }, // Tokyo to Sydney
  { from: [151.2093, -33.8688], to: [-118.2437, 34.0522] }, // Sydney to LA
  { from: [-118.2437, 34.0522], to: [103.8198, 1.3521] }, // LA to Singapore
  { from: [103.8198, 1.3521], to: [55.2708, 25.2048] }, // Singapore to Dubai
  { from: [55.2708, 25.2048], to: [-74.006, 40.7128] }, // Dubai to NY
];

export default function IntroAnimation() {
  const [isVisible, setIsVisible] = useState(true);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Hide the overlay after 7 seconds
    const timer = setTimeout(() => setIsVisible(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Slowly rotate the globe over time
    let animationFrameId: number;
    let currentRotation = 0;
    
    const rotate = () => {
      currentRotation += 0.2;
      setRotation([currentRotation, -10, 0]);
      animationFrameId = requestAnimationFrame(rotate);
    };
    rotate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Animated Globe Map */}
          <motion.div 
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
            className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
          >
            <ComposableMap 
              projection="geoOrthographic" 
              projectionConfig={{ scale: 300, rotate: rotation }}
              className="w-full h-[800px] mb-20 opacity-80 mix-blend-screen"
            >
              {/* Globe background grid */}
              <Graticule stroke="#7B61FF" strokeWidth={0.2} strokeOpacity={0.3} className="globe-glow" />
              
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography 
                      key={geo.rsmKey} 
                      geography={geo} 
                      fill="rgba(0, 245, 255, 0.05)"
                      stroke="#00F5FF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none" },
                        pressed: { outline: "none" }
                      }}
                      className="map-path-animation"
                    />
                  ))
                }
              </Geographies>

              {/* Network Traffic Lines */}
              {trafficLinks.map((link, i) => (
                <Line
                  key={i}
                  from={link.from as [number, number]}
                  to={link.to as [number, number]}
                  stroke="#FF0055"
                  strokeWidth={2}
                  strokeLinecap="round"
                  className={`traffic-line traffic-line-${i}`}
                />
              ))}

              {/* Threat Nodes */}
              {trafficLinks.map((link, i) => (
                <Marker key={`marker-${i}`} coordinates={link.from as [number, number]}>
                   <circle r={3} fill="#00F5FF" className="animate-ping" />
                   <circle r={1.5} fill="#FFFFFF" />
                </Marker>
              ))}
            </ComposableMap>
          </motion.div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full mt-24">
            <div className="overflow-hidden h-32 md:h-48 flex items-center justify-center w-full">
              <motion.h1
                initial={{ y: 200, opacity: 0, rotateX: 45 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{ duration: 6, ease: [0.16, 1, 0.3, 1] }} 
                className="text-7xl md:text-9xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon to-purple-neon drop-shadow-[0_0_30px_rgba(0,245,255,0.8)]"
              >
                SYBRAI
              </motion.h1>
            </div>
            
             <div className="overflow-hidden mt-6">
                <motion.p
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeOut", delay: 3 }}
                  className="text-cyan-neon font-mono text-sm tracking-[0.5em] uppercase glow-cyan text-center"
                >
                  Global Traffic Intercepted...
                </motion.p>
             </div>
             
             <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "300px", opacity: 1 }}
                transition={{ duration: 5, ease: "easeInOut", delay: 1 }}
                className="h-1 bg-gradient-to-r from-transparent via-purple-neon to-transparent mt-8 glow-purple"
             />
          </div>
          
          <style dangerouslySetInnerHTML={{__html:`
            .globe-glow {
              filter: drop-shadow(0 0 40px rgba(123, 97, 255, 0.4));
            }
            .map-path-animation {
               stroke-dasharray: 200;
               stroke-dashoffset: 200;
               animation: drawMap 6s ease-out forwards;
            }
            @keyframes drawMap {
               to { stroke-dashoffset: 0; }
            }
            .traffic-line {
               stroke-dasharray: 50;
               stroke-dashoffset: 50;
               animation: shootTraffic 2s linear infinite;
               filter: drop-shadow(0 0 10px #FF0055);
            }
            /* Stagger traffic lines to make it look organic */
            .traffic-line-0 { animation-delay: 0s; }
            .traffic-line-1 { animation-delay: 0.3s; }
            .traffic-line-2 { animation-delay: 0.6s; }
            .traffic-line-3 { animation-delay: 1s; }
            .traffic-line-4 { animation-delay: 1.2s; }
            .traffic-line-5 { animation-delay: 1.5s; }
            .traffic-line-6 { animation-delay: 1.8s; }

            @keyframes shootTraffic {
               0% { stroke-dashoffset: 50; }
               100% { stroke-dashoffset: -50; }
            }
          `}} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
