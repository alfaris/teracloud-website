import { getJob, getJobs } from "@/lib/jobs";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "Open role at Teracloud";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.length ? jobs.map((j) => ({ slug: j.slug })) : [{ slug: "no-open-roles" }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const j = await getJob((await params).slug);
  return renderOg({ eyebrow: "We're hiring", title: j?.title ?? "Careers at Teracloud", footer: j ? `${j.location} · ${j.department}` : undefined });
}
