# SEO audit

Build date: this file is accurate for the build that produced it. Rerun
`node build/build.js` and `node build/qa.js` after any content change.

No claim is made anywhere in this document about achieving particular Google
rankings. Nobody can promise that, and anyone who does is selling something.

---

## Complete

**Per-page fundamentals** — all 18 indexable pages plus a noindexed 404:

- Unique `<title>`, unique meta description, all descriptions now within
  155 characters after the first QA pass caught eight overruns.
- Self-referencing canonical on every page.
- Exactly one `<h1>` per page, verified programmatically.
- Logical H2/H3 nesting with no skipped levels.
- Open Graph and Twitter Card tags. `og:locale` set to `en_KE`.
- `max-image-preview:large`, which now matters: there are real photographs to
  surface in image results.
- `og:image` points at a 1200×630 share card generated from the hero photograph,
  with `og:image:alt`. Cards render with a picture on WhatsApp, Facebook and X.
- **All internal URLs are page-relative.** The previous build used root-absolute
  paths, which meant the site only worked when served from a domain root — open
  it off disk or from a sub-path and no CSS loaded at all. Fixed, and the QA
  script now resolves every link, `src`, `srcset`, `poster` and video source
  against the filesystem and fails on any that don't exist.

**Structured data** — all blocks validated as parseable JSON:

- `LocalBusiness` as a single `@id`-addressed node on the homepage, referenced
  by every other page instead of being repeated. One canonical entity rather
  than eighteen competing copies.
- `WebSite` on the homepage.
- `LocalBusiness.image` populated with the share card.
- `Service` on each of the seven service pages, `provider` pointing at the
  business `@id`.
- `BreadcrumbList` on every page below the root.
- `FAQPage` on the homepage, the FAQ page and each service page. **This did not
  exist in the previous build at all** — the FAQs were injected by JavaScript
  after load, so there was nothing to mark up.
- `Article` on both blog posts.
- `ContactPage` on the contact page.

**Content rendered server-side.** The previous build injected the service grid
and the FAQ list into empty `<div>`s with JavaScript. Google generally executes
JS, but it defers it, and the content was invisible to every other crawler and
to any user with a failed script. All of it is now static HTML at build time.

**Crawl and indexation**

- `robots.txt` clean, with the sitemap declared. The old file disallowed `/js/`
  then re-allowed all three files inside it, which is a no-op with extra steps.
- `sitemap.xml` regenerated from the page list, so it cannot drift out of sync
  with what actually exists. Includes `lastmod`.
- Clean directory URLs (`/services/fridge-repair/`).
- `_redirects` and `.htaccess` emitted with 301s from all 17 legacy `.html`
  URLs, so nothing that is already indexed 404s after launch.
- Custom 404 page, `noindex, follow`, routing visitors to the service grid.

**Local SEO**

- NAP consistent across every page, generated from one data source.
- Geography corrected. The previous build stated `addressRegion:
  "Nairobi Metropolitan Area"`, which is not an administrative region. Mlolongo
  is in **Machakos County**, and the site now says so, while making clear that
  Nairobi is the main service area.
- `areaServed` declared as four `AdministrativeArea` nodes.
- Opening hours in schema state the daily window only, because the operating
  days were never confirmed.

**Honesty controls** — these are SEO decisions, not just ethical ones. Google's
spam policies treat fabricated review markup as a manual-action risk.

- No `aggregateRating`, no `review`, no `award`, no certification claims.
- No response-time, warranty or brand claims anywhere in content or schema.
- No doorway pages. One strong coverage page instead of seventeen thin
  "fridge repair in [sub-county]" pages. Those rank briefly and then get
  filtered, and they would be trivially detectable as templated.

---

## Incomplete — blocked on the client

| Item | Blocked on | Effect while unresolved |
|---|---|---|
| `openingHours` days | Which days the business opens | Schema states the time window without days |
| Brand list | Confirmation of brands serviced | A real long-tail opportunity going unused: "Samsung fridge repair Nairobi" and similar |
| Warranty terms | Client confirmation | Missing trust signal; also a common FAQ query |
| Response time | Client confirmation | Missing trust signal |
| Instagram profile | The handle | `sameAs` cannot be populated; the eight post links have no profile to point at |
| Reviews | Genuine customer feedback | `/reviews/` is an honest empty state, and no review markup is emitted |

---

## Incomplete — blocked on the domain

**This is the launch blocker.** `SITE.origin` in `build/data.js` is still
`https://example.com`. It appears in every canonical, every Open Graph URL,
every JSON-LD `@id`, and the sitemap.

It is a **single-line fix**: set the real domain, run `node build/build.js`,
and all 19 pages plus the sitemap and robots regenerate correctly. This is
precisely why page assembly was moved to a build step. In the previous build
the same change meant hand-editing 17 files and hoping you didn't miss one.

---

## Incomplete — blocked on Google

These cannot be done from the codebase and are post-launch tasks:

1. Claim and verify the Google Business Profile. For a local repair business
   this will drive more enquiries than anything on the website itself. Name,
   phone, hours and service areas must match the site exactly.
2. Verify the property in Google Search Console and submit the sitemap.
3. Request indexing for the homepage and the seven service pages.
4. Add the Business Profile URL to `BUSINESS.social.googleBusinessProfile`,
   which will then populate `sameAs`.
5. Monitor Search Console for coverage errors in the first fortnight, when the
   legacy-URL redirects will be exercised.

---

## Keyword mapping

One page per intent cluster. No page targets a term it does not genuinely
serve, and nothing is repeated across pages, which is how sites end up
competing with themselves.

| Page | Primary intent | Supporting |
|---|---|---|
| Home | appliance repair Nairobi | appliance repair Mlolongo, appliance technician Nairobi |
| Fridge repair | fridge repair Nairobi | refrigerator repair Nairobi, fridge not cooling, fridge repair Mlolongo |
| Freezer repair | freezer repair Nairobi | chest freezer repair, freezer not freezing |
| Cooker & oven repair | cooker repair Nairobi | oven repair Nairobi, built-in cooker repair |
| Washing machine repair | washing machine repair Nairobi | washing machine not spinning, not draining |
| Microwave repair | microwave repair Nairobi | microwave not heating |
| TV repair | TV repair Nairobi | TV no picture, TV screen repair |
| AC repair | air conditioner repair Nairobi | AC servicing Nairobi, AC not cooling |
| Areas we serve | appliance repair near me | per-sub-county and per-county coverage |
| Blog: fridge not cooling | fridge not cooling | informational, funnels to fridge repair |
| Blog: not spinning | washing machine not spinning | informational, funnels to washing machine repair |

**No search-volume figures are quoted**, because no keyword research tool was
available in this environment and inventing numbers would be worse than
omitting them. Before committing spend, run these terms through Google Keyword
Planner with the location set to Kenya. Expect low absolute volumes and high
intent, which is the normal shape for a local trade.

---

## Internal linking

Verified programmatically: **zero dead internal links, zero `href="#"`** across
all 19 pages.

- Every service page links to three sibling services and to the coverage page.
- Both blog posts link to their related service.
- The mega menu exposes all seven services and all seventeen Nairobi
  sub-counties from every page.
- The footer carries the full service list site-wide.

---

## Technical performance as it affects ranking

Measured on the built files:

See the figures at the end of this document — they are re-measured on each
build. The site now carries real photographs, so the homepage is no longer
image-free, but responsive `sizes` means a phone pulls roughly 20 KB per image
rather than the full-resolution file, and everything below the fold is lazy.

The video has `preload="none"` and a WebP poster, so nothing of it downloads
until a visitor presses play.

Zero JavaScript libraries. Every icon and diagram is still inline SVG.

Layout shift is structurally prevented: every media slot has a locked
`aspect-ratio`, so reserved space exists before any asset loads.

The only third-party request is Google Fonts, preconnected and preloaded.
If you want to remove it entirely, self-host the two families in
`/images/brand/` and drop the `<link>` tags — that would take the page to zero
third-party requests.

---

## Known limitations of this audit

- No browser was available in the build environment, so Core Web Vitals were
  not measured live. The figures above are payload measurements, not Lighthouse
  scores. **Run PageSpeed Insights against the deployed URL before signing off.**
- Structured data was validated as parseable JSON with correct shape, but not
  against Google's Rich Results Test, which needs a public URL. Do this after
  the domain is live.
- No keyword volume data, for the reason given above.

---

## Measured payload (this build)

| | Raw | Gzipped |
|---|---|---|
| Homepage HTML | 50.6 KB | **9.8 KB** |
| Stylesheet | 36.7 KB | **8.4 KB** |
| JavaScript | 15.1 KB | **4.3 KB** |

About **22 KB gzipped** of code for a full homepage render, plus fonts.

Media on disk totals 1.5 MB of images and 52 KB of video, but a phone loading
the homepage requests roughly **120 KB of imagery**: the 420px hero WebP eagerly,
and six 420px gallery WebPs lazily as they scroll into view. The video poster is
7 KB; the clip itself downloads only on press.
