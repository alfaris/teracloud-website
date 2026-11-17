// Builds the static GitHub Pages copy of the site into out/.
//
//   PAGES_BASE_PATH=/teracloud-website npm run build:pages
//
// A static export can't use Cache Components ("PPR cannot be enabled in export
// mode"), and without Cache Components Next.js rejects its directives:
// "use cache", cacheLife(), cacheTag() and `export const instant`. In a static
// export every page is prerendered at build time, so they have nothing left to
// do. This script removes them from the source, runs the build with
// GITHUB_PAGES=true (see next.config.ts), and then puts every file back as it
// was, whether or not the build succeeded.
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const strip = (source) =>
  source
    .replace(/^\s*["']use cache["'];?[ \t]*\n/gm, "")
    .replace(/^\s*cache(?:Life|Tag)\([^)]*\);?[ \t]*\n/gm, "")
    .replace(/^import \{[^}]*\} from ["']next\/cache["'];?[ \t]*\n/gm, "")
    .replace(/^export const instant = [^;\n]+;?[ \t]*\n/gm, "");

const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p) : /\.(ts|tsx)$/.test(e.name) ? [p] : [];
  });

const originals = new Map();
for (const file of files(path.join(root, "src"))) {
  const source = readFileSync(file, "utf8");
  const stripped = strip(source);
  if (stripped !== source) originals.set(file, source);
}

const restore = () => {
  for (const [file, source] of originals) writeFileSync(file, source);
  originals.clear();
};
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    restore();
    process.exit(1);
  });
}

let status = 1;
try {
  for (const [file, source] of originals) writeFileSync(file, strip(source));
  console.log(`build-pages: removed Cache Components directives from ${originals.size} files for this build`);
  const result = spawnSync("npx", ["next", "build"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, GITHUB_PAGES: "true" },
  });
  status = result.status ?? 1;
} finally {
  restore();
}
if (status === 0) {
  // GitHub Pages runs files through Jekyll unless told not to, which would
  // drop the _next/ folder.
  writeFileSync(path.join(root, "out", ".nojekyll"), "");
}
process.exit(status);
