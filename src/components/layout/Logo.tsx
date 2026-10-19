/* eslint-disable @next/next/no-img-element -- brand SVGs are served as-is, never re-rendered */
import clsx from "clsx";

// Approved brand files only (Brand-guidelines/Teracloud_logos). Never redraw.
export function Logo({ tone = "blue", className }: { tone?: "blue" | "white"; className?: string }) {
  return (
    <img
      src={`/brand/Teracloud_textlogo_${tone}.svg`}
      alt="Teracloud"
      width={1064}
      height={122}
      className={clsx("h-5 w-auto sm:h-6", className)}
    />
  );
}
