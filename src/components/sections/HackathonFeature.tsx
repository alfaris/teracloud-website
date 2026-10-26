import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { getHackathonEditions } from "@/lib/content";

const place = (e: { city?: string; country: string }) => [e.city, e.country].filter(Boolean).join(", ");

// Homepage feature for the annual hackathon: every edition at a glance, linking
// to its entry on /hackathon.
export async function HackathonFeature() {
  const editions = await getHackathonEditions();
  if (editions.length === 0) return null;
  return (
    <section className="on-dark relative isolate overflow-hidden bg-blue py-20 text-white sm:py-28">
      <div aria-hidden className="grid-lines absolute inset-0 -z-10 opacity-60" />
      <div aria-hidden className="absolute -left-40 top-1/2 -z-10 size-[520px] -translate-y-1/2 rounded-full bg-ink-900/40 blur-[120px]" />
      <div className="container-tc grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <p className="t-label text-white/80">
            <span aria-hidden className="font-mono">{"{ "}</span>Teracloud Hackathon<span aria-hidden className="font-mono">{" }"}</span>
          </p>
          <h2 className="t-h1 mt-4 text-balance">Once a year, we build what&apos;s next.</h2>
          <p className="t-lead mt-5 text-white/80">
            Teams from across our hubs spend three days turning ideas into working products. Each year a different hub hosts, and
            the finalists present in person.
          </p>
          <Button href="/hackathon" variant="light" className="mt-10">
            Explore the hackathon
          </Button>
        </div>
        <ol className="space-y-3 lg:col-span-6 lg:col-start-7">
          {editions.map((e, i) => {
            const winner = e.highlights.find((h) => h.title.startsWith("Winner:"));
            const facts = (e.stats ?? []).slice(0, 3).map((s) => `${s.value} ${s.label.startsWith("Teraclouder") ? s.label : s.label.toLowerCase()}`);
            return (
              <Reveal as="li" key={e.year} delay={i * 0.08}>
                <Link
                  href={`/hackathon#edition-${e.year}`}
                  className="group flex items-center gap-4 rounded-2xl sm:gap-6 border border-white/20 bg-white/[0.06] p-6 transition-colors hover:border-white/60 hover:bg-white/10"
                >
                  <span className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">{e.year}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xl font-bold">{place(e)}</span>
                    <span className="mt-1 block text-white/80">
                      {[e.dates, ...facts].filter(Boolean).join(" · ") || "Hosted by our local team"}
                    </span>
                    {winner && <span className="mt-1 block text-white/80">{winner.title}</span>}
                  </span>
                  <span aria-hidden className="text-2xl transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
