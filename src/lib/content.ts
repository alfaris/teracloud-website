import { cacheLife, cacheTag } from "next/cache";
import { capabilities as localCapabilities } from "@/content/capabilities";
import { sisterCompanies, partners } from "@/content/companies";
import { news as localNews } from "@/content/news";
import { offices as localOffices } from "@/content/offices";
import { siteSettings as localSiteSettings } from "@/content/site";
import { work as localWork } from "@/content/work";
import type { Capability, CaseStudy, Company, NewsPost, Office, SiteSettings } from "@/content/types";
import { sanityFetch } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { capabilitiesQuery, caseStudiesQuery, companiesQuery, newsQuery, officesQuery, siteSettingsQuery } from "@/sanity/queries";

// Every read of editable content goes through here. With SANITY_PROJECT_ID set
// it comes from Sanity; otherwise from the typed files in src/content. Each
// function is tagged with its Sanity document type, which is what
// /api/revalidate expires when a document is published. The "content" cache
// profile is defined in next.config.ts.

// A reference to an unpublished document dereferences to null.
const present = <T>(xs: (T | null)[]) => xs.filter((x): x is T => x != null);

export async function getCapabilities(): Promise<Capability[]> {
  "use cache";
  cacheTag("capability");
  cacheLife("content");
  if (!isSanityConfigured) return localCapabilities;
  const rows = await sanityFetch<(Capability & { offices: (string | null)[]; work: (string | null)[] })[]>(capabilitiesQuery);
  return rows.map((c) => ({ ...c, offices: present(c.offices), work: present(c.work) }));
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  "use cache";
  cacheTag("caseStudy");
  cacheLife("content");
  if (!isSanityConfigured) return localWork;
  const rows = await sanityFetch<(CaseStudy & { capability: string | null; offices: (string | null)[] })[]>(caseStudiesQuery);
  return rows.map((w) => ({ ...w, capability: w.capability ?? "", offices: present(w.offices) }));
}

export async function getOffices(): Promise<Office[]> {
  "use cache";
  cacheTag("office");
  cacheLife("content");
  if (!isSanityConfigured) return localOffices;
  const rows = await sanityFetch<(Omit<Office, "address"> & { address: string | null })[]>(officesQuery);
  return rows.map(({ address, ...o }) => (address ? { ...o, address } : o));
}

export async function getCompanies(): Promise<Company[]> {
  "use cache";
  cacheTag("company");
  cacheLife("content");
  if (!isSanityConfigured) return [...sisterCompanies, ...partners];
  return sanityFetch<Company[]>(companiesQuery);
}

export async function getNews(): Promise<NewsPost[]> {
  "use cache";
  cacheTag("newsPost");
  cacheLife("content");
  if (!isSanityConfigured) return localNews;
  const rows = await sanityFetch<(Omit<NewsPost, "image"> & { image: NewsPost["image"] | null })[]>(newsQuery);
  return rows.map(({ image, ...p }) => (image ? { ...p, image } : p));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag("siteSettings");
  cacheLife("content");
  if (!isSanityConfigured) return localSiteSettings;
  const settings = await sanityFetch<SiteSettings | null>(siteSettingsQuery);
  if (!settings) {
    console.warn("Sanity has no siteSettings document yet (run `npm run sanity:seed`); using src/content/site.ts.");
    return localSiteSettings;
  }
  return settings;
}

export const getCapability = async (slug: string) => (await getCapabilities()).find((c) => c.slug === slug);
export const getCaseStudy = async (slug: string) => (await getCaseStudies()).find((w) => w.slug === slug);
export const getOffice = async (slug: string) => (await getOffices()).find((o) => o.slug === slug);
export const getSisterCompanies = async () => (await getCompanies()).filter((c) => c.relation === "sister");
export const getLatestNews = async (count: number, topics?: NewsPost["topics"]) =>
  (await getNews()).filter((p) => !topics || p.topics.some((t) => topics.includes(t))).slice(0, count);
export const getPartners = async () => (await getCompanies()).filter((c) => c.relation === "partner");
