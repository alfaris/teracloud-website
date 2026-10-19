import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { JobBoard } from "@/components/sections/JobBoard";
import { HubsMap } from "@/components/sections/HubsMap";
import { benefits, hiringSteps, site } from "@/content/site";
import { getJobs } from "@/lib/jobs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Careers",
  description: "Join 200+ engineers building operating systems, compilers, mainframe software and real-time platforms across 8 Teracloud hubs.",
  path: "/careers",
});

export default async function CareersPage() {
  const jobs = await getJobs();
  return (
    <>
      <PageHeader
        label="Careers"
        title="Do the hardest work of your career — with people who help."
        intro="Kernels, compilers, mainframes, real-time systems. Join a team where senior engineers teach, ideas get tested, and the problems are worth solving."
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="#roles">See open roles</Button>
          <Button href={site.jobBoardUrl} external variant="secondary">Job board</Button>
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
        <JobBoard jobs={jobs} />
      </Section>

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

      <Section tone="dark" label="Where you could work" title="Eight hubs to choose from.">
        <HubsMap />
      </Section>
    </>
  );
}
