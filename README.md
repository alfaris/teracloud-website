# teracloud.com

The Teracloud ApS website. Next.js 16 (App Router, Cache Components, Partial
Prefetching) and Tailwind 4. All content lives in this repository; there is no
CMS or other outside service.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm test` | Playwright + axe against a production server on port 3020 (run `npm run build` first) |

The contact form sends mail through Resend. Copy `.env.example` to
`.env.local` and set `RESEND_API_KEY` to try it; without it the form logs to the
console in development.

## Editing content

Every page reads its content from the files in `src/content`, through
`src/lib/content.ts`. To change something, edit the file, check it with
`npm run dev`, and deploy. On GitHub this works in the browser too: open the
file, click the pencil, edit, and commit. If a field is missing or misspelled,
`npm run typecheck` and the build fail and name the file and line.

| What | File |
| --- | --- |
| Capabilities (the six service areas) | `src/content/capabilities.ts` |
| Case studies (Work) | `src/content/work.ts` |
| Offices / hubs, including map position | `src/content/offices.ts` |
| Sister companies and partners | `src/content/companies.ts` |
| News (LinkedIn posts) | `src/content/news.ts` |
| Tagline, address, email, stats, principles, benefits, hiring steps | `src/content/site.ts` → `siteSettings` |
| Site name, URL, job board, main navigation | `src/content/site.ts` → `site`, `nav` |
| Privacy policy | `src/content/legal/privacy.html` |

Job listings are not in the repo: they come live from the UKG Pro job board
(`src/lib/jobs.ts`) and refresh hourly.

Things to know:

- **Order** in each file is the order on the site. The first office is drawn as
  headquarters on the map.
- **Links between items use slugs.** A capability lists its offices and case
  studies by `slug`, and a case study names its `capability` by slug. Changing
  a slug changes that page's URL, so update anything that points at it.
- **Company logos** go in `public/logos`; the entry holds the path, e.g.
  `/logos/ibm.png`.
- **Case study artwork** is generated from the `art` number; give each case
  study a different one.

### Adding a LinkedIn post

LinkedIn has no feed the site can read without an approved developer app, so
posts are added by hand (about a minute each):

1. On LinkedIn, open the post's **…** menu → **Copy link to post**.
2. In `src/content/news.ts`, add an entry to the `news` list with that link, a
   short title, the date, a one or two sentence summary and its topics. The
   comment at the top of the file shows a complete example.
3. For a photo, add the file to `public/news/` and fill in `image` with its
   path, a description (`alt`) and its pixel size.

The three newest posts appear on the home page, and the three newest tagged
`culture` or `hiring` on Careers. Both sections stay hidden while there are no
posts.
