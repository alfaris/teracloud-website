import { Button } from "@/components/ui/Button";
import { SiteChrome } from "@/components/layout/SiteChrome";

// Root-level, so it renders in the bare root layout: bring the site chrome.
export default function NotFound() {
  return (
    <SiteChrome>
      <section className="on-dark flex min-h-[80svh] items-center bg-ink-900 pt-[var(--header-h)] text-white">
        <div className="container-tc">
          <p className="font-mono text-blue-300">{"{ 404 }"}</p>
          <h1 className="t-h1 mt-4">This page isn&apos;t in our stack.</h1>
          <p className="t-lead mt-5 max-w-xl text-white/70">The link may be old or mistyped. Try one of these instead.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/" variant="light">Home</Button>
            <Button href="/capabilities" variant="secondary" className="border-white/25 text-white hover:border-white hover:text-white">Capabilities</Button>
            <Button href="/careers" variant="secondary" className="border-white/25 text-white hover:border-white hover:text-white">Careers</Button>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
