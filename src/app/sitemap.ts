import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getCapabilities, getCaseStudies, getOffices } from "@/lib/content";
import { getJobs } from "@/lib/jobs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [jobs, capabilities, work, offices] = await Promise.all([getJobs(), getCapabilities(), getCaseStudies(), getOffices()]);
  const u = (p: string) => `${site.url}${p}`;
  return [
    { url: u("/"), priority: 1 },
    ...["/capabilities", "/work", "/careers", "/ecosystem", "/locations", "/about", "/contact", "/hackathon", "/news"].map((p) => ({ url: u(p), priority: 0.8 })),
    ...capabilities.map((c) => ({ url: u(`/capabilities/${c.slug}`), priority: 0.7 })),
    ...work.map((w) => ({ url: u(`/work/${w.slug}`), priority: 0.7 })),
    ...offices.map((o) => ({ url: u(`/locations/${o.slug}`), priority: 0.6 })),
    ...jobs.map((j) => ({ url: u(`/careers/${j.slug}`), lastModified: j.postedAt, priority: 0.7 })),
    ...["/privacy", "/cookies"].map((p) => ({ url: u(p), priority: 0.2 })),
  ];
}
