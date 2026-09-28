import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ServiceWorkerRegister } from "@/components/learn/ServiceWorkerRegister";
import "./globals.css";

// Fonts are self-hosted (SIL OFL licensed) so builds never depend on a
// third-party font CDN and first paint isn't blocked by an external request.
const geist = localFont({
  src: "./fonts/Geist-Variable.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});

const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: "100 800",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://camus-labs.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "CAMUS Labs — Technology for Every Idea",
  description:
    "CAMUS Labs designs, builds and launches AI-powered software platforms for businesses, startups, creators and ambitious ideas worldwide.",
  applicationName: "Camus Learn",
  appleWebApp: {
    capable: true,
    title: "Camus Learn",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "CAMUS Labs",
    url: siteUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Lets Android Chrome shrink the layout viewport when the keyboard opens.
  interactiveWidget: "resizes-content",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }, { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" }],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full antialiased ${geist.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper">
          Skip to content
        </a>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
