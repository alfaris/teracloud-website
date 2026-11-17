import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// GITHUB_PAGES=true builds a static copy of the site into out/ for GitHub
// Pages. Run it through `npm run build:pages` (scripts/build-pages.mjs), which
// also removes the Cache Components directives a static export can't use. Pages serves files only, so this
// build has no redirects or security headers, no image optimizer, and the
// contact form opens a pre-filled email instead of sending one. PAGES_BASE_PATH
// is the sub-path the site is served under, e.g. /teracloud-website.
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? (process.env.PAGES_BASE_PATH ?? "").replace(/\/$/, "") : "";

// Optional cookieless analytics (Plausible, hosted or self-hosted). Its origin
// is allowed in the CSP only when it is configured.
const analyticsSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";
const analyticsOrigin = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? new URL(analyticsSrc).origin : "";

// No nonces: pages are prerendered, and a per-request nonce would force every
// page to render dynamically. Next.js's inline bootstrap scripts therefore need
// 'unsafe-inline'; everything else is locked to this origin.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${analyticsOrigin}`.trim(),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  `connect-src 'self' ${analyticsOrigin}`.trim(),
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const serverConfig: NextConfig = {
  // Self-contained server in .next/standalone for Teracloud's own servers
  // (see Dockerfile and README → Deployment).
  output: "standalone",
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/contacts", destination: "/contact", permanent: true },
      // www → apex, for when the proxy forwards www requests here.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.teracloud.com" }],
        destination: "https://teracloud.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
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

const pagesConfig: NextConfig = {
  output: "export",
  basePath,
  // /about → out/about/index.html, which Pages serves at /about/.
  trailingSlash: true,
  images: { loader: "custom", loaderFile: "./src/lib/pages-image-loader.ts" },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

const shared: NextConfig = {
  // Cache Components and Partial Prefetching need a server: a static export
  // refuses both, and every page is prerendered at build time anyway.
  cacheComponents: !isPages,
  partialPrefetching: !isPages,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
    // No server to run Server Actions: use the email-app fallback instead.
    ...(isPages && { resolveAlias: { "./actions": "./src/app/(site)/contact/actions.static.ts" } }),
  },
};

const nextConfig: NextConfig = { ...shared, ...(isPages ? pagesConfig : serverConfig) };

export default nextConfig;
