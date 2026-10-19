import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { CapabilityGrid } from "@/components/sections/CapabilityGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { crossCutting } from "@/content/capabilities";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Capabilities",
  description: "Operating systems, compilers, mainframe software, cloud migration, real-time data platforms and industrial energy software — engineered by Teracloud.",
  path: "/capabilities",
});

export default function CapabilitiesPage() {
  return (
    <>
      <PageHeader
        label="Capabilities"
        title="Engineering for systems that cannot fail."
        intro="Six capability areas, one standard of craft. Our teams build and maintain software that sits deep in the stack — and keep it running for decades."
      />
      <Section>
        <CapabilityGrid headingLevel="h2" />
      </Section>
      <Section tone="mist" label="Across every project" title="Quality and support built in.">
        <ul className="grid gap-6 md:grid-cols-2">
          {crossCutting.map((c) => (
            <li key={c.title} className="rounded-2xl bg-white p-8">
              <h3 className="t-h3">{c.title}</h3>
              <p className="mt-3 text-gray">{c.body}</p>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand />
    </>
  );
}
