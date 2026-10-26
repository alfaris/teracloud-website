import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/content/site";
import { getSiteSettings } from "@/lib/content";
import { Analytics } from "@/components/layout/Analytics";

const manrope = localFont({
  src: "../fonts/Manrope-Variable.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { tagline, description } = await getSiteSettings();
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} — ${tagline}`, template: `%s · ${site.name}` },
    description,
    applicationName: site.name,
    openGraph: { siteName: site.name, type: "website", locale: "en" },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e0e12",
};

// Bare document shell. Header, footer and global styles live in SiteChrome,
// used by app/(site)/layout.tsx and the root not-found page.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="flex min-h-screen flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
