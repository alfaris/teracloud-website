import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { JobBoard } from "@/components/sections/JobBoard";
import { HubsMap } from "@/components/sections/HubsMap";
import { NewsCards } from "@/components/sections/NewsCards";
import { site } from "@/content/site";
import { getHackathonEditions, getLatestNews, getSiteSettings } from "@/lib/content";
import { getJobs } from "@/lib/jobs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Careers",
  description: "Join 200+ engineers building operating systems, compilers, mainframe software and real-time platforms across 8 Teracloud hubs.",
  path: "/careers",
});

export default async function CareersPage() {
  const [jobs, { benefits, hiringSteps, email }, news, [hackathon]] = await Promise.all([
    getJobs(),
    getSiteSettings(),
    getLatestNews(3, ["culture", "hiring"]),
    getHackathonEditions(),
  ]);
  return (
    <>
      <PageHeader
        label="Careers"
        title="Do the hardest work of your career — with people who help."
        intro="Kernels, compilers, mainframes, real-time systems. Join a team where senior engineers teach, ideas get tested, and the problems are worth solving."
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="#roles">See open roles</Button>
          <Button href={site.jobBoardUrl} external variant="secondary">Full job board</Button>
        </div>
      </PageHeader>

      <Section label="Why Teracloud" title="What our engineers value.">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <Reveal as="li" key={b.title} delay={i * 0.05}>
              <div className="h-full rounded-2xl bg-mist p-7">
                <h3 className="t-h3">{b.title}</h3>
                <p className="mt-3 text-gray">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section id="roles" tone="mist" label="Open roles" title={`${jobs.length} open ${jobs.length === 1 ? "role" : "roles"}`}>
        <JobBoard jobs={jobs} email={email} />
      </Section>

      {hackathon && (
        <section className="on-dark bg-ink-900 text-white">
          <div className="container-tc flex flex-col gap-8 py-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="t-label text-blue-300">
                <span aria-hidden className="font-mono">{"{ "}</span>Annual hackathon<span aria-hidden className="font-mono">{" }"}</span>
              </p>
              <h2 className="t-h2 mt-4 text-balance">Once a year, we build something new together.</h2>
              <p className="t-lead mt-4 text-white/70">
                Teams from across our hubs meet at the Teracloud Hackathon — most recently in {[hackathon.city, hackathon.country].filter(Boolean).join(", ")}, {hackathon.year}.
              </p>
            </div>
            <Button href="/hackathon" variant="light" className="self-start lg:self-auto">About the hackathon</Button>
          </div>
        </section>
      )}

      <Section label="Hiring process" title="Clear, quick, respectful.">
        <ol className="grid gap-6 md:grid-cols-4">
          {hiringSteps.map((s, i) => (
            <li key={s.title} className="border-t-2 border-blue pt-6">
              <p className="font-mono text-sm text-blue">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="t-h3 mt-3">{s.title}</h3>
              <p className="mt-2 text-gray">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {news.length > 0 && (
        <Section tone="mist" label="Life at Teracloud" title="From our teams.">
          <NewsCards posts={news} />
          <div className="mt-10">
            <Button href="/news" variant="secondary">All news</Button>
          </div>
        </Section>
      )}

      <Section tone="dark" label="Where you could work" title="Eight hubs to choose from.">
        <HubsMap interactive />
      </Section>
    </>
  );
}
