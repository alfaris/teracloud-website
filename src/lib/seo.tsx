import type { Metadata } from "next";
import { site } from "@/content/site";
import type { SiteSettings } from "@/content/types";

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} · ${site.name}`, description, url: path, siteName: site.name, type: "website" },
    twitter: { card: "summary_large_image", title: `${title} · ${site.name}`, description },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const organizationLd = (settings: SiteSettings) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  alternateName: site.name,
  url: site.url,
  logo: `${site.url}/brand/Teracloud_logomark_blue.svg`,
  email: settings.email,
  foundingDate: String(settings.founded),
  description: settings.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: settings.address.street,
    postalCode: settings.address.postalCode,
    addressLocality: "Copenhagen",
    addressCountry: "DK",
  },
});
