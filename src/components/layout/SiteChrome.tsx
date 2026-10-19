import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { getSiteSettings } from "@/lib/content";
import { JsonLd, organizationLd } from "@/lib/seo";
import "@/app/globals.css";

// Header, footer and global styles for every public page, including 404.
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-blue px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Suspense fallback={<div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[var(--header-h)]" />}>
        <Header />
      </Suspense>
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <SmoothScroll />
      <JsonLd data={organizationLd(settings)} />
    </>
  );
}
