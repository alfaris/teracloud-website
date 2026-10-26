import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";
import { getOffice } from "@/lib/content";
import { getJob, getJobs } from "@/lib/jobs";
import { JsonLd, pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const jobs = await getJobs();
  // Must return at least one entry; an unknown slug simply 404s.
  return jobs.length ? jobs.map((j) => ({ slug: j.slug })) : [{ slug: "no-open-roles" }];
}

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const j = await getJob((await params).slug);
  if (!j) return {};
  return pageMetadata({ title: `${j.title} — ${j.location}`, description: j.summary.slice(0, 155), path: `/careers/${j.slug}` });
}

// Every slug is prerendered from generateStaticParams, so render the page
// in the static shell rather than streaming it behind a placeholder.
export const instant = false;

export default async function JobPage({ params }: PageProps<"/careers/[slug]">) {
  const j = await getJob((await params).slug);
  if (!j) notFound();
  const office = await getOffice(j.officeSlug);
  const [city, country] = j.location.split(", ");
  return (
    <>
      <PageHeader label={j.department} title={j.title} intro={j.location} crumbs={[{ href: "/careers", label: "Careers" }, { href: `/careers/${j.slug}`, label: j.title }]}>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={j.applyUrl} external>Apply for this role</Button>
          <Button href="/careers#roles" variant="secondary">All roles</Button>
        </div>
      </PageHeader>
      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="prose-tc lg:col-span-7">
            <h2>About the role</h2>
            {j.summary.split(/\n+/).map((p) => <p key={p}>{p}</p>)}
            <p>
              The full description and the application form are on our job board, which opens in a new tab. A person reads
              every application.
            </p>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <dl className="space-y-5 rounded-2xl bg-mist p-7">
              <div><dt className="t-label text-gray">Location</dt><dd className="mt-1 font-semibold">{office ? <Link className="text-blue hover:underline" href={`/locations/${office.slug}`}>{j.location}</Link> : j.location}</dd></div>
              <div><dt className="t-label text-gray">Team</dt><dd className="mt-1 font-semibold">{j.department}</dd></div>
              <div><dt className="t-label text-gray">Type</dt><dd className="mt-1 font-semibold">{j.employmentType === "FULL_TIME" ? "Full-time" : "Part-time"}</dd></div>
              <div><dt className="t-label text-gray">Posted</dt><dd className="mt-1 font-semibold"><time dateTime={j.postedAt}>{new Date(j.postedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time></dd></div>
            </dl>
            <Button href={j.applyUrl} external className="mt-6 w-full">Apply for this role</Button>
          </aside>
        </div>
      </Section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: j.title,
          description: j.summary,
          datePosted: j.postedAt,
          employmentType: j.employmentType,
          hiringOrganization: { "@type": "Organization", name: site.legalName, sameAs: site.url, logo: `${site.url}/brand/Teracloud_logomark_blue.svg` },
          jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: city, addressCountry: country } },
          directApply: false,
          url: `${site.url}/careers/${j.slug}`,
        }}
      />
    </>
  );
}
