"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-4 text-center">
          Contact <span className="text-purple-neon">Us</span>
        </h1>
        <p className="text-gray-400 text-center mb-12">
          Have a question, need help with your account, or want to report an issue? Send us a message!
        </p>

        <form className="glass-panel p-8 rounded-2xl flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }}>
          <div>
            <label className="block text-sm font-bold text-cyan-neon mb-2 uppercase tracking-wider">Full Name</label>
            <input type="text" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon transition-colors" placeholder="John Doe" />
          </div>
          <div>
             <label className="block text-sm font-bold text-cyan-neon mb-2 uppercase tracking-wider">Email Address</label>
            <input type="email" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon transition-colors" placeholder="johndoe@example.com" />
          </div>
          <div>
             <label className="block text-sm font-bold text-cyan-neon mb-2 uppercase tracking-wider">Your Message</label>
            <textarea required rows={5} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon transition-colors" placeholder="Enter your inquiry..." />
          </div>
          <button type="submit" className="mt-4 button-primary">
             Send Message
          </button>
        </form>
      </motion.div>
    </div>
  );
}
