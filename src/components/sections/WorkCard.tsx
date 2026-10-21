import Link from "next/link";
import { CaseCover } from "./CaseCover";
import type { CaseStudy } from "@/content/types";
import { getCapability } from "@/lib/content";

export async function WorkCard({ item, headingLevel = "h3" }: { item: CaseStudy; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  const capability = await getCapability(item.capability);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow duration-300 hover:shadow-[0_20px_60px_-20px_rgb(42_42_221/0.35)]">
      <div className="aspect-[20/13] overflow-hidden bg-ink-900">
        <CaseCover
          item={item}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="transition-transform duration-700 ease-out-quint group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="t-label text-blue">{capability?.title}</p>
        <H className="t-h3 mt-3 text-balance">
          <Link href={`/work/${item.slug}`} className="after:absolute after:inset-0">
            {item.title}
          </Link>
        </H>
        <p className="mt-3 text-gray">{item.summary}</p>
        <p className="mt-auto pt-6 text-sm font-semibold text-blue">
          Read case study <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </p>
      </div>
    </article>
  );
}
