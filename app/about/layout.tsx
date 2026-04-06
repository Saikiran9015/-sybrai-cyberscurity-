import type { Metadata } from "next";
import ParticleNetwork from "@/components/ParticleNetwork";

export const metadata: Metadata = {
  title: "About Sybrai | Autonomous Cybersecurity",
  description: "Learn about Sybrai's mission and vision to eliminate human error in network defense by deploying self-learning, adaptive AI systems.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section id="about-page" className="relative">
      <ParticleNetwork />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
