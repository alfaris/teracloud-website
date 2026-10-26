import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Stats } from "@/components/sections/Stats";
import { CtaBand } from "@/components/sections/CtaBand";
import { getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description: "Founded in 2015 in Copenhagen, Teracloud is an international software R&D company with 200+ engineers across 8 hubs.",
  path: "/about",
});

const timeline = [
  { year: "2015", text: "Teracloud is founded in Copenhagen to provide R&D services to partner companies." },
  { year: "2020", text: "Teracloud Armenia opens in Yerevan — today a 30+ engineer hub with a strong OS team." },
  { year: "2023", text: "Teracloud Greece opens in Athens." },
  { year: "2026", text: "Our Cairo lab becomes Nubistech, an official Teracloud lab." },
  { year: "Today", text: "200+ people across Copenhagen, Malmö, Stuttgart, Athens, Yerevan, Cairo, Boston and Perth, working on a dozen active projects." },
];

export default async function AboutPage() {
  const { principles } = await getSiteSettings();
  return (
    <>
      <PageHeader
        label="About"
        title="Useful, efficient software — built by people from everywhere."
        intro="Our mission is to build robust software that lets our partners focus on what matters to them. We bring engineers of many nationalities together on universal problems: infrastructure, communication and sustainable development."
      />
      <Section>
        <Stats />
      </Section>
      <Section tone="mist" label="What we do" title="From industrial power controllers to operating systems.">
        <div className="grid gap-10 lg:grid-cols-2">
          <p className="t-lead text-gray">
            We develop a wide range of product lines — industrial power and climate controllers, e-sports platforms,
            compilers and enterprise operating systems. What connects them is a love of complex problems.
          </p>
          <p className="t-lead text-gray">
            Collaboration is how we work. In every hub, people on different projects talk often and test ideas on each
            other. Different backgrounds and ages give us a broader view of every problem.
          </p>
        </div>
      </Section>
      <Section label="Our story" title="A decade of systems work.">
        <ol className="relative space-y-10 border-l border-line pl-8">
          {timeline.map((t, i) => (
            <Reveal as="li" key={t.year} delay={i * 0.08} className="relative">
              <span aria-hidden className="absolute -left-[41px] top-1 size-4 rounded-full border-4 border-white bg-blue" />
              <p className="font-mono text-blue">{t.year}</p>
              <p className="t-lead mt-1 max-w-2xl">{t.text}</p>
            </Reveal>
          ))}
        </ol>
      </Section>
      <Section tone="dark" label="Principles" title="How we work.">
        <ul className="grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
          {principles.map((p) => (
            <li key={p.title} className="bg-ink-900 p-8">
              <h3 className="t-h3">{p.title}</h3>
              <p className="mt-3 text-white/70">{p.body}</p>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand />
    </>
  );
}
