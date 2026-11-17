import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// A static export (GitHub Pages) only prerenders route handlers that are marked
// static, and Cache Components forbids `dynamic = "force-static"`; a single
// empty param set marks it static instead.
export async function generateStaticParams() {
  return [{}];
}

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${site.url}/sitemap.xml`, host: site.url };
}
