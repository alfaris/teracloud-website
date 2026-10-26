"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { Hub3D } from "./HubsMap3D";

const HubsMap3D = dynamic(() => import("./HubsMap3D"), { ssr: false });

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

// Wraps the SVG map. On capable tablets and desktops it loads the three.js map
// after the page has loaded and cross-fades to it; phones, reduced-motion
// visitors and browsers without WebGL keep the SVG. Hovering or focusing a hub
// in the list beside the map highlights it in 3D.
export function HubsMapStage({ hubs, children }: { hubs: Hub3D[]; children: React.ReactNode }) {
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () =>
      setEnabled(
        !reduce.matches &&
          window.matchMedia("(min-width: 768px)").matches &&
          (navigator.hardwareConcurrency ?? 8) > 4 &&
          supportsWebGL(),
      );
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    let id = 0;
    const schedule = () => {
      id = idle(decide, { timeout: 2500 }) as number;
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    reduce.addEventListener("change", decide);
    return () => {
      reduce.removeEventListener("change", decide);
      window.removeEventListener("load", schedule);
      (window.cancelIdleCallback ?? clearTimeout)(id);
    };
  }, []);

  // The hub list lives next to the map (server-rendered); listen to it here.
  useEffect(() => {
    const root = box.current?.closest("[data-hubs-map]");
    if (!root || !enabled) return;
    const pick = (e: Event) => setActive((e.target as Element).closest<HTMLElement>("[data-hub]")?.dataset.hub ?? null);
    const clear = () => setActive(null);
    root.addEventListener("pointerover", pick);
    root.addEventListener("focusin", pick);
    root.addEventListener("pointerleave", clear);
    root.addEventListener("focusout", clear);
    return () => {
      root.removeEventListener("pointerover", pick);
      root.removeEventListener("focusin", pick);
      root.removeEventListener("pointerleave", clear);
      root.removeEventListener("focusout", clear);
    };
  }, [enabled]);

  // Mirror the 3D hover back onto the list.
  useEffect(() => {
    const root = box.current?.closest("[data-hubs-map]");
    root?.querySelectorAll<HTMLElement>("[data-hub]").forEach((el) => {
      el.dataset.active = String(el.dataset.hub === active);
    });
  }, [active]);

  return (
    <div ref={box} className="relative">
      <div className={clsx("transition-opacity duration-700", ready && "opacity-0")}>{children}</div>
      {enabled && (
        <div className={clsx("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}>
          <HubsMap3D
            hubs={hubs}
            active={active}
            onHover={setActive}
            onSelect={(slug) => router.push(`/locations/${slug}`)}
            onReady={() => setReady(true)}
          />
        </div>
      )}
    </div>
  );
}
