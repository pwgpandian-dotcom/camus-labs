import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CAMUS Labs — Technology for Every Idea",
  description:
    "CAMUS Labs designs, builds and launches AI-powered software platforms for businesses, startups, creators and ambitious ideas worldwide.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
