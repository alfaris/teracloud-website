import Link from "next/link";
import type { Job } from "@/content/types";
import { site } from "@/content/site";

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function JobList({ jobs, email, emptyCity }: { jobs: Job[]; email: string; emptyCity?: string }) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-8 text-center">
        <p className="t-h3">No open roles {emptyCity ? `in ${emptyCity} ` : ""}right now</p>
        <p className="mx-auto mt-3 max-w-md text-gray">
          We hire throughout the year. Check the{" "}
          <a className="text-blue underline underline-offset-4" href={site.jobBoardUrl} target="_blank" rel="noopener noreferrer">
            full job board<span className="sr-only"> (opens in a new tab)</span>
          </a>{" "}
          or send an open application to <a className="text-blue underline underline-offset-4" href={`mailto:${email}`}>{email}</a>.
        </p>
      </div>
    );
  }
  return (
    <ul className="divide-y divide-line border-y border-line">
      {jobs.map((j) => (
        <li key={j.id} className="group relative grid gap-2 py-6 transition-colors hover:bg-mist/60 sm:grid-cols-12 sm:items-center sm:px-4">
          <h3 className="t-h3 sm:col-span-6">
            <Link href={`/careers/${j.slug}`} className="after:absolute after:inset-0 group-hover:text-blue">
              {j.title}
            </Link>
          </h3>
          <p className="text-gray sm:col-span-3">{j.location}</p>
          <p className="text-sm text-gray sm:col-span-2">
            {j.department} · <time dateTime={j.postedAt}>{fmt.format(new Date(j.postedAt))}</time>
          </p>
          <span aria-hidden className="hidden text-right text-blue sm:col-span-1 sm:block">→</span>
        </li>
      ))}
    </ul>
  );
}
