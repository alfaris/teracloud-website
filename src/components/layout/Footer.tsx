import Link from "next/link";
import { capabilities } from "@/content/capabilities";
import { site } from "@/content/site";
import { Logo } from "./Logo";

const company = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/locations", label: "Locations" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="on-dark bg-ink-900 text-white">
      <div className="container-tc grid gap-12 py-16 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo tone="white" />
          <p className="mt-6 max-w-sm text-white/65">{site.tagline}</p>
          <address className="mt-8 not-italic text-white/65">
            {site.legalName}
            <br />
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city}, {site.address.country}
            <br />
            <a className="mt-2 inline-block text-white hover:text-blue-300" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </address>
        </div>
        <nav aria-label="Capabilities" className="lg:col-span-3 lg:col-start-6">
          <h2 className="t-label text-white/50">Capabilities</h2>
          <ul className="mt-5 space-y-3">
            {capabilities.map((c) => (
              <li key={c.slug}>
                <Link className="text-white/80 hover:text-white" href={`/capabilities/${c.slug}`}>
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company" className="lg:col-span-2">
          <h2 className="t-label text-white/50">Company</h2>
          <ul className="mt-5 space-y-3">
            {company.map((c) => (
              <li key={c.href}>
                <Link className="text-white/80 hover:text-white" href={c.href}>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Legal" className="lg:col-span-2">
          <h2 className="t-label text-white/50">Legal</h2>
          <ul className="mt-5 space-y-3">
            <li><Link className="text-white/80 hover:text-white" href="/privacy">Privacy policy</Link></li>
            <li><Link className="text-white/80 hover:text-white" href="/cookies">Cookies</Link></li>
            <li>
              <a className="text-white/80 hover:text-white" href={site.whistleblowerUrl} target="_blank" rel="noopener noreferrer">
                Whistleblower hotline <span aria-hidden>↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="container-tc flex flex-col gap-2 py-6 text-sm text-white/50 sm:flex-row sm:justify-between">
          <p>© {site.legalName}</p>
          <p>Copenhagen · Malmö · Stuttgart · Athens · Yerevan · Cairo · Boston · Perth</p>
        </div>
      </div>
    </footer>
  );
}
