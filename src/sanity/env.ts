// SANITY_PROJECT_ID is the one switch: unset, the site renders from the local
// files in src/content. next.config.ts mirrors it to NEXT_PUBLIC_* for Studio.
export const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2025-10-01";
export const isSanityConfigured = projectId !== "";
// Optional override, e.g. the local mock API in scripts/mock-sanity.mts.
export const apiHost = process.env.SANITY_API_HOST || "";
