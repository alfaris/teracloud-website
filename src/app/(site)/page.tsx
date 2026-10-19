import Link from "next/link";
import { Hero } from "@/components/hero/Hero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CapabilityGrid } from "@/components/sections/CapabilityGrid";
import { WorkCard } from "@/components/sections/WorkCard";
import { LogoWall } from "@/components/sections/LogoWall";
import { Stats } from "@/components/sections/Stats";
import { HubsMap } from "@/components/sections/HubsMap";
import { CtaBand } from "@/components/sections/CtaBand";
import { getCaseStudies, getSiteSettings, getSisterCompanies } from "@/lib/content";
import { getJobs } from "@/lib/jobs";

export default async function Home() {
  const [jobs, work, { principles, benefits }, sisterCompanies] = await Promise.all([
    getJobs(),
    getCaseStudies(),
    getSiteSettings(),
    getSisterCompanies(),
  ]);
  const featured = work.slice(0, 3);

  return (
    <>
      <Hero />

      <section id="proof" className="py-16 sm:py-20">
        <div className="container-tc space-y-16">
          <Stats />
          <LogoWall />
        </div>
      </section>

      <Section
        label="Capabilities"
        title="Deep systems work, end to end."
        intro="From kernels and compilers to streaming data and energy control — six areas where our teams build, maintain and ship long-lived software."
        tone="mist"
      >
        <CapabilityGrid />
        <div className="mt-10">
          <Button href="/capabilities" variant="secondary">All capabilities</Button>
        </div>
      </Section>

      <Section label="Selected work" title="Software that other products run on.">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((w, i) => (
            <Reveal as="li" key={w.slug} delay={i * 0.08}>
              <WorkCard item={w} />
            </Reveal>
          ))}
        </ul>
        <div className="mt-10">
          <Button href="/work" variant="secondary">All case studies</Button>
        </div>
      </Section>

      <Section
        label="How we work"
        title="Engineers first. Method second. Results always."
        tone="dark"
      >
        <ul className="grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.06} className="bg-ink-900 p-8 sm:p-10">
              <p aria-hidden className="font-mono text-sm text-blue-300">{`{ 0${i + 1} }`}</p>
              <h3 className="t-h3 mt-5">{p.title}</h3>
              <p className="mt-3 text-white/70">{p.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section
        label="Ecosystem"
        title="Part of a family of product companies."
        intro="Our engineers work hand in hand with our sister companies — building the software behind their products every day."
      >
        <ul className="grid gap-6 md:grid-cols-3">
          {sisterCompanies.map((c, i) => (
            <Reveal as="li" key={c.name} delay={i * 0.06}>
              <div className="brace-frame flex h-full flex-col rounded-2xl bg-mist p-8">
                <h3 className="t-h3">{c.name}</h3>
                <p className="mt-3 flex-1 text-gray">{c.description}</p>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="mt-6 font-semibold text-blue hover:text-blue-700">
                  Visit {c.name} <span aria-hidden>↗</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </Reveal>
          ))}
        </ul>
        <div className="mt-10">
          <Button href="/ecosystem" variant="secondary">Explore the ecosystem</Button>
        </div>
      </Section>

      <Section
        label="Global hubs"
        title="Eight hubs. One engineering culture."
        intro="Teams in Europe, the US, MENA and Australia — close to our partners and to the talent we hire."
        tone="dark"
      >
        <HubsMap />
      </Section>

      <Section label="Careers" title="Hard problems, good people, real growth.">
        <div className="grid gap-12 lg:grid-cols-12">
          <ul className="grid gap-8 sm:grid-cols-2 lg:col-span-7">
            {benefits.map((b) => (
              <li key={b.title}>
                <h3 className="t-h3">{b.title}</h3>
                <p className="mt-2 text-gray">{b.body}</p>
              </li>
            ))}
          </ul>
          <div className="flex flex-col justify-between rounded-2xl bg-ink-900 p-8 text-white on-dark lg:col-span-5">
            <div>
              <p className="t-label text-blue-300">Open roles</p>
              <p className="mt-4 text-7xl font-extrabold tracking-tight">{jobs.length}</p>
              <ul className="mt-6 space-y-2 text-white/75">
                {jobs.slice(0, 3).map((j) => (
                  <li key={j.id}>
                    <Link href={`/careers/${j.slug}`} className="hover:text-white">
                      {j.title} — {j.location}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Button href="/careers" variant="light" className="mt-10 self-start">Join the team</Button>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
