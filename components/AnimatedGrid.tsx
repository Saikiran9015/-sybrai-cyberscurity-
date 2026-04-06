"use client";

import { motion } from "framer-motion";

export default function AnimatedGrid() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden opacity-20">
      <div className="absolute inset-[-100%] bg-[linear-gradient(to_right,#00F5FF_1px,transparent_1px),linear-gradient(to_bottom,#00F5FF_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_10%,transparent_100%)]">
        <motion.div
           className="w-full h-full bg-gradient-to-b from-transparent via-cyan-neon/10 to-transparent"
           animate={{
               y: ["-100%", "100%"],
           }}
           transition={{
               repeat: Infinity,
               duration: 10,
               ease: "linear",
           }}
        />
      </div>
    </div>
  );
}
