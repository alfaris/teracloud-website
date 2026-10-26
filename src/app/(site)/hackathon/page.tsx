import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { hackathonIntro, hackathonPrinciples } from "@/content/hackathon";
import { getHackathonEditions } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Hackathon",
  description:
    "The annual Teracloud Hackathon brings engineers from our hubs together to build new ideas. 2026 edition: Tbilisi, Georgia — AI and emerging technologies.",
  path: "/hackathon",
});

const place = (e: { city?: string; country: string }) => [e.city, e.country].filter(Boolean).join(", ");

export default async function HackathonPage() {
  const editions = await getHackathonEditions();
  const latest = editions[0];
  return (
    <>
      <PageHeader label="Teracloud Hackathon" title={hackathonIntro.title} intro={hackathonIntro.summary}>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="#editions">Past editions</Button>
          <Button href="/careers" variant="secondary">Join the team</Button>
        </div>
      </PageHeader>

      {latest && (
        <section className="on-dark relative overflow-hidden bg-ink-900 py-20 text-white sm:py-28">
          <div aria-hidden className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_50%,black,transparent_70%)]" />
          <div aria-hidden className="absolute -right-32 top-1/2 size-[560px] -translate-y-1/2 rounded-full bg-blue/30 blur-[120px]" />
          <div className="container-tc relative grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="t-label text-blue-300">
                <span aria-hidden className="font-mono">{"{ "}</span>Latest edition<span aria-hidden className="font-mono">{" }"}</span>
              </p>
              <h2 className="t-h1 mt-4 text-balance">
                {latest.year} · {place(latest)}
              </h2>
              {latest.theme && <p className="t-lead mt-5 text-white/80">Theme: {latest.theme}</p>}
              <p className="t-lead mt-4 max-w-2xl text-white/70">{latest.summary}</p>
            </div>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 lg:col-span-5">
              {[
                { k: "Year", v: String(latest.year) },
                { k: "Dates", v: latest.dates ?? "—" },
                { k: "Host", v: place(latest) },
                latest.stats?.[0]
                  ? { k: latest.stats[0].label, v: String(latest.stats[0].value) }
                  : { k: "Teams", v: "From across our hubs" },
              ].map((d) => (
                <div key={d.k} className="flex flex-col-reverse bg-ink-900 p-6">
                  <dt className="mt-1 text-sm text-white/55">{d.k}</dt>
                  <dd className="text-xl font-bold">{d.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <Section label="How it works" title="Build first, present in person.">
        <ul className="grid gap-6 md:grid-cols-3">
          {hackathonPrinciples.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.06}>
              <div className="brace-frame h-full rounded-2xl bg-mist p-8">
                <p aria-hidden className="font-mono text-sm text-blue">{`{ 0${i + 1} }`}</p>
                <h3 className="t-h3 mt-5">{p.title}</h3>
                <p className="mt-3 text-gray">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section id="editions" tone="mist" label="Editions" title="Where we have hacked.">
        <ol className="relative space-y-10 border-l border-line pl-8">
          {editions.map((e, i) => (
            <Reveal as="li" key={e.year} delay={i * 0.06} className="relative">
              <span aria-hidden className="absolute -left-[41px] top-2 size-4 rounded-full border-4 border-mist bg-blue" />
              <article id={`edition-${e.year}`} className="grid scroll-mt-28 gap-8 rounded-2xl bg-white p-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="font-mono text-blue">{e.year}</p>
                  <h3 className="t-h2 mt-2">{place(e)}</h3>
                  {e.dates && <p className="mt-2 text-gray">{e.dates} {e.year}</p>}
                  {e.theme && <p className="mt-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue">{e.theme}</p>}
                </div>
                <div className="lg:col-span-8">
                  <p className="t-lead text-gray">{e.summary}</p>
                  {e.highlights.length > 0 && (
                    <ul className="mt-6 space-y-4">
                      {e.highlights.map((h) => (
                        <li key={h.title} className="border-l-2 border-blue pl-4">
                          <p className="font-semibold">{h.title}</p>
                          <p className="mt-1 text-gray">{h.body}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                  {e.stats && e.stats.length > 0 && (
                    <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-4">
                      {e.stats.map((s) => (
                        <div key={s.label} className="flex flex-col-reverse bg-white p-4">
                          <dt className="text-sm text-gray">{s.label}</dt>
                          <dd className="text-3xl font-extrabold tracking-tight text-blue">{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {e.url && (
                    <a href={e.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-1 font-semibold text-blue hover:text-blue-700">
                      Read the {e.year} recap on LinkedIn <span aria-hidden>↗</span>
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  )}
                  {e.image && (
                    <Image src={e.image.src} alt={e.image.alt} width={e.image.width} height={e.image.height} className="mt-6 h-auto w-full rounded-xl" sizes="(min-width: 1024px) 60vw, 100vw" />
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </Section>

      <CtaBand title="Want to be on next year's team?" body="Hackathon teams come from every corner of the company. Find your role in one of our eight hubs." />
    </>
  );
}
