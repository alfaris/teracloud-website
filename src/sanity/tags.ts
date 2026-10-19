// Each Sanity document type the site reads is also the cache tag on the
// functions in src/lib/content.ts that read it. Kept free of the `sanity`
// package so server code can import it.
export const CONTENT_TYPES = ["capability", "caseStudy", "office", "company", "siteSettings"] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export const isContentType = (t: unknown): t is ContentType =>
  typeof t === "string" && (CONTENT_TYPES as readonly string[]).includes(t);
