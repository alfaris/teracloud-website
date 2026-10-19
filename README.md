# teracloud.com

The Teracloud ApS website. Next.js 16 (App Router, Cache Components, Partial
Prefetching), Tailwind 4, content in Sanity with a local fallback.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without any environment variables the site runs
entirely from the typed files in `src/content`.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm test` | Playwright + axe against a production server on port 3020 (run `npm run build` first) |
| `npm run sanity:seed` | Import `src/content` into Sanity (see below) |
| `npm run sanity:mock` | Local stand-in for the Sanity API, for testing the Sanity code path |

## Content (Sanity)

Capabilities, case studies, offices, sister companies and partners, and the
company-wide copy (tagline, address, stats, principles, benefits, hiring steps)
are edited in Sanity Studio at **`/studio`**. Job listings are not: they come
from the UKG Pro job board (`src/lib/jobs.ts`).

How it fits together:

- `src/lib/content.ts` is the only way pages read content. Each function is a
  `'use cache'` function tagged with its Sanity document type (`capability`,
  `caseStudy`, `office`, `company`, `siteSettings`).
- If `SANITY_PROJECT_ID` is **unset**, those functions return the files in
  `src/content` instead. Those files are also what the seed script imports.
- When an editor publishes, a Sanity webhook calls `/api/revalidate`, which
  expires that document type's cache tag. The next visit renders the new
  content. Cached content also refreshes hourly in case a webhook is missed.
- Schemas live in `src/sanity/schemaTypes`, the Studio config in
  `sanity.config.ts`. Site identity that code relies on (name, URL, job board
  URL) and the main navigation stay in `src/content/site.ts`.

### Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `SANITY_PROJECT_ID` | build + runtime | Turns Sanity on. Unset means local files. Not secret. |
| `SANITY_DATASET` | build + runtime | Dataset name. Defaults to `production`. |
| `SANITY_REVALIDATE_SECRET` | runtime | Shared secret the publish webhook signs with. Without it `/api/revalidate` refuses every request. |
| `SANITY_API_WRITE_TOKEN` | your machine only | Editor token for `npm run sanity:seed`. Don't set it in the deployed environment. |
| `SANITY_API_HOST` | tests only | Points the site at another API host, e.g. the local mock. |

Copy `.env.example` to `.env.local` for local work. The Studio reads the
project ID and dataset in the browser, so they are baked in at build time:
**rebuild after changing them**.

### One-time setup

1. **Create the project.** At [sanity.io/manage](https://www.sanity.io/manage),
   create a project (it needs your own Sanity account) with a `production`
   dataset. Copy the project ID into `SANITY_PROJECT_ID`.
2. **Allow the Studio's origins.** Project → API → CORS origins: add
   `http://localhost:3000` and `https://teracloud.com` (plus any preview
   domain), each with **Allow credentials** ticked.
3. **Import the current content.** Project → API → Tokens: create a token with
   **Editor** rights, put it in `.env.local` as `SANITY_API_WRITE_TOKEN`, then:

   ```bash
   npm run sanity:seed -- --dry-run   # look at what will be sent
   npm run sanity:seed                # create the documents
   ```

   The seed only creates documents that don't exist yet, so it never
   overwrites edits made in the Studio. `--replace` overwrites them with the
   local files. Delete the token afterwards if you don't need it again.
4. **Add the publish webhook.** Project → API → Webhooks → Create:
   - URL: `https://teracloud.com/api/revalidate`
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - Filter: `_type in ["capability", "caseStudy", "office", "company", "siteSettings"]`
   - Projection: `{_type}`
   - HTTP method: POST, API version: `v2025-10-01`
   - Secret: a long random string, also set as `SANITY_REVALIDATE_SECRET` in
     the deployment.
5. **Deploy** with `SANITY_PROJECT_ID`, `SANITY_DATASET` and
   `SANITY_REVALIDATE_SECRET` set, then open `/studio` and sign in.

To go back to the local files, unset `SANITY_PROJECT_ID` and rebuild.

### Notes for editors

- **Order** sets an item's position in lists on the site, lowest first. The
  first office in order is drawn as headquarters on the map.
- **Company logos** are files in `public/logos`. A new logo needs a developer
  to add the file; the Studio field holds its path (`/logos/name.png`).
- **Case study artwork** is generated from the "Artwork variant" number; give
  each case study a different one.
- Changing a **slug** changes the page URL and breaks existing links to it.

### Testing the Sanity path without a project

`npm run sanity:mock` serves the seed documents through the real GROQ queries
(using `groq-js`) on port 4545:

```bash
npm run sanity:mock
```

Then, in another terminal:

```bash
SANITY_PROJECT_ID=mock SANITY_API_HOST=http://127.0.0.1:4545 npm run build && SANITY_PROJECT_ID=mock SANITY_API_HOST=http://127.0.0.1:4545 SANITY_REVALIDATE_SECRET=test npm test
```

`POST /__mock/patch` with `{"_id": "siteSettings", "set": {"tagline": "…"}}`
edits a document in memory, to try the webhook by hand.
