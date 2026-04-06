"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Lock, ArrowRight, Loader2 } from "lucide-react";

interface PaymentGateProps {
  user: any;
  onSuccess: (updatedUser: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentGate({ user, onSuccess }: PaymentGateProps) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded) return;
    setLoading(true);

    try {
      // 1. Create order on server
      const orderRes = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 50 }),
      });
      const orderData = await orderRes.json();

      // 2. Options for Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder_id",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Sybrai Cyber Academy",
        description: "Ethical Hacking Basics - Full Access",
        order_id: orderData.id,
        handler: async (response: any) => {
          // 3. Verify on server
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              userId: user.id || user._id,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            onSuccess(verifyData.user);
          } else {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#00F5FF",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed to initialize.");
    } finally {
      setLoading(false);
    }
  };

  const handleCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    setCouponError("");

    try {
      const res = await fetch("/api/payment/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponCode, userId: user.id || user._id }),
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess(data.user);
      } else {
        setCouponError(data.error || "Invalid code");
      }
    } catch (err) {
      setCouponError("Service error. Try again.");
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-3xl border-cyan-neon/20 max-w-2xl mx-auto text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <Zap className="w-24 h-24 text-cyan-neon/10 -rotate-12" />
      </div>

      <div className="mb-6 inline-block p-4 bg-cyan-neon/10 rounded-2xl border border-cyan-neon/20">
        <Lock className="w-12 h-12 text-cyan-neon shadow-[0_0_15px_rgba(0,245,255,0.5)]" />
      </div>

      <h2 className="text-3xl font-orbitron font-bold text-white mb-4 tracking-tighter">
        ACCESS <span className="text-cyan-neon">RESTRICTED</span>
      </h2>
      
      <p className="text-gray-400 mb-8 leading-relaxed">
        Agent <strong>{user.name}</strong>, you have not unlocked the Ethical Hacking Basics module yet. 
        Pay a one-time enrollment fee of <strong>₹50</strong> to gain lifetime access to all interactive labs, 
        XP rewards, and certifications.
      </p>

      <div className="grid grid-cols-2 gap-4 w-full mb-10">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center">
           <ShieldCheck className="w-5 h-5 text-cyan-neon mb-2" />
           <span className="text-[10px] text-gray-500 uppercase font-mono">Full Access</span>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center">
           <Zap className="w-5 h-5 text-purple-neon mb-2" />
           <span className="text-[10px] text-gray-500 uppercase font-mono">6 Live Labs</span>
        </div>
      </div>

      <button 
        onClick={handlePayment}
        disabled={loading || !scriptLoaded}
        className="w-full button-primary flex items-center justify-center gap-3 py-4 font-bold text-sm tracking-widest uppercase disabled:opacity-50"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> INITIALIZING...</> : <><Zap className="w-4 h-4" /> PAY ₹50 TO UNLOCK <ArrowRight className="w-4 h-4" /></>}
      </button>

      {/* Coupon Section */}
      <div className="mt-8 w-full">
        {!showCoupon ? (
          <button 
            onClick={() => setShowCoupon(true)}
            className="text-[10px] text-gray-500 hover:text-cyan-neon uppercase tracking-[0.2em] transition-colors"
          >
            Have a coupon code?
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="ENTER CODE (E.G. Sybrai2026)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cyan-neon outline-none"
              />
              <button 
                onClick={handleCoupon}
                disabled={couponLoading}
                className="px-6 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white transition-all disabled:opacity-50"
              >
                {couponLoading ? "..." : "APPLY"}
              </button>
            </div>
            {couponError && <p className="text-[10px] text-red-500 uppercase font-bold tracking-widest">{couponError}</p>}
          </div>
        )}
      </div>

      <p className="mt-6 text-[10px] text-gray-600 font-mono uppercase tracking-widest">
        Secure payment powered by Razorpay Cryptoservice
      </p>
    </div>
  );
}
