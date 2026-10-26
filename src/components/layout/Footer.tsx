import Link from "next/link";
import { site } from "@/content/site";
import { getCapabilities, getOffices, getSiteSettings } from "@/lib/content";
import { Logo } from "./Logo";

const company = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/locations", label: "Locations" },
  { href: "/careers", label: "Careers" },
  { href: "/hackathon", label: "Hackathon" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export async function Footer() {
  const [settings, capabilities, offices] = await Promise.all([getSiteSettings(), getCapabilities(), getOffices()]);
  return (
    <footer className="on-dark bg-ink-900 text-white">
      <div className="container-tc grid gap-12 py-16 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo tone="white" />
          <p className="mt-6 max-w-sm text-white/65">{settings.tagline}</p>
          <address className="mt-8 not-italic text-white/65">
            {site.legalName}
            <br />
            {settings.address.street}
            <br />
            {settings.address.postalCode} {settings.address.city}, {settings.address.country}
            <br />
            <a className="mt-2 inline-block text-white hover:text-blue-300" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
          </address>
        </div>
        <nav aria-label="Capabilities" className="lg:col-span-3 lg:col-start-6">
          <h2 className="t-label text-white/50">Capabilities</h2>
          <ul className="mt-4 space-y-1">
            {capabilities.map((c) => (
              <li key={c.slug}>
                <Link className="inline-block py-1.5 text-white/80 hover:text-white" href={`/capabilities/${c.slug}`}>
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company" className="lg:col-span-2">
          <h2 className="t-label text-white/50">Company</h2>
          <ul className="mt-4 space-y-1">
            {company.map((c) => (
              <li key={c.href}>
                <Link className="inline-block py-1.5 text-white/80 hover:text-white" href={c.href}>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Legal" className="lg:col-span-2">
          <h2 className="t-label text-white/50">Legal</h2>
          <ul className="mt-4 space-y-1">
            <li><Link className="inline-block py-1.5 text-white/80 hover:text-white" href="/privacy">Privacy policy</Link></li>
            <li><Link className="inline-block py-1.5 text-white/80 hover:text-white" href="/cookies">Cookies</Link></li>
            <li>
              <a className="inline-block py-1.5 text-white/80 hover:text-white" href={settings.whistleblowerUrl} target="_blank" rel="noopener noreferrer">
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
          <p>{offices.map((o) => o.city).join(" · ")}</p>
        </div>
      </div>
    </footer>
  );
}
