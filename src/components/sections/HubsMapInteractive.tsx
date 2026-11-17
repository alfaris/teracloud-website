"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type HubsActive = { active: string | null; setActive: (slug: string | null) => void };
const HubsActiveContext = createContext<HubsActive>({ active: null, setActive: () => {} });

/** The hub highlighted on the map, shared with the 3D map on the Locations page. */
export const useHubsActive = () => useContext(HubsActiveContext);

// Makes the hubs map respond. Pointing at or focusing a hub, in the list or on
// the map, marks every element with that `data-hub` (its dot, route, label and
// list entry) with data-active="true", and the root with data-hovering="true"
// so the other hubs can dim. Clicking a hub on the map opens its page; the SVG
// stays aria-hidden, so keyboard users reach the same pages through the list.
export function HubsMapInteractive({ className, children }: { className?: string; children: React.ReactNode }) {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const hubAt = (node: EventTarget | Element | null) =>
      node instanceof Element ? (node.closest<HTMLElement | SVGElement>("[data-hub]")?.dataset.hub ?? null) : null;
    const hubOf = (e: Event) => hubAt(e.target);
    // A hub focused from the keyboard stays lit while the pointer wanders.
    const focused = () => (el.contains(document.activeElement) ? hubAt(document.activeElement) : null);
    const pick = (e: Event) => setActive(hubOf(e) ?? focused());
    const clear = () => setActive(focused());
    const blur = (e: FocusEvent) => setActive(el.contains(e.relatedTarget as Node | null) ? hubAt(e.relatedTarget) : null);
    const open = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest("svg")) return; // list entries are links already
      const slug = hubOf(e);
      if (slug) router.push(`/locations/${slug}`);
    };
    // Focus or the pointer may have reached a hub before this ran (while the
    // page was still loading); pick that up instead of waiting for the next event.
    const hovered = [...el.querySelectorAll(":hover")].reverse().find((n) => n.matches("[data-hub]"));
    setActive(hubAt(hovered ?? null) ?? focused());
    el.addEventListener("pointerover", pick);
    el.addEventListener("focusin", pick);
    el.addEventListener("pointerleave", clear);
    el.addEventListener("focusout", blur);
    el.addEventListener("click", open);
    return () => {
      el.removeEventListener("pointerover", pick);
      el.removeEventListener("focusin", pick);
      el.removeEventListener("pointerleave", clear);
      el.removeEventListener("focusout", blur);
      el.removeEventListener("click", open);
    };
  }, [router]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    el.dataset.hovering = String(active !== null);
    el.querySelectorAll<HTMLElement | SVGElement>("[data-hub], [data-hubs]").forEach((node) => {
      const slugs = node.dataset.hubs?.split(" ") ?? [node.dataset.hub];
      node.dataset.active = String(active !== null && slugs.includes(active));
    });
  }, [active]);

  return (
    <HubsActiveContext.Provider value={{ active, setActive }}>
      <div ref={root} data-hubs-map className={className}>
        {children}
      </div>
    </HubsActiveContext.Provider>
  );
}
