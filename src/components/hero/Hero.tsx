import { Button } from "@/components/ui/Button";
import { RevealLines, FadeUp } from "@/components/ui/RevealLines";
import { HeroCanvas } from "./HeroCanvas";

export function Hero() {
  return (
    <section className="on-dark relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink-900 text-white">
      <div aria-hidden className="grid-lines absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_45%,rgb(42_42_221/0.35),transparent_60%)]" />

      {/* 3D stage sits right on desktop, behind the copy on mobile */}
      <div className="absolute inset-x-0 -top-[10%] bottom-[35%] -z-10 opacity-35 sm:opacity-50 lg:inset-y-0 lg:left-[42%] lg:opacity-100">
        <HeroCanvas />
      </div>

      <div className="container-tc relative pb-16 pt-[calc(var(--header-h)+4rem)] sm:pb-24">
        <div className="max-w-3xl">
          <p className="t-label mb-6 text-blue-300">
            <span aria-hidden className="font-mono">{"{ "}</span>
            Software R&amp;D · Since 2015
            <span aria-hidden className="font-mono">{" }"}</span>
          </p>
          <h1 className="t-display text-balance">
            <RevealLines lines={["Systems engineering,", "from the operating", "system up."]} />
          </h1>
          <FadeUp delay={0.4}>
            <p className="t-lead mt-8 max-w-xl text-white/75">
              We are the R&amp;D partner behind enterprise operating systems, mainframe software, compilers,
              real-time data platforms and industrial energy systems. 200+ engineers across 8 hubs.
            </p>
          </FadeUp>
          <FadeUp delay={0.55}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/contact?intent=partnership" variant="light">
                Partner with us
              </Button>
              <Button href="/careers" variant="secondary" className="border-white/25 text-white hover:border-white hover:text-white">
                Join the team
              </Button>
            </div>
          </FadeUp>
        </div>
      </div>

      <a
        href="#proof"
        className="absolute bottom-6 right-6 hidden items-center gap-3 text-sm text-white/60 hover:text-white sm:flex"
      >
        Scroll
        <span aria-hidden className="block h-10 w-px overflow-hidden bg-white/20">
          <span className="block h-1/2 w-px animate-[scrollcue_1.8s_ease-in-out_infinite] bg-white" />
        </span>
      </a>
    </section>
  );
}
