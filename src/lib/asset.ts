// URL of a file in public/ for plain <img> tags and similar. next/link and
// next/image add the base path themselves; anything else must go through this,
// or it breaks in the GitHub Pages build, which is served under a sub-path.
export const asset = (path: `/${string}`) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
