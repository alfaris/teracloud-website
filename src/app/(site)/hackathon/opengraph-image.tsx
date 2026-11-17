import { getHackathonEditions } from "@/lib/content";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "The annual Teracloud Hackathon";
export const size = ogSize;
export const contentType = "image/png";

// A static export (GitHub Pages) only prerenders route handlers that are marked
// static, and Cache Components forbids `dynamic = "force-static"`; a single
// empty param set marks it static instead.
export async function generateStaticParams() {
  return [{}];
}

export default async function Image() {
  const [latest] = await getHackathonEditions();
  return renderOg({
    eyebrow: "Teracloud Hackathon",
    title: "Three days to build what's next.",
    footer: latest ? `Latest: ${[latest.city, latest.country].filter(Boolean).join(", ")} ${latest.year}` : undefined,
  });
}
