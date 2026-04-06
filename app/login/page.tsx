"use client";

import { useState, useEffect } from "react";
import AuthModal from "@/components/AuthModal";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, send them to the learn page
    const savedUser = localStorage.getItem("sybrai_user");
    if (savedUser) {
      router.push("/learn");
    }
  }, [router]);

  const handleSuccess = () => {
    // Redirect to the courses after login
    router.push("/learn");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-neon/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-neon/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="z-10 w-full max-w-md">
        <AuthModal 
          onSuccess={handleSuccess} 
          onClose={() => router.push("/")} 
        />
      </div>
    </div>
  );
}
