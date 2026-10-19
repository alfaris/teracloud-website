// The Sanity documents built from the typed content in src/content.
// Shared by the seed script and the local mock API.
import { capabilities } from "../../src/content/capabilities.ts";
import { partners, sisterCompanies } from "../../src/content/companies.ts";
import { offices } from "../../src/content/offices.ts";
import { siteSettings } from "../../src/content/site.ts";
import { work } from "../../src/content/work.ts";
import type { TitledText } from "../../src/content/types.ts";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const slug = (current: string) => ({ _type: "slug", current });
const ref = (type: string, s: string) => ({ _type: "reference", _ref: `${type}-${s}`, _key: s });
const titled = (items: readonly TitledText[]) =>
  items.map((t) => ({ _type: "titledText", _key: slugify(t.title), title: t.title, body: t.body }));

export type Doc = { _id: string; _type: string; [k: string]: unknown };

export const docs: Doc[] = [
  ...offices.map((o, i) => ({
    _id: `office-${o.slug}`,
    _type: "office",
    city: o.city,
    slug: slug(o.slug),
    order: i,
    country: o.country,
    region: o.region,
    ...(o.address ? { address: o.address } : {}),
    focus: o.focus,
    coords: { _type: "geopoint", lat: o.coords[0], lng: o.coords[1] },
  })),
  ...capabilities.map((c, i) => ({
    _id: `capability-${c.slug}`,
    _type: "capability",
    title: c.title,
    slug: slug(c.slug),
    order: i,
    short: c.short,
    summary: c.summary,
    builds: titled(c.builds),
    stack: c.stack,
    offices: c.offices.map((s) => ref("office", s)),
    work: c.work.map((s) => ref("caseStudy", s)),
  })),
  ...work.map((w, i) => ({
    _id: `caseStudy-${w.slug}`,
    _type: "caseStudy",
    title: w.title,
    slug: slug(w.slug),
    order: i,
    client: w.client,
    capability: { _type: "reference", _ref: `capability-${w.capability}` },
    summary: w.summary,
    challenge: w.challenge,
    approach: w.approach,
    stack: w.stack,
    outcome: w.outcome,
    offices: w.offices.map((s) => ref("office", s)),
    art: w.art,
  })),
  ...[...sisterCompanies, ...partners].map((c, i) => ({
    _id: `company-${slugify(c.name)}`,
    _type: "company",
    name: c.name,
    relation: c.relation,
    order: i,
    url: c.url,
    logo: c.logo,
    ...(c.description ? { description: c.description } : {}),
  })),
  {
    _id: "siteSettings",
    _type: "siteSettings",
    tagline: siteSettings.tagline,
    description: siteSettings.description,
    email: siteSettings.email,
    address: siteSettings.address,
    founded: siteSettings.founded,
    whistleblowerUrl: siteSettings.whistleblowerUrl,
    stats: siteSettings.stats.map((s) => ({ _type: "stat", _key: slugify(s.label), ...s })),
    principles: titled(siteSettings.principles),
    benefits: titled(siteSettings.benefits),
    hiringSteps: titled(siteSettings.hiringSteps),
    crossCutting: titled(siteSettings.crossCutting),
  },
];

// References that don't point at a document in this set.
export function danglingRefs() {
  const ids = new Set(docs.map((d) => d._id));
  const refs = JSON.stringify(docs).match(/"_ref":"[^"]+"/g)?.map((m) => m.slice(8, -1)) ?? [];
  return [...new Set(refs.filter((id) => !ids.has(id)))];
}

