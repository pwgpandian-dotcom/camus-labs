import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://camus-labs.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/app", "/admin", "/portal", "/api/", "/login"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
