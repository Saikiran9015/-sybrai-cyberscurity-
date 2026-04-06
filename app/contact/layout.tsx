import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Sybrai | Establish Comlink",
  description: "Get in touch with Sybrai. Report vulnerabilities, request enterprise deployment, or connect with our support nodes.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section id="contact-page">{children}</section>;
}
