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
  art: number;
};

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
