import { getCapabilities, getCapability } from "@/lib/content";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "Teracloud capability";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getCapabilities()).map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const c = await getCapability((await params).slug);
  return renderOg({ eyebrow: "Capability", title: c?.title ?? "Capabilities", footer: c?.short });
}
