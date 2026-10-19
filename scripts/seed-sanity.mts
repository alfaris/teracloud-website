// Imports the typed content in src/content into Sanity.
//
//   npm run sanity:seed               create documents that don't exist yet
//   npm run sanity:seed -- --replace  overwrite them with the local files
//   npm run sanity:seed -- --dry-run  print the documents, send nothing
//
// Needs SANITY_PROJECT_ID, SANITY_API_WRITE_TOKEN (Editor) and optionally
// SANITY_DATASET in the environment or .env.local. Document IDs are stable
// (e.g. office-copenhagen), so running it twice is safe.
import { createClient } from "@sanity/client";
import { danglingRefs, docs } from "./lib/seed-docs.mts";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const replace = args.has("--replace");

const dangling = danglingRefs();
if (dangling.length) {
  console.error(`Local content references missing documents: ${dangling.join(", ")}`);
  process.exit(1);
}

if (dryRun) {
  console.log(JSON.stringify(docs, null, 2));
  console.error(`Dry run: ${docs.length} documents, nothing sent.`);
  process.exit(0);
}

const projectId = process.env.SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Set SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN (see README), or pass --dry-run.");
  process.exit(1);
}
const dataset = process.env.SANITY_DATASET || "production";

const client = createClient({ projectId, dataset, token, apiVersion: "2025-10-01", useCdn: false });
const tx = client.transaction();
for (const d of docs) {
  if (replace) tx.createOrReplace(d);
  else tx.createIfNotExists(d);
}
const res = await tx.commit({ visibility: "async" });
console.log(`${replace ? "Replaced" : "Created missing"} documents in ${projectId}/${dataset}: ${docs.length} sent, ${res.results.length} results.`);
