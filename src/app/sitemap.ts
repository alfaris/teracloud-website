import type { MetadataRoute } from "next";
import { capabilities } from "@/content/capabilities";
import { offices } from "@/content/offices";
import { site } from "@/content/site";
import { work } from "@/content/work";
import { getJobs } from "@/lib/jobs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getJobs();
  const u = (p: string) => `${site.url}${p}`;
  return [
    { url: u("/"), priority: 1 },
    ...["/capabilities", "/work", "/careers", "/ecosystem", "/locations", "/about", "/contact"].map((p) => ({ url: u(p), priority: 0.8 })),
    ...capabilities.map((c) => ({ url: u(`/capabilities/${c.slug}`), priority: 0.7 })),
    ...work.map((w) => ({ url: u(`/work/${w.slug}`), priority: 0.7 })),
    ...offices.map((o) => ({ url: u(`/locations/${o.slug}`), priority: 0.6 })),
    ...jobs.map((j) => ({ url: u(`/careers/${j.slug}`), lastModified: j.postedAt, priority: 0.7 })),
    ...["/privacy", "/cookies"].map((p) => ({ url: u(p), priority: 0.2 })),
  ];
}
