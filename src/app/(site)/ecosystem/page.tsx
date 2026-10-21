import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { getPartners, getSisterCompanies } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Ecosystem",
  description: "Teracloud engineers work alongside sister companies 21CS, VMS Software and Energy Machines, and with technology leaders such as IBM, HPE and Oracle.",
  path: "/ecosystem",
});

export default async function EcosystemPage() {
  const [sisterCompanies, partners] = await Promise.all([getSisterCompanies(), getPartners()]);
  return (
    <>
      <PageHeader
        label="Ecosystem"
        title="We build inside real product companies."
        intro="Our closest partners are our sister companies. Teracloud teams are embedded in their engineering — which keeps our skills sharp and our standards high."
      />
      <Section label="Sister companies" title="One family, three product lines.">
        <ul className="grid gap-6 lg:grid-cols-3">
          {sisterCompanies.map((c, i) => (
            <Reveal as="li" key={c.name} delay={i * 0.06}>
              <article className="brace-frame flex h-full flex-col rounded-2xl border border-line p-8">
                <div className="flex h-12 items-center">
                  <Image src={c.logo} alt="" width={180} height={48} className="h-9 w-auto object-contain" />
                </div>
                <h3 className="t-h3 mt-8">{c.name}</h3>
                <p className="mt-3 flex-1 text-gray">{c.description}</p>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="mt-8 font-semibold text-blue hover:text-blue-700">
                  {new URL(c.url).hostname.replace("www.", "")} <span aria-hidden>↗</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>
      <Section tone="mist" label="Technology partners" title="Working with the platforms enterprises run on.">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-3">
          {partners.map((p) => (
            <li key={p.name} className="flex h-36 items-center justify-center bg-white p-6">
              <Image src={p.logo} alt={p.name} width={180} height={60} className="h-10 w-auto max-w-[160px] object-contain" />
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand />
    </>
  );
}
