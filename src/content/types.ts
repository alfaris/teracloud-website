export type Capability = {
  slug: string;
  title: string;
  short: string;
  summary: string;
  builds: { title: string; body: string }[];
  stack: string[];
  offices: string[];
  work: string[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  capability: string;
  summary: string;
  challenge: string;
  approach: string[];
  stack: string[];
  outcome: string;
  offices: string[];
  // Cover artwork drawn by CaseArt until real imagery exists: `visual` picks
  // the illustration (it falls back to one for the capability), `art` seeds
  // its small variations.
  visual?: CaseVisual;
  art: number;
  // Real project imagery. When set it replaces the illustration.
  image?: ImageRef;
};

export const CASE_VISUALS = ["kernel", "mainframe", "scada", "streams", "video", "simulation", "gaming"] as const;
export type CaseVisual = (typeof CASE_VISUALS)[number];

export type ImageRef = { src: string; alt: string; width: number; height: number };

export type Office = {
  slug: string;
  city: string;
  country: string;
  region: "Europe" | "Americas" | "MENA" | "Asia-Pacific";
  address?: string;
  focus: string[];
  coords: [lat: number, lng: number];
  since?: number; // year the hub opened
  entity?: string; // local company or lab name, e.g. Nubistech in Cairo
};

export type Company = {
  name: string;
  url: string;
  logo: string;
  description: string;
  relation: "sister" | "partner";
};

export type Job = {
  id: string;
  slug: string;
  title: string;
  department: string;
  officeSlug: string;
  location: string;
  postedAt: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACTOR";
  summary: string;
  applyUrl: string;
};

export type TitledText = { title: string; body: string };

// Company-wide copy (src/content/site.ts → siteSettings). Identity that code
// depends on (name, URL, job board) is the separate `site` object there.
export type SiteSettings = {
  email: string;
  address: { street: string; postalCode: string; city: string; country: string };
  founded: number;
  tagline: string;
  description: string;
  whistleblowerUrl: string;
  stats: { value: number; label: string; suffix: string }[];
  principles: TitledText[];
  benefits: TitledText[];
  hiringSteps: TitledText[];
  crossCutting: TitledText[];
};

export const NEWS_TOPICS = ["company", "engineering", "culture", "hiring"] as const;

// A post on Teracloud's LinkedIn page (or elsewhere), summarized on the site
// and linked out to.
export type NewsPost = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  url: string;
  topics: (typeof NEWS_TOPICS)[number][];
  image?: { src: string; alt: string; width: number; height: number };
};

// One edition of the annual Teracloud Hackathon (src/content/hackathon.ts).
export type HackathonEdition = {
  year: number;
  city?: string;
  country: string;
  dates?: string; // human-readable, e.g. "14–16 September"
  theme?: string;
  summary: string;
  highlights: { title: string; body: string }[];
  stats?: { value: number; label: string }[];
  url?: string; // public recap post, linked from the page
  source?: string; // where the facts come from (LinkedIn post or similar)
  image?: ImageRef;
};
