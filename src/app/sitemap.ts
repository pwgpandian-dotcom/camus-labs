import type { MetadataRoute } from "next";
import { careers } from "@/lib/learn/catalog/careers";
import { subjects } from "@/lib/learn/catalog/subjects";
import { products } from "@/lib/products";
import { solutions } from "@/lib/solutions";
import { industries } from "@/lib/industries";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://camus-labs.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string, priority = 0.6): MetadataRoute.Sitemap[number] => ({ url: `${base}${path}`, lastModified: now, changeFrequency: "weekly", priority });
  return [
    url("/", 1),
    url("/learn", 0.9),
    url("/products", 0.8),
    ...products.filter((p) => !p.href).map((p) => url(`/products/${p.slug}`, 0.7)),
    url("/learn/careers", 0.8),
    ...careers.map((c) => url(`/learn/careers/${c.slug}`, 0.7)),
    url("/learn/subjects", 0.7),
    ...subjects.map((s) => url(`/learn/subjects/${s.slug}`, 0.6)),
    url("/learn/exams", 0.6),
    url("/learn/academy", 0.6),
    url("/solutions"),
    ...solutions.map((s) => url(`/solutions/${s.slug}`, 0.5)),
    url("/industries"),
    ...industries.map((i) => url(`/industries/${i.slug}`, 0.5)),
    url("/projects"),
    url("/ai-agents"),
    url("/about"),
    url("/contact"),
    url("/start-project"),
    url("/legal/privacy", 0.3),
    url("/legal/terms", 0.3),
  ];
}
