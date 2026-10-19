import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { HubsMap } from "@/components/sections/HubsMap";
import { CtaBand } from "@/components/sections/CtaBand";
import { getOffices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Locations",
  description: "Teracloud engineering hubs in Copenhagen, Malmö, Stuttgart, Athens, Yerevan, Cairo, Boston and Perth.",
  path: "/locations",
});

export default async function LocationsPage() {
  const offices = await getOffices();
  return (
    <>
      <PageHeader label="Locations" title="Eight hubs, one engineering culture." intro="Headquartered in Copenhagen, with teams across Europe, the US, MENA and Australia." />
      <Section tone="dark">
        <HubsMap />
      </Section>
      <Section>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {offices.map((o) => (
            <li key={o.slug}>
              <Link href={`/locations/${o.slug}`} className="brace-frame group block h-full rounded-2xl bg-mist p-6">
                <h2 className="t-h3 group-hover:text-blue">{o.city}</h2>
                <p className="text-gray">{o.country}{o.slug === "copenhagen" ? " · Headquarters" : ""}</p>
                <ul className="mt-5 space-y-1 text-sm text-ink/75">
                  {o.focus.slice(0, 3).map((f) => <li key={f}>{f}</li>)}
                </ul>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand />
    </>
  );
}
