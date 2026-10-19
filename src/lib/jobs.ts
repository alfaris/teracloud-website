import { cacheLife, cacheTag } from "next/cache";
import { site } from "@/content/site";
import type { Job, Office } from "@/content/types";
import { getOffices } from "@/lib/content";

// Teracloud's UKG Pro Recruiting board. The public search endpoint is what
// the board UI itself calls; we read it server-side so jobs are in the HTML.
const BOARD = site.jobBoardUrl.replace(/\/$/, "");

type UkgOpportunity = {
  Id: string;
  Title: string;
  RequisitionNumber: string;
  FullTime: boolean;
  JobCategoryName: string | null;
  PostedDate: string;
  BriefDescription: string;
  Locations: { Address: { City: string | null; Country: { Name: string } | null } }[];
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-");

const officeFor = (offices: Office[], city?: string | null) => {
  if (!city) return undefined;
  const c = city.toLowerCase();
  return offices.find((o) => o.city.toLowerCase() === c || o.slug === slugify(c));
};

function toJob(o: UkgOpportunity, offices: Office[]): Job {
  const loc = o.Locations[0]?.Address;
  const office = officeFor(offices, loc?.City);
  return {
    id: o.Id,
    slug: `${slugify(o.Title)}-${o.RequisitionNumber.toLowerCase()}`,
    title: o.Title,
    department: o.JobCategoryName ?? "Engineering",
    officeSlug: office?.slug ?? "",
    location: [loc?.City, loc?.Country?.Name].filter(Boolean).join(", "),
    postedAt: o.PostedDate,
    employmentType: o.FullTime ? "FULL_TIME" : "PART_TIME",
    summary: o.BriefDescription.trim(),
    applyUrl: `${BOARD}/OpportunityDetail?opportunityId=${o.Id}`,
  };
}

export async function getJobs(): Promise<Job[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("jobs");
  const offices = await getOffices();
  try {
    const res = await fetch(`${BOARD}/JobBoardView/LoadSearchResults`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opportunitySearch: {
          Top: 100,
          Skip: 0,
          QueryString: "",
          OrderBy: [{ Value: "postedDateDesc", PropertyName: "PostedDate", Ascending: false }],
          Filters: [],
        },
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { opportunities?: UkgOpportunity[] };
    return (data.opportunities ?? []).map((o) => toJob(o, offices));
  } catch {
    // Board unreachable: render the page with the "no open roles" state.
    return [];
  }
}

export async function getJob(slug: string) {
  return (await getJobs()).find((j) => j.slug === slug);
}
