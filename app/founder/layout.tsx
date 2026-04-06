import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sybrai Founder | The Mind Behind the AI",
  description: "Discover the story, vision, and achievements of the visionary building the future of AI-powered cybersecurity.",
};

export default function FounderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section id="founder-page">{children}</section>;
}
