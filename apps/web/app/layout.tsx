import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BugCourt AI",
  description: "AI-powered courtroom code reviewer for static findings.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
