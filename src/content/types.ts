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
