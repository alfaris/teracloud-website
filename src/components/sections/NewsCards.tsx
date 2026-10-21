import Image from "next/image";
import type { NewsPost } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const source = (url: string) => (new URL(url).hostname.endsWith("linkedin.com") ? "LinkedIn" : new URL(url).hostname.replace(/^www\./, ""));

// News cards linking out to the original post (usually LinkedIn).
export function NewsCards({ posts }: { posts: NewsPost[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((p, i) => (
        <Reveal as="li" key={p.id} delay={i * 0.06}>
          <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow duration-300 hover:shadow-[0_20px_60px_-20px_rgb(42_42_221/0.35)]">
            {p.image && (
              <div className="aspect-[20/11] overflow-hidden bg-mist">
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  width={p.image.width}
                  height={p.image.height}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out-quint group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-6">
              <p className="t-label text-blue">
                <time dateTime={p.date}>{fmt.format(new Date(p.date))}</time>
              </p>
              <h3 className="t-h3 mt-3 text-balance">
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0">
                  {p.title}
                  <span className="sr-only"> (opens {source(p.url)} in a new tab)</span>
                </a>
              </h3>
              <p className="mt-3 text-gray">{p.summary}</p>
              <p aria-hidden className="mt-auto pt-6 text-sm font-semibold text-blue">
                Read on {source(p.url)} <span className="inline-block transition-transform group-hover:translate-x-1">↗</span>
              </p>
            </div>
          </article>
        </Reveal>
      ))}
    </ul>
  );
}
