import type { NextConfig } from "next";

// Hosts that should present Camus Learn (instead of the CAMUS Labs agency
// homepage) at the root URL. Only "/" is rewritten; every other route
// (/learn, /app, /login, /portal, /admin, /api/*) is served as usual, so the
// agency site keeps working on its own domain(s).
const CAMUS_LEARN_HOSTS = "(www\\.)?camuslearn\\.com";

// Deployments dedicated to Camus Learn (e.g. Firebase: camus-learn.web.app)
// set CAMUS_LEARN_AT_ROOT=true at build time so "/" shows Camus Learn no
// matter which host/proxy the request arrives through. Unset on Vercel, so
// camus-labs.vercel.app keeps the agency homepage.
const LEARN_AT_ROOT = process.env.CAMUS_LEARN_AT_ROOT === "true";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async rewrites() {
    return {
      beforeFiles: [
        ...(LEARN_AT_ROOT ? [{ source: "/", destination: "/learn" }] : []),
        {
          source: "/",
          has: [{ type: "host", value: CAMUS_LEARN_HOSTS }],
          destination: "/learn",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // The service worker must always be revalidated so updates roll out.
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
