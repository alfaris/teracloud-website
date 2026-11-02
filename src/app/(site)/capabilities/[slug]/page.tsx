import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { ChipList } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { WorkCard } from "@/components/sections/WorkCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { getCapabilities, getCapability, getCaseStudies, getOffices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getCapabilities()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/capabilities/[slug]">): Promise<Metadata> {
  const c = await getCapability((await params).slug);
  if (!c) return {};
  return pageMetadata({ title: c.title, description: c.summary, path: `/capabilities/${c.slug}`, ownImage: true });
}

// Every slug is prerendered from generateStaticParams, so render the page
// in the static shell rather than streaming it behind a placeholder.
export const instant = false;

export default async function CapabilityPage({ params }: PageProps<"/capabilities/[slug]">) {
  const c = await getCapability((await params).slug);
  if (!c) notFound();
  const [work, offices] = await Promise.all([getCaseStudies(), getOffices()]);
  const related = c.work.map((s) => work.find((w) => w.slug === s)).filter((w) => !!w);
  const teams = c.offices.map((s) => offices.find((o) => o.slug === s)).filter((o) => !!o);
  return (
    <>
      <PageHeader label="Capability" title={c.title} intro={c.summary} crumbs={[{ href: "/capabilities", label: "Capabilities" }, { href: `/capabilities/${c.slug}`, label: c.title }]}>
        <div className="mt-10">
          <ChipList items={c.stack} />
        </div>
      </PageHeader>

      <Section label="What we build" title="Where our engineers spend their days.">
        <ul className="grid gap-6 md:grid-cols-3">
          {c.builds.map((b, i) => (
            <Reveal as="li" key={b.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl bg-mist p-8">
                <span className="font-mono text-[0.8125rem] text-blue" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-h3 mt-6">{b.title}</h3>
                <p className="mt-3 text-gray">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {related.length > 0 && (
        <Section tone="mist" label="Related work" title="Proof in production.">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((w) => (
              <li key={w.slug}><WorkCard item={w} /></li>
            ))}
          </ul>
        </Section>
      )}

      <Section label="Teams" title="Where this work happens.">
        <ul className="flex flex-wrap gap-3">
          {teams.map((o) => (
            <li key={o.slug}>
              <Link href={`/locations/${o.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-5 font-medium hover:border-blue hover:text-blue">
                {o.city}, {o.country}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title={`Need ${c.title.toLowerCase()} expertise?`} />
    </>
  );
}
