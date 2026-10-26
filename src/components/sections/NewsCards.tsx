import Image from "next/image";
import clsx from "clsx";
import type { NewsPost } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const source = (url: string) => (new URL(url).hostname.endsWith("linkedin.com") ? "LinkedIn" : new URL(url).hostname.replace(/^www\./, ""));

// News cards linking out to the original post (usually LinkedIn). A single
// post gets one wide card so the row doesn't look half empty.
export function NewsCards({ posts }: { posts: NewsPost[] }) {
  const single = posts.length === 1;
  return (
    <ul className={clsx("grid gap-6", !single && "md:grid-cols-2 lg:grid-cols-3")}>
      {posts.map((p, i) => (
        <Reveal as="li" key={p.id} delay={i * 0.06}>
          <article
            className={clsx(
              "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow duration-300 hover:shadow-[0_20px_60px_-20px_rgb(42_42_221/0.35)]",
              single && "md:flex-row",
            )}
          >
            {p.image ? (
              <div className={clsx("aspect-[20/11] overflow-hidden bg-mist", single && "md:aspect-auto md:w-1/2")}>
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  width={p.image.width}
                  height={p.image.height}
                  sizes={single ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out-quint group-hover:scale-105"
                />
              </div>
            ) : (
              single && (
                <div aria-hidden className="on-dark relative hidden overflow-hidden bg-ink-900 md:block md:w-2/5">
                  <div className="grid-lines absolute inset-0" />
                  <div className="absolute -right-16 top-1/2 size-72 -translate-y-1/2 rounded-full bg-blue/40 blur-3xl" />
                  <p className="relative flex h-full items-center justify-center font-mono text-7xl text-blue-300 transition-transform duration-700 ease-out-quint group-hover:scale-110">
                    {"{ }"}
                  </p>
                </div>
              )
            )}
            <div className={clsx("flex flex-1 flex-col p-6", single && "md:p-10")}>
              <p className="t-label text-blue">
                <time dateTime={p.date}>{fmt.format(new Date(p.date))}</time>
              </p>
              <h3 className={clsx("mt-3 text-balance", single ? "t-h2" : "t-h3")}>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0">
                  {p.title}
                  <span className="sr-only"> (opens {source(p.url)} in a new tab)</span>
                </a>
              </h3>
              <p className={clsx("mt-3 text-gray", single && "t-lead max-w-xl")}>{p.summary}</p>
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
