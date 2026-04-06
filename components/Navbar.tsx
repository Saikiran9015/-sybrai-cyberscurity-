"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("sybrai_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sybrai_token");
    localStorage.removeItem("sybrai_user");
    setUser(null);
    router.push("/");
    window.location.reload();
  };

  const links = [
    { name: "About", path: "/about" },
    { name: "Learn", path: "/learn" },
    { name: "Download", path: "/download" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 glass-panel border-b border-white/10 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-cyan-neon/30 flex items-center justify-center bg-black/50 group-hover:glow-cyan hover-3d-spin">
            {/* If logo is available, we use an img, otherwise an icon. We will use the generated logo we copied earlier! */}
            <img src="/logo.png" alt="Sybrai Logo" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </div>
          <span className="font-orbitron text-2xl font-bold tracking-wider text-white group-hover:text-cyan-neon transition-colors">
            SYBRAI
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.path}
              className={`text-sm tracking-wide transition-all duration-200 hover:text-cyan-neon ${
                pathname === link.path ? "text-cyan-neon" : "text-gray-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <Link href="/founder" className="text-sm font-semibold text-purple-neon hover:text-white transition-colors tracking-wide border border-purple-neon/30 hover:border-purple-neon hover:bg-purple-neon/10 px-3 py-1.5 rounded-full">
            Founder
          </Link>

          {user ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
               <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <User className="w-3 h-3 text-cyan-neon" /> {user.name}
               </div>
               <button 
                 onClick={handleLogout}
                 className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all group"
                 title="Log Out"
               >
                 <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
               </button>
            </div>
          ) : (
            <Link href="/download" className="ripple-btn px-5 py-2.5 bg-cyan-neon text-black font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] transition-all duration-300 ml-4 group flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden mt-4 flex flex-col gap-4 bg-black/90 p-4 border rounded-xl border-white/10"
        >
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.path}
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-cyan-neon py-2 border-b border-white/5"
            >
              {link.name}
            </Link>
          ))}
          <Link href="/founder" className="text-purple-neon font-medium py-2">
            Founder
          </Link>
          {user ? (
            <button 
              onClick={handleLogout}
              className="w-full text-center py-3 bg-red-500/10 border border-red-500/20 text-red-500 font-bold rounded-lg mt-2 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          ) : (
            <Link href="/download" className="w-full text-center py-3 bg-cyan-neon text-black font-bold rounded-lg mt-2">
              Get Started
            </Link>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}
