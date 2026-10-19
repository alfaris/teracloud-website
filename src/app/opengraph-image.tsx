import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Teracloud — Systems engineering, from the operating system up.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(path.join(process.cwd(), "public/brand/Teracloud_textlogo_white.svg"), "utf8");
  const mark = await readFile(path.join(process.cwd(), "public/brand/Teracloud_logomark_blue.svg"), "utf8");
  const src = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg, #0e0e12 55%, #1f1fb0)", color: "white", fontFamily: "sans-serif" }}>
        <img src={src(logo)} width={350} height={40} alt="" />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 760 }}>Systems engineering, from the operating system up.</div>
          <img src={src(mark)} width={210} height={233} alt="" />
        </div>
      </div>
    ),
    size,
  );
}
