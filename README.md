# PulseTech Installation & Repairs — website

Static site. No framework, no build dependencies, no `npm install`.
The generator is three plain Node files and needs nothing but Node itself.

```
build/
  data.js             business facts, services, areas, FAQs, blog, media registry
  icons.js            every SVG: appliance diagrams, brand mark, UI icons
  build.js            templates + page assembly
  optimize_media.py   photo/video optimisation (needs Pillow + ffmpeg)
  qa.js               automated checks over the built output
site/                 ← deploy this folder
```

**All internal URLs are page-relative**, so the site works opened straight off
disk, served from a domain root, or served from a sub-folder. Double-click
`site/index.html` and it renders properly with no server.

## Build

```bash
python3 build/optimize_media.py   # only when photos/video change
node build/build.js               # regenerates all 19 pages, sitemap, redirects
node build/qa.js                  # links, headings, meta, schema, assets
```

`optimize_media.py` clears and rewrites `site/images/` and `site/videos/`, so
never hand-place files there. Add new photos through its `PLAN` table instead.

`/site` is fully static after a build. No server-side anything.

## The rule

**Never edit a file in `/site` directly.** It is generated output and the next
build overwrites it. Facts live in `build/data.js`, markup lives in
`build/build.js`, graphics live in `build/icons.js`.

This is the point of the refactor. Changing the phone number used to mean
editing 17 HTML files. It is now one line.

---

## Launch checklist

Work top to bottom. Items 1–3 are blocking.

### 1. Set the real domain — blocking

```js
// build/data.js
const SITE = {
  origin: "https://pulsetechrepairs.co.ke",  // ← the real domain
  domainConfirmed: true,
};
```

Then `node build/build.js`. This corrects every canonical, Open Graph URL,
JSON-LD `@id`, the sitemap and robots.txt in one pass.

Verify: `node build/qa.js` should report no `example.com`.

### 2. Connect the enquiry form — blocking

Until this is done the form validates, then tells the visitor plainly that it
isn't connected and points them at WhatsApp. It never fakes a success message.

Pick an endpoint (Formspree, Getform, or a serverless function), then:

```js
// site/js/site.js — near the top of initForm's scope
var FORM_ENDPOINT = "https://formspree.io/f/xxxxxxx";
```

Test it end to end by submitting a real enquiry and confirming it arrives at
`opticahone@gmail.com`.

### 3. Upload with redirects intact — blocking

- Upload the entire contents of `/site`.
- `_redirects` (Netlify/Cloudflare Pages) and `.htaccess` (Apache/cPanel) are
  both generated. Keep whichever your host uses. They 301 all 17 legacy
  `.html` URLs to the new clean URLs.
- On Nginx you'll need to translate `_redirects` into `rewrite` rules manually.
- Confirm `/404.html` is wired as the error document.
- Confirm HTTPS is on and HTTP redirects to it.

### 4. Confirm with Kennedy

Nine facts are marked pending in `build/data.js` and are **deliberately absent
from the live site** rather than guessed at:

- Which days of the week the business opens
- Whether repairs carry a guarantee, and for how long
- Typical response time
- Which appliance brands are serviced
- The exact street address of the Mlolongo service centre
- The Instagram @handle
- Any customer reviews that may be published, with names
- Whether a logo file exists
- **Which brands he services** — the supplied control-board photo plainly reads
  LG, so there is at least one, but a list has never been confirmed
- Photographs of a fridge, freezer, microwave, TV and AC repair — those five
  service pages are the only ones still without visual proof

Each one is a live improvement waiting on a single answer. The brand list in
particular is unused long-tail search traffic.

### 5. Add the remaining media

Seven assets are integrated. See `site/MEDIA_INVENTORY.md` for what's still
missing, why it matters, and shooting notes to pass to Kennedy.

### 6. Google

- Claim and verify the Google Business Profile. For a local repair business
  this will out-perform the website as a lead source. Name, phone, hours and
  service areas must match the site exactly.
- Verify in Search Console, submit `sitemap.xml`.
- Request indexing for the homepage and seven service pages.
- Paste the profile URL into `BUSINESS.social.googleBusinessProfile` and rebuild.

### 7. Verify in a browser

Nothing in this project was rendered in a browser — none was available in the
build environment. Before sign-off:

- PageSpeed Insights on the live URL, mobile and desktop.
- Google Rich Results Test on the homepage and one service page.
- axe DevTools or Lighthouse accessibility pass.
- Manual check at 320px, 390px, 768px, 1280px.
- Keyboard-only pass through the mega menu and the mobile drawer.
- Tap every WhatsApp button on a real phone and confirm the prefilled message.

---

## Documentation

| File | Contents |
|---|---|
| `site/SEO_AUDIT.md` | What's done, what's blocked and on whom |
| `site/DESIGN_AUDIT.md` | Design rationale and visual QA |
| `site/MEDIA_INVENTORY.md` | Every media slot and how to fill it |
