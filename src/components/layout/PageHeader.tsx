import Link from "next/link";
import { BraceLabel } from "@/components/ui/BraceLabel";
import { RevealLines } from "@/components/ui/RevealLines";
import { JsonLd } from "@/lib/seo";
import { site } from "@/content/site";

type Crumb = { href: string; label: string };

export function PageHeader({
  label,
  title,
  intro,
  crumbs = [],
  children,
}: {
  label?: string;
  title: string;
  intro?: React.ReactNode;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  const trail = [{ href: "/", label: "Home" }, ...crumbs];
  return (
    <section className="relative overflow-hidden border-b border-line bg-white pt-[calc(var(--header-h)+3.5rem)] pb-16 sm:pb-20">
      <div aria-hidden className="absolute -right-40 -top-40 size-[520px] rounded-full bg-blue-50 blur-3xl" />
      <div className="container-tc relative">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray">
              {trail.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  {i === trail.length - 1 ? (
                    <span aria-current="page" className="text-ink">{c.label}</span>
                  ) : (
                    <Link href={c.href} className="hover:text-blue">{c.label}</Link>
                  )}
                </li>
              ))}
            </ol>
            <JsonLd
              data={{
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: `${site.url}${c.href}` })),
              }}
            />
          </nav>
        )}
        {label && <BraceLabel>{label}</BraceLabel>}
        <h1 className="t-h1 mt-4 max-w-4xl text-balance">
          <RevealLines lines={[title]} />
        </h1>
        {intro && <p className="t-lead mt-6 max-w-2xl text-gray">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
