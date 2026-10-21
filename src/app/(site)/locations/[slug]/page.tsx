import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { JobList } from "@/components/sections/JobList";
import { CtaBand } from "@/components/sections/CtaBand";
import { getOffice, getOffices, getSiteSettings } from "@/lib/content";
import { getJobs } from "@/lib/jobs";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getOffices()).map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: PageProps<"/locations/[slug]">): Promise<Metadata> {
  const o = await getOffice((await params).slug);
  if (!o) return {};
  return pageMetadata({
    title: `${o.city}, ${o.country}`,
    description: `Teracloud's ${o.city} engineering hub: ${o.focus.join(", ")}. See open roles in ${o.city}.`,
    path: `/locations/${o.slug}`,
  });
}

// Every slug is prerendered from generateStaticParams, so render the page
// in the static shell rather than streaming it behind a placeholder.
export const instant = false;

export default async function OfficePage({ params }: PageProps<"/locations/[slug]">) {
  const o = await getOffice((await params).slug);
  if (!o) notFound();
  const [allJobs, { email }] = await Promise.all([getJobs(), getSiteSettings()]);
  const jobs = allJobs.filter((j) => j.officeSlug === o.slug);
  return (
    <>
      <PageHeader
        label={o.slug === "copenhagen" ? "Headquarters" : "Engineering hub"}
        title={`Teracloud ${o.city}`}
        intro={`${o.country}. Teams here work on ${o.focus.slice(0, -1).join(", ").toLowerCase()}${o.focus.length > 1 ? " and " : ""}${o.focus.at(-1)?.toLowerCase()}.`}
        crumbs={[{ href: "/locations", label: "Locations" }, { href: `/locations/${o.slug}`, label: o.city }]}
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="t-h2">What we work on</h2>
            <ul className="mt-6 space-y-3">
              {o.focus.map((f) => (
                <li key={f} className="flex gap-3"><span aria-hidden className="font-mono text-blue">{"{}"}</span>{f}</li>
              ))}
            </ul>
            <h2 className="t-h3 mt-12">Visit</h2>
            <address className="mt-3 not-italic text-gray">
              {o.address ?? `${o.city}, ${o.country}`}
              <br />
              <a href={`mailto:${email}`} className="text-blue hover:underline">{email}</a>
            </address>
          </div>
          <div className="lg:col-span-7">
            <h2 className="t-h2">Open roles in {o.city}</h2>
            <div className="mt-6"><JobList jobs={jobs} email={email} emptyCity={o.city} /></div>
          </div>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
