import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { CapabilityIcon } from "@/components/ui/CapabilityIcon";
import { getCapabilities } from "@/lib/content";

// The six capability areas as linked cards. `detailed` (the /capabilities
// index) also lists what each area builds.
export async function CapabilityGrid({ headingLevel = "h3", detailed = false }: { headingLevel?: "h2" | "h3"; detailed?: boolean }) {
  const H = headingLevel;
  const capabilities = await getCapabilities();
  return (
    <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {capabilities.map((c, i) => (
        <Reveal as="li" key={c.slug} delay={(i % 3) * 0.06} className="bg-white">
          <div className="brace-frame brace-frame-reveal group relative flex h-full flex-col p-6 transition-colors duration-150 hover:bg-blue-50/50 has-[a:focus-visible]:bg-blue-50/50 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-blue has-[a:focus-visible]:ring-inset sm:p-8">
            <div className="flex items-start justify-between">
              <span className="grid size-12 place-items-center rounded-xl bg-blue-50 text-blue transition-colors duration-150 group-hover:bg-blue group-hover:text-white">
                <CapabilityIcon slug={c.slug} className="size-6" />
              </span>
              <span className="font-mono text-[0.8125rem] text-gray" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <H className="t-h3 mt-6 text-balance sm:mt-8 lg:min-h-[2lh]">
              <Link href={`/capabilities/${c.slug}`} className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none">
                {c.title}
              </Link>
            </H>
            <p className="mt-3 text-gray">{c.short}</p>
            {detailed && (
              <ul className="mt-6 space-y-2.5 border-t border-line pt-6" aria-label={`${c.title}: what we build`}>
                {c.builds.map((b) => (
                  <li key={b.title} className="flex items-baseline gap-3 text-[0.9375rem] font-medium">
                    <span className="size-1.5 shrink-0 -translate-y-0.5 rounded-[2px] bg-blue" aria-hidden />
                    {b.title}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-auto flex items-end justify-between gap-4 pt-8">
              <ul className="flex flex-wrap gap-1.5" aria-label="Technology">
                {c.stack.slice(0, 3).map((s) => (
                  <li key={s} className="rounded-md bg-mist px-2 py-0.5 font-mono text-[0.8125rem] text-gray transition-colors duration-150 group-hover:bg-white">
                    {s}
                  </li>
                ))}
              </ul>
              <span
                aria-hidden
                className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-ink transition-[background-color,border-color,color,transform] duration-150 group-hover:border-blue group-hover:bg-blue group-hover:text-white group-focus-within:border-blue"
              >
                <svg viewBox="0 0 24 24" className="size-4.5 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
