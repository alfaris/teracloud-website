import { getCapability, getCaseStudies, getCaseStudy } from "@/lib/content";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "Teracloud case study";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getCaseStudies()).map((w) => ({ slug: w.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const w = await getCaseStudy((await params).slug);
  const cap = w && (await getCapability(w.capability));
  return renderOg({ eyebrow: "Case study", title: w?.title ?? "Our work", footer: cap?.title });
}
