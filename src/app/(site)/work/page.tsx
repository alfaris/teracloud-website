import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WorkCard } from "@/components/sections/WorkCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { getCaseStudies } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Work",
  description: "Case studies from Teracloud: enterprise operating systems, mainframe intelligence, cloud SCADA, real-time analytics, video delivery and industrial simulation.",
  path: "/work",
});

export default async function WorkPage() {
  const work = await getCaseStudies();
  return (
    <>
      <PageHeader
        label="Work"
        title="The software behind other people's products."
        intro="Much of what we build ships under our partners' names. These are the problems we solve — client names withheld where our agreements require it."
      />
      <Section>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {work.map((w, i) => (
            <Reveal as="li" key={w.slug} delay={(i % 3) * 0.06}>
              <WorkCard item={w} headingLevel="h2" />
            </Reveal>
          ))}
        </ul>
      </Section>
      <CtaBand />
    </>
  );
}
