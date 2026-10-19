import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Studio runs in the browser; expose the (non-secret) project settings to it
  // so SANITY_PROJECT_ID / SANITY_DATASET stay the only variables to set.
  cacheLife: {
    // Editable content (src/lib/content.ts). Sanity publishes expire it through
    // /api/revalidate; the hourly revalidate is a safety net for a missed
    // webhook. Local files only change on deploy.
    content: process.env.SANITY_PROJECT_ID
      ? { stale: 300, revalidate: 3600, expire: 86400 }
      : { stale: 300, revalidate: 30 * 86400, expire: 365 * 86400 },
  },
  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID ?? "",
    NEXT_PUBLIC_SANITY_DATASET: process.env.SANITY_DATASET ?? "production",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/contacts", destination: "/contact", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
