import { ogSize, renderOg } from "@/lib/og";

export const alt = "Teracloud — Systems engineering, from the operating system up.";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ title: "Systems engineering, from the operating system up." });
}
