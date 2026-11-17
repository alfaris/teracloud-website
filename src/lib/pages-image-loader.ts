// next/image loader for the static GitHub Pages build (next.config.ts sets it
// when GITHUB_PAGES=true). Pages has no image optimizer, so images are served
// as they are; the loader only adds the base path the site is served under.
export default function pagesImageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const url = src.startsWith("/") ? `${base}${src}` : src;
  // The width parameter is ignored by Pages but keeps each srcset entry distinct.
  return `${url}?w=${width}`;
}
