"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import clsx from "clsx";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

// Loads the three.js scene only after first paint, and only when the visitor
// hasn't asked for reduced motion and the device can render WebGL.
export function HeroCanvas() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Tablets and up get the 3D scene; phones and low-core devices keep the
    // static poster, where WebGL would cost battery and main-thread time.
    const capable = () =>
      window.matchMedia("(min-width: 768px)").matches && (navigator.hardwareConcurrency ?? 8) > 4;
    const decide = () => setEnabled(!mq.matches && capable() && supportsWebGL());
    // Start only after the page has loaded and the main thread is idle.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    let id = 0;
    const schedule = () => {
      id = idle(decide, { timeout: 2500 }) as number;
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    mq.addEventListener("change", decide);
    return () => {
      mq.removeEventListener("change", decide);
      window.removeEventListener("load", schedule);
      (window.cancelIdleCallback ?? clearTimeout)(id);
    };
  }, []);

  return (
    <>
      <HeroPoster hidden={ready} />
      {enabled && (
        <div className={clsx("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}>
          <HeroScene onReady={() => setReady(true)} />
        </div>
      )}
    </>
  );
}

/* Static fallback: the logomark with a soft glow. Shown before the scene is ready,
   and permanently under reduced motion or without WebGL. */
function HeroPoster({ hidden }: { hidden: boolean }) {
  return (
    <div
      aria-hidden
      className={clsx(
        "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-1000",
        hidden && "opacity-0",
      )}
    >
      <div className="relative">
        <div className="absolute inset-[-30%] rounded-full bg-blue/40 blur-[90px]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/Teracloud_logomark_blue.svg" alt="" width={262} height={291} className="relative h-56 w-auto opacity-90 sm:h-72" />
      </div>
    </div>
  );
}
