import { ogSize, renderOg } from "@/lib/og";

export const alt = "Teracloud — Systems engineering, from the operating system up.";
export const size = ogSize;
export const contentType = "image/png";

// A static export (GitHub Pages) only prerenders route handlers that are marked
// static, and Cache Components forbids `dynamic = "force-static"`; a single
// empty param set marks it static instead.
export async function generateStaticParams() {
  return [{}];
}

export default function Image() {
  return renderOg({ title: "Systems engineering, from the operating system up." });
}
