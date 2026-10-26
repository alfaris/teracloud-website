/* eslint-disable @next/next/no-img-element -- ImageResponse (Satori) renders plain <img>, not next/image */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Shared 1200×630 share image: Teracloud wordmark, an eyebrow label, a title
// and the logomark, in the brand palette and Manrope.
export const ogSize = { width: 1200, height: 630 };

const dataUri = (svg: Buffer) => `data:image/svg+xml;base64,${svg.toString("base64")}`;

export async function renderOg({ eyebrow, title, footer }: { eyebrow?: string; title: string; footer?: string }) {
  const [logo, mark, extraBold, semiBold] = await Promise.all([
    // Literal paths so the build traces exactly these files into the server bundle.
    readFile(path.join(process.cwd(), "public/brand/Teracloud_textlogo_white.svg")),
    readFile(path.join(process.cwd(), "public/brand/Teracloud_logomark_blue.svg")),
    readFile(path.join(process.cwd(), "src/fonts/og/Manrope-ExtraBold.ttf")),
    readFile(path.join(process.cwd(), "src/fonts/og/Manrope-SemiBold.ttf")),
  ]);
  const size = title.length > 60 ? 56 : title.length > 40 ? 64 : 72;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0e0e12 55%, #1f1fb0)",
          color: "white",
          fontFamily: "Manrope",
        }}
      >
        <img src={dataUri(logo)} width={350} height={40} alt="" />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 820 }}>
            {eyebrow && (
              <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#8f8ff0", marginBottom: 20 }}>
                {`{ ${eyebrow} }`}
              </div>
            )}
            <div style={{ fontSize: size, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
            {footer && <div style={{ fontSize: 26, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginTop: 24 }}>{footer}</div>}
          </div>
          <img src={dataUri(mark)} width={190} height={211} alt="" />
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Manrope", data: extraBold, weight: 800, style: "normal" },
        { name: "Manrope", data: semiBold, weight: 600, style: "normal" },
      ],
    },
  );
}
