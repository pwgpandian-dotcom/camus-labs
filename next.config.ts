import type { NextConfig } from "next";

// Hosts that should present Camus Learn (instead of the CAMUS Labs agency
// homepage) at the root URL. Only "/" is rewritten; every other route
// (/learn, /app, /login, /portal, /admin, /api/*) is served as usual, so the
// agency site keeps working on its own domain(s).
const CAMUS_LEARN_HOSTS = "(www\\.)?camuslearn\\.com";

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
