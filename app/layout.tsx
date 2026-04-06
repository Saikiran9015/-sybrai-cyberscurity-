import type { Metadata } from "next";
import { Inter, Orbitron, Cinzel, Pinyon_Script } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedCursor from "@/components/AnimatedCursor";
import IntroAnimation from "@/components/IntroAnimation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "500", "700", "900"], variable: "--font-orbitron" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const pinyon = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--font-pinyon" });

export const metadata: Metadata = {
  title: "Sybrai - AI-Powered Cyber Defense",
  description: "Sybrai protects your digital world in real time with autonomous AI cybersecurity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${orbitron.variable} ${cinzel.variable} ${pinyon.variable} dark`}>
      <body className="antialiased font-inter min-h-screen flex flex-col bg-bg-dark text-white selection:bg-cyan-neon selection:text-black">
        <IntroAnimation />
        <AnimatedCursor />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
