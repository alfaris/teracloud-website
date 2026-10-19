import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "./ContactForm";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Talk to Teracloud about an engineering partnership, careers or anything else. Headquarters: Nicolai Eigtveds Gade 26, Copenhagen.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader label="Contact" title="Let's talk." intro="Tell us about the system you need built or the problem you need solved. We reply to most messages within two working days." />
      <Section>
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Suspense fallback={<div className="h-[640px] animate-pulse rounded-2xl bg-mist" />}>
              <ContactForm />
            </Suspense>
          </div>
          <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
            <div>
              <h2 className="t-label text-gray">Headquarters</h2>
              <address className="mt-3 not-italic t-lead">
                {site.legalName}<br />{site.address.street}<br />{site.address.postalCode} {site.address.city}<br />{site.address.country}
              </address>
            </div>
            <div>
              <h2 className="t-label text-gray">Email</h2>
              <a href={`mailto:${site.email}`} className="t-lead mt-3 inline-block text-blue hover:underline">{site.email}</a>
            </div>
            <div>
              <h2 className="t-label text-gray">Speak up</h2>
              <p className="mt-3 text-gray">
                Report concerns confidentially through our{" "}
                <a href={site.whistleblowerUrl} target="_blank" rel="noopener noreferrer" className="text-blue underline underline-offset-4">
                  whistleblower hotline<span className="sr-only"> (opens in a new tab)</span>
                </a>.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
