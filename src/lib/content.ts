import { capabilities } from "@/content/capabilities";
import { hackathonEditions } from "@/content/hackathon";
import { sisterCompanies, partners } from "@/content/companies";
import { news } from "@/content/news";
import { offices } from "@/content/offices";
import { siteSettings } from "@/content/site";
import { work } from "@/content/work";
import type { Capability, CaseStudy, Company, HackathonEdition, NewsPost, Office, SiteSettings } from "@/content/types";

// Every read of editable content goes through here, so pages don't depend on
// where it is stored. Today that is the typed files in src/content (see
// README → Editing content). The functions are async so another source, such
// as a CMS, can be plugged in here later without touching the pages.

export async function getCapabilities(): Promise<Capability[]> {
  return capabilities;
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return work;
}

export async function getOffices(): Promise<Office[]> {
  return offices;
}

export async function getCompanies(): Promise<Company[]> {
  return [...sisterCompanies, ...partners];
}

// Newest first, whatever order the file lists them in.
export async function getNews(): Promise<NewsPost[]> {
  return news.toSorted((a, b) => b.date.localeCompare(a.date));
}

// Newest edition first.
export async function getHackathonEditions(): Promise<HackathonEdition[]> {
  return hackathonEditions.toSorted((a, b) => b.year - a.year);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings;
}

export const getCapability = async (slug: string) => (await getCapabilities()).find((c) => c.slug === slug);
export const getCaseStudy = async (slug: string) => (await getCaseStudies()).find((w) => w.slug === slug);
export const getOffice = async (slug: string) => (await getOffices()).find((o) => o.slug === slug);
export const getSisterCompanies = async () => (await getCompanies()).filter((c) => c.relation === "sister");
export const getLatestNews = async (count: number, topics?: NewsPost["topics"]) =>
  (await getNews()).filter((p) => !topics || p.topics.some((t) => topics.includes(t))).slice(0, count);
export const getPartners = async () => (await getCompanies()).filter((c) => c.relation === "partner");
