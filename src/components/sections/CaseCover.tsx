import Image from "next/image";
import clsx from "clsx";
import { CaseArt, caseVisual } from "./CaseArt";
import type { CaseStudy } from "@/content/types";

// A case study's cover: the real project image when there is one, otherwise
// its brand illustration. The caller sizes the box; this fills it.
export function CaseCover({ item, sizes, preload, className }: { item: CaseStudy; sizes: string; preload?: boolean; className?: string }) {
  if (item.image) {
    return (
      <Image
        src={item.image.src}
        alt={item.image.alt}
        width={item.image.width}
        height={item.image.height}
        sizes={sizes}
        preload={preload}
        className={clsx("h-full w-full object-cover", className)}
      />
    );
  }
  return <CaseArt visual={caseVisual(item)} seed={item.art} className={clsx("h-full w-full", className)} />;
}
