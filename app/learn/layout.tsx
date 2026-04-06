import type { Metadata } from "next";
import ParticleNetwork from "@/components/ParticleNetwork";

export const metadata: Metadata = {
  title: "Sybrai Cybersecurity Academy | Learn",
  description: "Master digital defense and learn about Ethical Hacking, Network Security, and AI in Cybersecurity from our curated academy.",
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section id="learn-page" className="relative">
      <ParticleNetwork />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
