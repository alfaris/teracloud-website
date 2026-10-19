"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

// Server and no-JS render the final value; the count-up is enhancement only.
export function CountUp({ value, suffix = "", from }: { value: number; suffix?: string; from?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const start = from ?? (value > 1000 ? value - 20 : 0);

  // Park the number at its start until it scrolls into view.
  useEffect(() => {
    if (reduce || !ref.current) return;
    if (!inView) {
      ref.current.textContent = `${start}${suffix}`;
      return;
    }
    const node = ref.current;
    const controls = animate(start, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, start, value, suffix]);

  return (
    <>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span ref={ref} aria-hidden>
        {value}
        {suffix}
      </span>
    </>
  );
}
