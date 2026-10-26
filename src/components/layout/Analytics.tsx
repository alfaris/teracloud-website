"use client";

import Script from "next/script";
import { useEffect } from "react";

const DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const SRC = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";

type Plausible = (event: string, options?: { props?: Record<string, string> }) => void;
declare global {
  interface Window {
    plausible?: Plausible & { q?: unknown[] };
  }
}

// Records a goal in Plausible. Safe to call when analytics is off.
export function track(event: string, props?: Record<string, string>) {
  window.plausible?.(event, props ? { props } : undefined);
}

// Classifies a clicked link into one of the site's goals.
function goalFor(a: HTMLAnchorElement): [string, Record<string, string>?] | null {
  const url = new URL(a.href, location.href);
  if (url.pathname === "/contact" && url.searchParams.get("intent") === "partnership") return ["Partner CTA", { from: location.pathname }];
  if (url.hostname.endsWith("ultipro.com") && url.pathname.includes("OpportunityDetail")) return ["Apply click", { job: location.pathname }];
  if (url.origin === location.origin && url.pathname === "/careers" && location.pathname !== "/careers") return ["Careers CTA", { from: location.pathname }];
  if (url.hostname.endsWith("linkedin.com")) return ["LinkedIn click", { from: location.pathname }];
  return null;
}

// Cookieless analytics (Plausible): no consent banner needed. Loads only when
// NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set at build time.
export function Analytics() {
  useEffect(() => {
    if (!DOMAIN) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      const goal = goalFor(a);
      if (goal) track(...goal);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!DOMAIN) return null;
  return (
    <>
      {/* Queue events fired before the script loads. */}
      <Script id="plausible-init" strategy="afterInteractive">
        {"window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}"}
      </Script>
      <Script src={SRC} data-domain={DOMAIN} strategy="afterInteractive" />
    </>
  );
}
