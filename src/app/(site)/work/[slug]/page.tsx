import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { ChipList } from "@/components/ui/Chip";
import { CaseCover } from "@/components/sections/CaseCover";
import { WorkCard } from "@/components/sections/WorkCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { getCapability, getCaseStudies, getCaseStudy, getOffices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getCaseStudies()).map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const w = await getCaseStudy((await params).slug);
  if (!w) return {};
  return pageMetadata({ title: w.title, description: w.summary, path: `/work/${w.slug}`, ownImage: true });
}

// Every slug is prerendered from generateStaticParams, so render the page
// in the static shell rather than streaming it behind a placeholder.
export const instant = false;

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const w = await getCaseStudy((await params).slug);
  if (!w) notFound();
  const [cap, work, offices] = await Promise.all([getCapability(w.capability), getCaseStudies(), getOffices()]);
  const more = work.filter((x) => x.slug !== w.slug && x.capability === w.capability).slice(0, 3);
  return (
    <>
      <PageHeader label={cap?.title} title={w.title} intro={w.summary} crumbs={[{ href: "/work", label: "Work" }, { href: `/work/${w.slug}`, label: w.title }]} />

      <div className="container-tc -mt-px">
        <div className="mt-12 aspect-[4/3] overflow-hidden rounded-2xl bg-ink-900 sm:aspect-[21/9]">
          <CaseCover item={w} sizes="(min-width: 1280px) 1216px, 100vw" preload />
        </div>
      </div>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <dl className="space-y-6 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <div>
                <dt className="t-label text-gray">Client</dt>
                <dd className="mt-1 font-semibold">{w.client}</dd>
              </div>
              {cap && (
                <div>
                  <dt className="t-label text-gray">Capability</dt>
                  <dd className="mt-1"><Link className="font-semibold text-blue hover:underline" href={`/capabilities/${cap.slug}`}>{cap.title}</Link></dd>
                </div>
              )}
              <div>
                <dt className="t-label text-gray">Teams</dt>
                <dd className="mt-1 font-semibold">{w.offices.map((s) => offices.find((o) => o.slug === s)?.city).filter(Boolean).join(", ")}</dd>
              </div>
              <div>
                <dt className="t-label mb-3 text-gray">Stack</dt>
                <dd><ChipList items={w.stack} /></dd>
              </div>
            </dl>
          </aside>
          <div className="prose-tc lg:col-span-7 lg:col-start-6">
            <h2>The challenge</h2>
            <p>{w.challenge}</p>
            <h2>Our approach</h2>
            <ul>{w.approach.map((a) => <li key={a}>{a}</li>)}</ul>
            <h2>The outcome</h2>
            <p>{w.outcome}</p>
          </div>
        </div>
      </Section>

      {more.length > 0 && (
        <Section tone="mist" label="More like this" title="Related work">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {more.map((m) => <li key={m.slug}><WorkCard item={m} /></li>)}
          </ul>
        </Section>
      )}
      <CtaBand title="Have a similar problem?" />
    </>
  );
}
