import Link from "next/link";
import { capabilities } from "@/content/capabilities";
import { Reveal } from "@/components/ui/Reveal";

export function CapabilityGrid({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {capabilities.map((c, i) => (
        <Reveal as="li" key={c.slug} delay={(i % 3) * 0.06} className="bg-white">
          <div className="brace-frame group relative flex h-full flex-col p-8 transition-colors hover:bg-blue-50/60">
            <span className="font-mono text-sm text-gray" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <H className="t-h3 mt-6">
              <Link href={`/capabilities/${c.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
                {c.title}
              </Link>
            </H>
            <p className="mt-3 text-gray">{c.short}</p>
            <p className="mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.8125rem] text-ink/60">
              {c.stack.slice(0, 4).join(" · ")}
            </p>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
