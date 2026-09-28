import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/app",
    name: "Camus Learn — AI learning & career platform",
    short_name: "Camus Learn",
    description: "Learn subjects, discover careers, build projects, prepare for exams and interviews, and grow your skills with AI.",
    start_url: "/app?source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone"],
    orientation: "any",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    categories: ["education", "productivity", "business"],
    lang: "en",
    dir: "auto",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Ask the assistant", short_name: "Assistant", url: "/app/assistant", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Study tutor", short_name: "Study", url: "/app/study", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Interview coach", short_name: "Interview", url: "/app/interview", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
