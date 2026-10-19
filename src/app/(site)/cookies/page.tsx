import { PageHeader } from "@/components/layout/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cookies",
  description: "Teracloud.com does not use advertising or tracking cookies.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <>
      <PageHeader title="Cookies" crumbs={[{ href: "/cookies", label: "Cookies" }]} />
      <div className="container-tc py-16">
        <article className="prose-tc">
          <p>This website does not set advertising, profiling or cross-site tracking cookies, so we do not show a cookie banner.</p>
          <h2>Strictly necessary</h2>
          <p>Our hosting provider may set technical cookies needed to deliver the site securely. They contain no personal profile and cannot be switched off.</p>
          <h2>Analytics</h2>
          <p>
            If enabled, we measure visits with privacy-friendly, cookieless analytics that counts page views in aggregate.
            No personal data is stored and you are not tracked across sites.
          </p>
          <h2>Third-party sites</h2>
          <p>
            When you follow a link to our job board, sister companies or whistleblower hotline, those sites have their own
            cookie policies. See our <a href="/privacy">privacy policy</a> for more.
          </p>
        </article>
      </div>
    </>
  );
}
