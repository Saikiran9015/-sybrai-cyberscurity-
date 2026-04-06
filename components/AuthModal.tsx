"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle } from "lucide-react";

interface AuthModalProps {
  onSuccess: (userData: any) => void;
  onClose: () => void;
}

export default function AuthModal({ onSuccess, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      if (isLogin) {
        localStorage.setItem("sybrai_token", data.token);
        localStorage.setItem("sybrai_user", JSON.stringify(data.user));
        onSuccess(data.user);
      } else {
        setIsLogin(true);
        setError("Account created! Please login.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setIsLogin(true);
    setFormData({
      ...formData,
      email: "sybrai@gmail.com",
      password: "Sybrai9493@#"
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md glass-panel p-8 rounded-2xl relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-orbitron font-bold text-white mb-2 tracking-tighter">
            {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            {isLogin ? "Welcome back! Please login to your account." : "Join the Sybrai Academy today."}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 p-3 rounded-lg mb-6 text-xs font-bold font-mono ${
              error.includes("created") ? "bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
            }`}
          >
            <AlertCircle className="w-4 h-4" /> {error.toUpperCase()}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Your Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-neon" />
                <input 
                  type="text" 
                  required
                  placeholder="Enter your name"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 pl-10 text-white focus:outline-none focus:border-cyan-neon transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-neon" />
              <input 
                type="email" 
                required
                placeholder="yourname@gmail.com"
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 pl-10 text-white focus:outline-none focus:border-cyan-neon transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-neon" />
              <input 
                type="password" 
                required
                placeholder={isLogin ? "Enter password" : "Create password"}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 pl-10 text-white focus:outline-none focus:border-cyan-neon transition-colors"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-neon" />
                <input 
                  type="password" 
                  required
                  placeholder="Repeat password"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 pl-10 text-white focus:outline-none focus:border-cyan-neon transition-colors"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full button-primary flex items-center justify-center gap-2 py-4 mt-6 uppercase tracking-widest text-xs disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : isLogin ? <><LogIn className="w-4 h-4"/> LOGIN</> : <><UserPlus className="w-4 h-4"/> REGISTER</>}
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] text-gray-400 uppercase">
          {isLogin ? (
            <div className="space-y-4">
              <p>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-cyan-neon hover:underline">Register Now</button></p>
              <div className="pt-4 border-t border-white/5 opacity-50 hover:opacity-100 transition-opacity">
                <button 
                  type="button"
                  onClick={fillAdminCredentials}
                  className="text-[8px] text-gray-500 hover:text-purple-neon uppercase tracking-[0.3em] font-bold"
                >
                  [ SYSTEM ADMIN QUICK ACCESS ]
                </button>
              </div>
            </div>
          ) : (
            <p>Already have an account? <button onClick={() => setIsLogin(true)} className="text-cyan-neon hover:underline">Login here</button></p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
