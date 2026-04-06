import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download Sybrai Node | Install Defensive AI",
  description: "Download the ultimate AI shield for your local machine or server. Available for Windows, Linux, and macOS.",
};

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section id="download-page">{children}</section>;
}
