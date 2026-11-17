"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Component, useCallback, useEffect, useState, type ReactNode } from "react";
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

// Catches anything the 3D map throws (its code failing to download, WebGL
// failing to start) so the page keeps the SVG instead of an error.
class Fallback extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// If the 3D map has not shown within this long, keep the SVG.
const READY_TIMEOUT = 10_000;

// Wraps the SVG map. On capable tablets and desktops it loads the three.js map
// after the page has loaded and cross-fades to it; phones, reduced-motion
// visitors and browsers without WebGL keep the SVG, and so does any visitor
// whose 3D map fails to load, start or keep its WebGL context. The highlighted hub comes
// from HubsMapInteractive, so the list, the SVG and the 3D map stay in step.
export function HubsMapStage({ hubs, children }: { hubs: Hub3D[]; children: React.ReactNode }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const { active, setActive } = useHubsActive();
  const fail = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);

  useEffect(() => {
    if (!enabled || ready || failed) return;
    const t = setTimeout(fail, READY_TIMEOUT);
    return () => clearTimeout(t);
  }, [enabled, ready, failed, fail]);

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
    <div className="relative" data-map-mode={ready ? "3d" : failed ? "svg-fallback" : "svg"}>
      <div className={clsx("transition-opacity duration-700", ready && "opacity-0")}>{children}</div>
      {enabled && !failed && (
        <div className={clsx("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "pointer-events-none opacity-0")}>
          <Fallback onError={fail}>
            <HubsMap3D
              hubs={hubs}
              active={active}
              onHover={setActive}
              onSelect={(slug) => router.push(`/locations/${slug}`)}
              onReady={() => setReady(true)}
              onFail={fail}
            />
          </Fallback>
        </div>
      )}
    </div>
  );
}
