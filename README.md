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
| `npm run build` / `npm run serve` | Production build, then the standalone server (as deployed) |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm test` | Playwright + axe against a production server on port 3020 (run `npm run build` first) |

The contact form sends mail through the company mail server (SMTP) or Resend;
copy `.env.example` to `.env.local` and fill in the mail settings to try it.
Without them the form logs to the console in development.

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

## Deployment (Teracloud's own server)

The site builds to a self-contained Node.js server (`output: "standalone"`).
Put nginx (or another reverse proxy) in front of it for TLS, `www` → apex and
caching of build assets. Ready-made files are in `deploy/`.

### With Docker (recommended)

```bash
docker build -t teracloud-web \
  --build-arg NEXT_PUBLIC_PLAUSIBLE_DOMAIN=teracloud.com .
docker run -d --name teracloud-web --restart unless-stopped \
  -p 127.0.0.1:3000:3000 --env-file /etc/teracloud-web.env \
  -v teracloud-web-cache:/app/.next/cache teracloud-web
```

### Without Docker (systemd)

```bash
npm ci && npm run build
cp -r .next/standalone/. /srv/teracloud-web/
cp -r .next/static /srv/teracloud-web/.next/static
cp -r public /srv/teracloud-web/public
sudo systemctl restart teracloud-web   # unit file: deploy/teracloud-web.service
```

Then install `deploy/nginx.conf` (set the certificate paths) and point the
`teracloud.com` and `www.teracloud.com` DNS records at the server.

### Configuration

All settings are environment variables; see `.env.example`.

| Setting | When | Purpose |
| --- | --- | --- |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | runtime | Contact form email through the company mail server |
| `CONTACT_TO`, `CONTACT_TO_PARTNERSHIP` / `_CAREERS` / `_GENERAL` | runtime | Where contact messages go |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_PLAUSIBLE_SRC` | build | Cookieless analytics (also opens the CSP for its script) |

Analytics goals recorded automatically: `Partner CTA`, `Careers CTA`,
`Apply click`, `LinkedIn click` and `Contact submit` (with the topic).

Jobs refresh from the UKG board every hour; the page cache lives in
`.next/cache`, so keep it on a volume to survive restarts. One instance is
enough for this site; running several needs a shared cache handler (see the
Next.js self-hosting guide).

### Security headers

`next.config.ts` sends a Content-Security-Policy without nonces (pages are
prerendered), plus HSTS, `X-Frame-Options`, `Referrer-Policy` and
`Permissions-Policy`. If you add a third-party script, add its origin to the CSP.

