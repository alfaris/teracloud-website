import type { Metadata } from "next";
import { metadata as studioMetadata, viewport as studioViewport } from "next-sanity/studio";
import { isSanityConfigured } from "@/sanity/env";
import { Studio } from "./Studio";

export const metadata: Metadata = { ...studioMetadata, title: { absolute: "Content studio · Teracloud" } };
export const viewport = studioViewport;

// Studio routes on the client, so one prerendered shell serves every /studio/* path.
export function generateStaticParams() {
  return [{ tool: [] }];
}

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 560, margin: "15vh auto", padding: 24, lineHeight: 1.5 }}>
        <h1>Content studio is not set up</h1>
        <p>
          Set <code>SANITY_PROJECT_ID</code> (and optionally <code>SANITY_DATASET</code>) and rebuild. Until then the site
          serves the content in <code>src/content</code>. See the README.
        </p>
      </main>
    );
  }
  return <Studio />;
}
