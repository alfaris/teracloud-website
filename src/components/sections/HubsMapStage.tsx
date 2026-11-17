"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import type { Hub3D } from "./HubsMap3D";
import { useHubsActive } from "./HubsMapInteractive";

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
// visitors and browsers without WebGL keep the SVG. The highlighted hub comes
// from HubsMapInteractive, so the list, the SVG and the 3D map stay in step.
export function HubsMapStage({ hubs, children }: { hubs: Hub3D[]; children: React.ReactNode }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const { active, setActive } = useHubsActive();

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

  return (
    <div className="relative">
      <div className={clsx("transition-opacity duration-700", ready && "opacity-0")}>{children}</div>
      {enabled && (
        <div className={clsx("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "pointer-events-none opacity-0")}>
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
