/* ============================================================
   PULSETECH — STATIC SITE GENERATOR
   ------------------------------------------------------------
   Output is plain static HTML with no runtime dependency on
   this script. Deploy /site as-is.

   Run:  node build/build.js
   ============================================================ */

const fs = require("fs");
const path = require("path");
const D = require("./data");
const I = require("./icons");

const { SITE, BUSINESS: B, SERVICES, PROCESS, COVERAGE, NAIROBI_SUBCOUNTIES, FAQS, WORK_LINKS_ONLY, MEDIA, GALLERY, VIDEO, BLOG } = D;

const OUT = path.join(__dirname, "..", "site");
const esc = (str) => String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (p) => SITE.origin.replace(/\/$/, "") + p;
const wa = (msg) => `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(msg)}`;
const tel = `tel:${B.phone}`;

const THERM_VAR = { cold: "var(--cold)", heat: "var(--element)", water: "var(--water)", electronic: "var(--electronic)" };
const THERM_WORD = { cold: "Sealed-system work", heat: "Element and ignition work", water: "Water and drainage work", electronic: "Electronics work" };

const publishedFaqs = FAQS.filter((f) => f.confirmed);

/* Photographs are mapped to the service they actually show. The other
   five services have no supplied photograph and keep a drawn diagram,
   because putting a washing machine picture on the fridge page would
   be a lie told in pictures. */
const SERVICE_PHOTO = {
  "cooker-repair": MEDIA.cookerPhoto,
  "washing-machine-repair": MEDIA.washerPhoto,
};
const SERVICE_PHOTO_CAPTION = {
  "cooker-repair": "Burner assembly out, every connection tested before the top goes back.",
  "washing-machine-repair": "Front-loader stripped down on site — door seal and drum assembly removed.",
};

/* ============================================================
   SHARED SCHEMA
   ============================================================ */
const localBusinessNode = {
  "@type": "LocalBusiness",
  "@id": abs("/#business"),
  name: B.name,
  description: B.description,
  telephone: B.phone,
  email: B.email,
  url: abs("/"),
  image: abs("/images/og/pulsetech-share-card.jpg"),
  address: {
    "@type": "PostalAddress",
    addressLocality: B.locality,
    addressRegion: B.region,
    addressCountry: B.country,
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Nairobi County" },
    { "@type": "AdministrativeArea", name: "Machakos County" },
    { "@type": "AdministrativeArea", name: "Kajiado County" },
    { "@type": "AdministrativeArea", name: "Kiambu County" },
  ],
  // Opening days are unconfirmed, so only the daily window is stated.
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", opens: B.hoursOpen, closes: B.hoursClose },
  ],
  makesOffer: SERVICES.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.name, url: abs(`/services/${s.slug}/`) },
  })),
  // No aggregateRating, no review, no award: none have been supplied.
};

function jsonld(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

/* ============================================================
   HEAD
   ============================================================ */
function head({ title, description, url, schema = [], accent }) {
  const og = MEDIA.ogDefault && MEDIA.ogDefault.file ? abs(MEDIA.ogDefault.file) : null;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${abs(url)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#0D1A21">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(B.name)}">
<meta property="og:locale" content="en_KE">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(url)}">
${og ? `<meta property="og:image" content="${og}">\n<meta property="og:image:alt" content="${esc(MEDIA.ogDefault.alt)}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">` : ""}
<meta name="twitter:card" content="${og ? "summary_large_image" : "summary"}">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/css/styles.css">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${schema.map(jsonld).join("\n")}
<script>document.documentElement.classList.add('js');</script>
</head>
<body${accent ? ` style="--accent:${accent}"` : ""}>
<a class="skip-link" href="#main">Skip to content</a>`;
}

/* ============================================================
   MASTHEAD + NAV
   ============================================================ */
function serviceMenuItems() {
  return SERVICES.map(
    (s) => `<li><a class="drop__item" href="/services/${s.slug}/">
      <span class="therm therm--${s.thermal}"></span>${esc(s.nav)}</a></li>`
  ).join("\n");
}

function masthead(current) {
  const on = (p) => (current === p ? ' aria-current="page"' : "");
  return `<header class="masthead">
  <div class="masthead__bar">
    <a class="mark" href="/">
      ${I.brandMark}
      <span class="mark__text">
        <span class="mark__name">PulseTech</span>
        <span class="mark__sub">Installation &amp; Repairs</span>
      </span>
    </a>

    <nav class="nav" aria-label="Primary">
      <ul>
        <li><a class="nav__link" href="/"${on("home")}>Home</a></li>
        <li>
          <button class="nav__link" type="button" data-drop-trigger aria-expanded="false" aria-controls="drop-services">
            Services <span class="nav__chev">${I.ui.chevron}</span>
          </button>
          <div class="drop drop--mega" id="drop-services" data-drop>
            <div class="drop__grid">
              <div class="drop__col">
                <h4>What we repair</h4>
                <ul class="drop__list">${serviceMenuItems()}</ul>
              </div>
              <div class="drop__col">
                <h4>Colour key</h4>
                <ul class="drop__areas" style="columns:1">
                  <li><span class="therm therm--cold"></span> Sealed systems and refrigerant</li>
                  <li><span class="therm therm--heat"></span> Elements and ignition</li>
                  <li><span class="therm therm--water"></span> Pumps and drainage</li>
                  <li><span class="therm therm--electronic"></span> Boards and panels</li>
                </ul>
                <p style="margin-top:16px"><a class="pull" href="/services/">All services</a></p>
              </div>
            </div>
          </div>
        </li>
        <li>
          <button class="nav__link" type="button" data-drop-trigger aria-expanded="false" aria-controls="drop-areas">
            Areas <span class="nav__chev">${I.ui.chevron}</span>
          </button>
          <div class="drop drop--mega" id="drop-areas" data-drop>
            <div class="drop__grid">
              <div class="drop__col">
                <h4>Nairobi sub-counties</h4>
                <ul class="drop__areas">${NAIROBI_SUBCOUNTIES.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
              </div>
              <div class="drop__col">
                <h4>Counties</h4>
                <ul class="drop__areas" style="columns:1">
                  <li>Machakos — including Mlolongo</li>
                  <li>Nairobi</li>
                  <li>Kajiado</li>
                  <li>Kiambu</li>
                </ul>
                <p style="margin-top:16px"><a class="pull" href="/areas-we-serve/">Full coverage</a></p>
              </div>
            </div>
          </div>
        </li>
        <li><a class="nav__link" href="/work/"${on("work")}>Work</a></li>
        <li><a class="nav__link" href="/about/"${on("about")}>About</a></li>
        <li><a class="nav__link" href="/blog/"${on("blog")}>Guides</a></li>
        <li><a class="nav__link" href="/faq/"${on("faq")}>FAQ</a></li>
        <li><a class="nav__link" href="/contact/"${on("contact")}>Contact</a></li>
      </ul>
    </nav>

    <div class="masthead__cta">
      <a class="btn btn--small btn--line" href="${tel}">${I.ui.phone}<span>${esc(B.phoneDisplay)}</span></a>
      <a class="btn btn--small btn--live" href="${wa("Hi PulseTech, I'd like to book an appliance repair.")}">${I.ui.whatsapp}<span>WhatsApp</span></a>
    </div>

    <button class="burger" type="button" data-drawer-open aria-expanded="false" aria-controls="drawer">
      ${I.ui.menu}<span>Menu</span>
    </button>
  </div>
</header>

<div class="drawer" id="drawer" data-drawer hidden>
  <div class="drawer__top">
    <span class="mark__name" style="color:#fff">PulseTech</span>
    <button class="drawer__close" type="button" data-drawer-close>Close</button>
  </div>
  <div class="drawer__body">
    <ul class="drawer__list">
      <li><a class="drawer__link" href="/">Home</a></li>
      <li>
        <button class="drawer__fold" type="button" data-fold aria-expanded="false" aria-controls="fold-services">
          Services ${I.ui.chevron}
        </button>
        <div class="drawer__panel" id="fold-services" data-fold-panel>
          <ul>
            ${SERVICES.map((s) => `<li><a href="/services/${s.slug}/"><span class="therm therm--${s.thermal}"></span>${esc(s.nav)}</a></li>`).join("")}
            <li><a href="/services/">All services</a></li>
          </ul>
        </div>
      </li>
      <li>
        <button class="drawer__fold" type="button" data-fold aria-expanded="false" aria-controls="fold-areas">
          Areas ${I.ui.chevron}
        </button>
        <div class="drawer__panel" id="fold-areas" data-fold-panel>
          <ul>
            ${COVERAGE.map((c) => `<li><a href="/areas-we-serve/">${esc(c.name)}</a></li>`).join("")}
          </ul>
        </div>
      </li>
      <li><a class="drawer__link" href="/work/">Work</a></li>
      <li><a class="drawer__link" href="/about/">About</a></li>
      <li><a class="drawer__link" href="/blog/">Repair guides</a></li>
      <li><a class="drawer__link" href="/faq/">FAQ</a></li>
      <li><a class="drawer__link" href="/contact/">Contact</a></li>
    </ul>
    <div class="drawer__actions">
      <a class="btn btn--live btn--wide" href="${wa("Hi PulseTech, I'd like to book an appliance repair.")}">${I.ui.whatsapp}<span>WhatsApp a technician</span></a>
      <a class="btn btn--line btn--wide" href="${tel}">${I.ui.phone}<span>Call ${esc(B.phoneDisplay)}</span></a>
    </div>
  </div>
</div>`;
}

/* ============================================================
   FOOTER, DOCK, FLOATING WHATSAPP
   ============================================================ */
function footer() {
  const year = new Date().getFullYear();
  return `<footer class="foot">
  <div class="shell">
    <div class="foot__cta">
      <div>
        <h2>Tell us what it's doing.</h2>
        <p>Send the appliance, the fault and your area. We'll tell you whether it's worth fixing before anyone comes out.</p>
      </div>
      <div class="btn-row">
        <a class="btn btn--live" href="${wa("Hi PulseTech, I'd like to book an appliance repair.")}">${I.ui.whatsapp}<span>WhatsApp us</span></a>
        <a class="btn btn--line" href="${tel}">${I.ui.phone}<span>Call</span></a>
      </div>
    </div>

    <div class="foot__grid">
      <div class="foot__about">
        <h4>${esc(B.name)}</h4>
        <p>Appliance and electronics repair. Based in Mlolongo, working across Nairobi and the counties around it.</p>
      </div>
      <div>
        <h4>Repairs</h4>
        <ul>${SERVICES.map((s) => `<li><a href="/services/${s.slug}/">${esc(s.shortName)}</a></li>`).join("")}</ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="/about/">About</a></li>
          <li><a href="/work/">Our work</a></li>
          <li><a href="/areas-we-serve/">Areas we serve</a></li>
          <li><a href="/blog/">Repair guides</a></li>
          <li><a href="/faq/">FAQ</a></li>
          <li><a href="/reviews/">Reviews</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li><a href="${tel}">${esc(B.phoneDisplay)}</a></li>
          <li><a href="${wa("Hi PulseTech, I'd like to book an appliance repair.")}">WhatsApp</a></li>
          <li><a href="mailto:${B.email}">${esc(B.email)}</a></li>
          <li>${esc(B.addressDisplay)}</li>
          <li>${esc(B.hoursDisplay)}</li>
        </ul>
      </div>
    </div>

    <div class="foot__bottom">
      <span>&copy; ${year} ${esc(B.name)}</span>
      <span>Checking fee ${esc(B.checkingFee)} &middot; Home visits and service-centre drop-off</span>
    </div>
  </div>
</footer>`;
}

function dock(waMsg) {
  return `<nav class="dock" aria-label="Quick contact">
  <a href="${tel}">${I.ui.phone}<span>Call</span></a>
  <a class="dock--live" href="${wa(waMsg)}">${I.ui.whatsapp}<span>WhatsApp</span></a>
  <a href="/contact/">${I.ui.calendar}<span>Book</span></a>
</nav>`;
}

function waFloat(waMsg) {
  return `<a class="wa-float" href="${wa(waMsg)}" data-wa-float>${I.ui.whatsapp}<span>WhatsApp us</span></a>`;
}

function foot(waMsg = "Hi PulseTech, I'd like to book an appliance repair.", withLightbox = false) {
  const limit = typeof withLightbox === "number" ? withLightbox : GALLERY.length;
  return `${footer()}
${withLightbox ? lightboxMarkup(limit) : ""}
${waFloat(waMsg)}
${dock(waMsg)}
<script src="/js/site.js" defer></script>
</body>
</html>`;
}

/* ============================================================
   REUSABLE BLOCKS
   ============================================================ */
function faqBlock(items) {
  return `<div class="faq">
${items.map((f) => `  <details>
    <summary>${esc(f.q)}</summary>
    <div class="faq__answer"><p>${esc(f.a)}</p></div>
  </details>`).join("\n")}
</div>`;
}

function faqSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function crumbs(trail) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>
${trail.map((t, i) => `<li>${i === trail.length - 1 ? esc(t.name) : `<a href="${t.url}">${esc(t.name)}</a>`}</li>`).join("")}
</ol></nav>`;
}

function crumbSchema(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(t.url),
    })),
  };
}

/* ------------------------------------------------------------
   PICTURE
   WebP srcset with a JPEG fallback, explicit dimensions, and an
   aspect-ratio box so nothing moves while it loads.
   ------------------------------------------------------------ */
function picture(m, { sizes = "100vw", priority = false } = {}) {
  const srcset = m.widths.map((w) => `${m.stem}-${w}.webp ${w}w`).join(", ");
  return `<picture>
  <source type="image/webp" srcset="${srcset}" sizes="${sizes}">
  <img src="${m.stem}-${m.fallback}.jpg" alt="${esc(m.alt)}"
       width="${m.w}" height="${m.h}"
       ${priority ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}>
</picture>`;
}

/* A framed media panel. Takes a real photograph when one exists
   for the slot, and a drawn diagram when one does not. */
function frame(media, drawn, { ratio = "4 / 3", caption = "", priority = false, sizes = "100vw" } = {}) {
  const body = media
    ? picture(media, { sizes, priority })
    : `<div class="frame__drawn">${drawn}</div>`;
  return `<figure class="frame${media ? " frame--photo" : ""}" style="--frame-ratio:${ratio}">
  ${body}
  ${caption ? `<figcaption class="frame__caption">${esc(caption)}</figcaption>` : ""}
</figure>`;
}

function processBlock() {
  return `<div class="steps">
${PROCESS.map((p, i) => `  <div class="step">
    <div class="step__n">Step ${i + 1}</div>
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.body)}</p>
  </div>`).join("\n")}
</div>`;
}

function bento(services) {
  return `<div class="bento">
${services.map((s) => `  <a class="tile tile--${s.weight} tile--${s.thermal}" href="/services/${s.slug}/">
    <span class="tile__art">${I.appliance[s.icon]}</span>
    <h3>${esc(s.shortName)}</h3>
    <p>${esc(s.summary)}</p>
    <span class="tile__go">${esc(THERM_WORD[s.thermal])}</span>
  </a>`).join("\n")}
</div>
<div class="legend">
  <span><i class="therm therm--cold"></i> Sealed systems and refrigerant</span>
  <span><i class="therm therm--heat"></i> Elements and ignition</span>
  <span><i class="therm therm--water"></i> Pumps and drainage</span>
  <span><i class="therm therm--electronic"></i> Boards and panels</span>
</div>`;
}

function gallery({ limit = GALLERY.length } = {}) {
  const items = GALLERY.slice(0, limit);
  return `<ul class="gallery" data-gallery>
${items.map((g, i) => `  <li class="gallery__cell">
    <button class="gallery__open" type="button" data-lightbox="${i}"
            aria-label="Open larger view: ${esc(g.caption)}">
      ${picture(g, { sizes: "(min-width: 1060px) 31vw, (min-width: 700px) 46vw, 92vw" })}
      <span class="gallery__meta">
        <span class="gallery__appliance"><i class="therm therm--${g.thermal}"></i>${esc(g.appliance)}</span>
        <span class="gallery__zoom">${I.ui.image}</span>
      </span>
    </button>
  </li>`).join("\n")}
</ul>`;
}

function videoPanel() {
  return `<figure class="videoblock">
  <div class="videoblock__stage">
    <video class="videoblock__media"
      poster="${VIDEO.poster}" width="${VIDEO.w}" height="${VIDEO.h}"
      muted loop playsinline preload="none"
      aria-label="${esc(VIDEO.alt)}"
      data-lazy-video data-src="${VIDEO.mp4}"></video>
    <button class="videoblock__play" type="button" data-video-play aria-label="Play the repaired hob clip">
      ${I.ui.play}<span>Play</span>
    </button>
  </div>
  <figcaption class="videoblock__caption">
    <strong>Tested before we leave.</strong>
    <span>${esc(VIDEO.caption)}</span>
    <a class="pull" href="${VIDEO.post}" target="_blank" rel="noopener noreferrer">See the original post</a>
  </figcaption>
</figure>`;
}

function lightboxMarkup(limit = GALLERY.length) {
  return `<dialog class="lightbox" data-lightbox-dialog aria-label="Repair photographs">
  <div class="lightbox__stage"><img class="lightbox__img" data-lightbox-img alt=""></div>
  <div class="lightbox__bar">
    <p class="lightbox__caption" data-lightbox-caption></p>
    <div class="lightbox__controls">
      <button class="lightbox__btn" type="button" data-lightbox-prev aria-label="Previous photograph">&#8592;</button>
      <span class="lightbox__count" data-lightbox-count></span>
      <button class="lightbox__btn" type="button" data-lightbox-next aria-label="Next photograph">&#8594;</button>
      <a class="lightbox__btn" data-lightbox-post target="_blank" rel="noopener noreferrer">Instagram</a>
      <button class="lightbox__btn lightbox__btn--close" type="button" data-lightbox-close>Close</button>
    </div>
  </div>
</dialog>
<script type="application/json" data-gallery-data>${JSON.stringify(
  GALLERY.slice(0, limit).map((g) => ({ src: `${g.stem}-${g.fallback}.jpg`, alt: g.alt, caption: g.caption, post: g.post }))
)}</script>`;
}

function extraPosts() {
  return `<div class="postlinks">
  <p>Two further jobs are published on Instagram, without photographs supplied for the site:</p>
  <div class="btn-row">
${WORK_LINKS_ONLY.map((u, i) => `    <a class="btn btn--small btn--line" href="${u}" target="_blank" rel="noopener noreferrer">Instagram job ${i + 1}</a>`).join("\n")}
  </div>
</div>`;
}

/* ============================================================
   PAGES
   ============================================================ */
const pages = [];
const add = (url, html, sitemap = { priority: "0.7", changefreq: "monthly" }) =>
  pages.push({ url, html, sitemap });

/* ---------------------------- HOME ---------------------------- */
{
  const url = "/";
  const title = `Appliance Repair in Nairobi &amp; Mlolongo | ${B.name}`;
  const description =
    "Fridge, freezer, cooker, washing machine, microwave, TV and AC repair across Nairobi and Mlolongo. Ten years on the tools. KSh 1,000 to diagnose.";

  const html = head({
    title: "Appliance Repair in Nairobi & Mlolongo | PulseTech Installation & Repairs",
    description,
    url,
    schema: [
      { "@context": "https://schema.org", "@graph": [
        localBusinessNode,
        { "@type": "WebSite", "@id": abs("/#website"), name: B.name, url: abs("/"), publisher: { "@id": abs("/#business") } },
      ]},
      faqSchema(publishedFaqs.slice(0, 5)),
    ],
  }) + masthead("home") + `
<main id="main">

<section class="hero">
  <div class="hero__inner">
    <div class="reveal">
      <p class="hero__standfirst">${I.ui.pin}<span>Mlolongo service centre &mdash; <b>ten years</b> on the tools</span></p>
      <h1>When the fridge goes quiet, <em>we know where to look.</em></h1>
      <p class="hero__lede">Fridges, freezers, cookers, washing machines, microwaves, TVs and air conditioners. We come to you across Nairobi, or you bring it to us in Mlolongo.</p>
      <div class="btn-row">
        <a class="btn btn--live" href="${wa("Hi PulseTech, I'd like to book an appliance repair.")}">${I.ui.whatsapp}<span>WhatsApp a technician</span></a>
        <a class="btn btn--line" href="${tel}">${I.ui.phone}<span>Call ${esc(B.phoneDisplay)}</span></a>
      </div>
      <div class="hero__proof">
        <span>${I.ui.check}Diagnosis ${esc(B.checkingFee)}</span>
        <span>${I.ui.check}Price before work starts</span>
        <span>${I.ui.check}Home visit or drop-off</span>
      </div>
    </div>
    <div class="reveal">
      ${frame(MEDIA.heroPhoto, null, { ratio: "1080 / 1210", priority: true, sizes: "(min-width: 1000px) 46vw, 92vw", caption: "Rewiring a cooker's burner assembly on a call-out in Nairobi." })}
    </div>
  </div>
</section>

<section class="bay bay--tight">
  <div class="shell">
    <div class="trust">
      <div class="trust__cell">
        <div class="trust__figure">10</div>
        <div class="trust__label">Years repairing appliances</div>
        <p>Domestic and light commercial, across the full range of household appliances.</p>
      </div>
      <div class="trust__cell">
        <div class="trust__figure">KSh 1,000</div>
        <div class="trust__label">To diagnose the fault</div>
        <p>One flat checking fee. The repair price comes after, and you decide.</p>
      </div>
      <div class="trust__cell">
        <div class="trust__figure">2</div>
        <div class="trust__label">Ways to get it fixed</div>
        <p>A technician at your door, or the appliance on our bench in Mlolongo.</p>
      </div>
      <div class="trust__cell">
        <div class="trust__figure">4</div>
        <div class="trust__label">Counties covered</div>
        <p>Nairobi, Machakos, Kajiado and Kiambu &mdash; message us to confirm your area.</p>
      </div>
    </div>
  </div>
</section>

<section class="bay bay--dim">
  <div class="shell">
    <div class="bay-head bay-head--split reveal">
      <div>
        <h2>We fix what matters.</h2>
      </div>
      <div>
        <p>Colour tells you what kind of work the appliance needs: cooling circuits, heating elements, water systems or electronics.</p>
      </div>
    </div>
    ${bento(SERVICES)}
  </div>
</section>

<section class="bay bay--dark">
  <div class="shell">
    <div class="bay-head reveal">
      <h2>See the work.</h2>
      <p>Real repairs, posted by the workshop as they happen. These open on Instagram &mdash; we don't load embeds onto the page, because it would slow this site down for everyone.</p>
    </div>
    ${gallery({ limit: 6 })}
    <div class="worksplit">
      ${videoPanel()}
      <div class="worksplit__aside">
        <h3>What you're looking at</h3>
        <p>Six jobs, photographed on site and at the bench. Open any of them to see it full size. No stock photography appears anywhere on this website.</p>
        ${extraPosts()}
        <a class="btn btn--line" href="/work/">All of the work</a>
      </div>
    </div>
  </div>
</section>

<section class="bay">
  <div class="shell">
    <div class="bay-head reveal">
      <h2>How a repair goes.</h2>
      <p>Five steps, no surprises in the middle.</p>
    </div>
    ${processBlock()}
  </div>
</section>

<section class="bay bay--dim">
  <div class="shell">
    <div class="duo">
      <div class="reveal">
        <h2>Based in Mlolongo. Working across Nairobi.</h2>
        <p>Mlolongo sits in Machakos County, just off Mombasa Road, which puts the eastern and southern sub-counties of Nairobi within an easy run. We cover the whole city for home visits, and reach into Machakos, Kajiado and Kiambu.</p>
        <p><a class="pull" href="/areas-we-serve/">See the full coverage map</a></p>
        <ul class="subareas">
          ${NAIROBI_SUBCOUNTIES.slice(0, 9).map((a) => `<li><span>${esc(a)}</span></li>`).join("")}
          <li><span>+ ${NAIROBI_SUBCOUNTIES.length - 9} more</span></li>
        </ul>
      </div>
      <div class="reveal">${frame(null, I.coverageMap, { ratio: "640 / 460" })}</div>
    </div>
  </div>
</section>

<section class="bay">
  <div class="shell">
    <div class="bay-head reveal">
      <h2>Questions people ask first.</h2>
    </div>
    ${faqBlock(publishedFaqs.slice(0, 5))}
    <p style="margin-top:26px"><a class="pull" href="/faq/">All questions</a></p>
  </div>
</section>

</main>` + foot(undefined, true);

  add(url, html, { priority: "1.0", changefreq: "weekly" });
}

/* ---------------------- SERVICES INDEX ------------------------ */
{
  const url = "/services/";
  const trail = [{ name: "Home", url: "/" }, { name: "Services", url }];
  const html = head({
    title: "Appliance Repair Services in Nairobi | PulseTech",
    description:
      "Fridge, freezer, cooker and oven, washing machine, microwave, TV and air conditioner repair. Home visits across Nairobi, or drop off at our Mlolongo service centre.",
    url,
    schema: [crumbSchema(trail)],
  }) + masthead("services") + `
<main id="main">
<section class="masthead-page">
  <div class="shell">
    ${crumbs(trail)}
    <h1>What we repair</h1>
    <p class="lede">Seven appliance categories, all confirmed as work PulseTech actually takes on. If yours isn't listed, ask &mdash; we'd rather tell you no than waste your checking fee.</p>
  </div>
</section>

<section class="bay">
  <div class="shell">
    ${bento(SERVICES)}
  </div>
</section>

<section class="bay bay--dim">
  <div class="shell">
    <div class="bay-head"><h2>Every repair follows the same five steps.</h2></div>
    ${processBlock()}
  </div>
</section>
</main>` + foot();

  add(url, html, { priority: "0.9", changefreq: "monthly" });
}

/* ---------------------- SERVICE PAGES ------------------------- */
SERVICES.forEach((s) => {
  const url = `/services/${s.slug}/`;
  const trail = [{ name: "Home", url: "/" }, { name: "Services", url: "/services/" }, { name: s.shortName, url }];
  const others = SERVICES.filter((o) => o.slug !== s.slug).slice(0, 3);

  const serviceFaqs = [
    { q: `What does ${s.shortName.toLowerCase()} cost?`, a: `Diagnosis is ${B.checkingFee}. The repair price depends on the fault and the parts, and we confirm it with you before any work starts.` },
    { q: "Do you come to my home, or do I bring it in?", a: "Both are available. Some faults are quicker to fix on a bench at our Mlolongo service centre, and we'll say so when we diagnose it." },
    { q: "Which areas do you cover for this?", a: "Nairobi and Mlolongo, with home visits into Machakos, Kajiado and Kiambu counties. Message us with your area and we'll confirm before you book." },
  ];

  const html = head({
    title: `${s.name} in Nairobi &amp; Mlolongo | PulseTech`,
    description: s.metaDescription,
    url,
    accent: THERM_VAR[s.thermal],
    schema: [
      crumbSchema(trail),
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: s.name,
        serviceType: s.name,
        description: s.summary,
        url: abs(url),
        provider: { "@id": abs("/#business") },
        areaServed: [
          { "@type": "AdministrativeArea", name: "Nairobi County" },
          { "@type": "AdministrativeArea", name: "Machakos County" },
          { "@type": "AdministrativeArea", name: "Kajiado County" },
          { "@type": "AdministrativeArea", name: "Kiambu County" },
        ],
      },
      faqSchema(serviceFaqs),
    ],
  }) + masthead("services") + `
<main id="main">

<section class="masthead-page">
  <div class="shell">
    ${crumbs(trail)}
    <div class="service-head">
      <div>
        <h1>${esc(s.name)}</h1>
        <p class="lede">${esc(s.summary)}</p>
        <div class="btn-row" style="margin-top:28px">
          <a class="btn btn--live" href="${wa(s.waMessage)}">${I.ui.whatsapp}<span>WhatsApp about this</span></a>
          <a class="btn btn--line" href="${tel}">${I.ui.phone}<span>Call ${esc(B.phoneDisplay)}</span></a>
        </div>
      </div>
      <div>
        ${frame(SERVICE_PHOTO[s.slug] || null, s.slug === "fridge-repair" || s.slug === "air-conditioner-repair" || s.slug === "freezer-repair" ? I.heroDiagram : `<span style="color:${THERM_VAR[s.thermal]};display:block;width:min(64%,230px);margin:auto">${I.appliance[s.icon]}</span>`, { ratio: SERVICE_PHOTO[s.slug] ? "1080 / 1210" : "4 / 3", priority: true, sizes: "(min-width: 980px) 44vw, 92vw", caption: SERVICE_PHOTO[s.slug] ? SERVICE_PHOTO_CAPTION[s.slug] : "" })}
      </div>
    </div>
  </div>
</section>

<section class="bay">
  <div class="shell">
    <div class="duo">
      <div>
        <h2>What usually goes wrong</h2>
        <p>${esc(s.intro)}</p>
        <ul class="ticks">${s.symptoms.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      </div>
      <div>
        <h2>What we repair on it</h2>
        <ul class="ticks">${s.repairs.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        ${s.safety ? `<div class="notice" style="margin-top:26px"><strong>Before you do anything</strong>${esc(s.safety)}</div>` : ""}
        <div class="plate" style="margin-top:28px">
          <h3 class="plate__title">${esc(s.shortName)} at a glance</h3>
          <p class="plate__note">Confirmed details only.</p>
          <dl class="plate__rows">
            <div><dt>Diagnosis</dt><dd>${esc(B.checkingFee)}</dd></div>
            <div><dt>Where</dt><dd>Your home, or our Mlolongo bench</dd></div>
            <div><dt>Work type</dt><dd>${esc(THERM_WORD[s.thermal])}</dd></div>
            <div><dt>Coverage</dt><dd>Nairobi, Machakos, Kajiado, Kiambu</dd></div>
            <div><dt>Hours</dt><dd>${esc(B.hoursDisplay)}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="bay bay--dark">
  <div class="shell">
    <div class="bay-head"><h2>How the repair goes</h2></div>
    ${processBlock()}
  </div>
</section>

<section class="bay bay--dim">
  <div class="shell">
    <div class="bay-head"><h2>Questions about ${esc(s.shortName.toLowerCase())}</h2></div>
    ${faqBlock(serviceFaqs)}
  </div>
</section>

<section class="bay">
  <div class="shell">
    <div class="bay-head"><h2>Other repairs we take on</h2></div>
    ${bento(others)}
  </div>
</section>
</main>` + foot(s.waMessage);

  add(url, html, { priority: "0.9", changefreq: "monthly" });
});

/* ---------------------------- WORK ---------------------------- */
{
  const url = "/work/";
  const trail = [{ name: "Home", url: "/" }, { name: "Work", url }];
  const html = head({
    title: "Our Repair Work | PulseTech Installation & Repairs",
    description:
      "Photographs and video of appliance repairs carried out by PulseTech in Nairobi and Mlolongo, posted from the workshop.",
    url,
    schema: [crumbSchema(trail)],
  }) + masthead("work") + `
<main id="main">
<section class="masthead-page">
  <div class="shell">
    ${crumbs(trail)}
    <h1>The work</h1>
    <p class="lede">Jobs posted from the workshop as they happen. Nothing here is stock photography, and nothing here belongs to anyone else.</p>
  </div>
</section>

<section class="bay bay--dark">
  <div class="shell">
    ${gallery()}
    <div class="worksplit">
      ${videoPanel()}
      <div class="worksplit__aside">
        <h3>Every picture here is ours</h3>
        <p>These were taken on the job, in customers' kitchens and at the Mlolongo bench. They have not been retouched beyond correcting the exposure, because most workshops are badly lit.</p>
        ${extraPosts()}
      </div>
    </div>
  </div>
</section>

<section class="bay">
  <div class="shell">
    <div class="empty">
      <h3>Before and after comparisons go here</h3>
      <p>This section is built and waiting on photographs. Once paired before/after shots of the same appliance are supplied, they'll appear as a comparison you can drag between &mdash; the single most convincing thing a repair business can show. Send them to ${esc(B.email)} or via WhatsApp.</p>
      <a class="btn btn--ink" href="${wa("Hi PulseTech, I'd like to send photos of completed jobs for the website.")}">${I.ui.whatsapp}<span>Send photos</span></a>
    </div>
  </div>
</section>
</main>` + foot(undefined, true);

  add(url, html, { priority: "0.7", changefreq: "weekly" });
}

/* ------------------------ AREAS WE SERVE ---------------------- */
{
  const url = "/areas-we-serve/";
  const trail = [{ name: "Home", url: "/" }, { name: "Areas we serve", url }];
  const html = head({
    title: "Areas We Serve — Nairobi, Mlolongo &amp; Surrounding Counties | PulseTech",
    description:
      "PulseTech repairs appliances across all 17 Nairobi sub-counties, with a service centre in Mlolongo and home visits into Machakos, Kajiado and Kiambu counties.",
    url,
    schema: [crumbSchema(trail)],
  }) + masthead("areas") + `
<main id="main">
<section class="masthead-page">
  <div class="shell">
    ${crumbs(trail)}
    <h1>Where we work</h1>
    <p class="lede">Based in Mlolongo, in Machakos County, just off Mombasa Road. Nairobi is our main service area, and we reach into the counties around it.</p>
  </div>
</section>

<section class="bay">
  <div class="shell">
    <div class="duo">
      <div>${frame(null, I.coverageMap, { ratio: "640 / 460" })}</div>
      <div>
        <h2>One base, four counties</h2>
        <p>We don't publish a separate page for every estate in Nairobi. Those pages exist to catch searches, not to help anyone, and they tend to promise coverage nobody has checked.</p>
        <p>What's below is where we genuinely go. If your area isn't named, that doesn't mean no &mdash; it means ask, and we'll give you a straight answer before you pay a checking fee.</p>
        <div class="btn-row" style="margin-top:24px">
          <a class="btn btn--live" href="${wa("Hi PulseTech, do you cover my area? I'm in ")}">${I.ui.whatsapp}<span>Check my area</span></a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="bay bay--dim">
  <div class="shell">
    <div class="bay-head"><h2>Coverage</h2></div>
    <div class="coverage">
${COVERAGE.map((c) => `      <div class="area${c.role === "Base" ? " area--base" : ""}">
        <div class="area__role">${esc(c.role)} &middot; ${esc(c.county)}</div>
        <h3>${esc(c.name)}</h3>
        <p>${esc(c.body)}</p>
      </div>`).join("\n")}
    </div>
  </div>
</section>

<section class="bay">
  <div class="shell">
    <div class="bay-head">
      <h2>Nairobi, sub-county by sub-county</h2>
      <p>Home-visit repairs across all seventeen.</p>
    </div>
    <ul class="subareas">
      ${NAIROBI_SUBCOUNTIES.map((a) => `<li><span>${esc(a)}</span></li>`).join("")}
    </ul>
  </div>
</section>
</main>` + foot();

  add(url, html, { priority: "0.8", changefreq: "monthly" });
}

/* ---------------------------- ABOUT --------------------------- */
{
  const url = "/about/";
  const trail = [{ name: "Home", url: "/" }, { name: "About", url }];
  const html = head({
    title: "About PulseTech Installation &amp; Repairs | Mlolongo, Nairobi",
    description:
      "PulseTech is run by Kennedy Nyabando Ochanda from a service centre in Mlolongo, with ten years repairing household appliances across Nairobi.",
    url,
    schema: [crumbSchema(trail)],
  }) + masthead("about") + `
<main id="main">
<section class="masthead-page">
  <div class="shell">
    ${crumbs(trail)}
    <h1>Ten years, one trade.</h1>
    <p class="lede">PulseTech is run by ${esc(B.owner)} from a service centre in Mlolongo.</p>
  </div>
</section>

<section class="bay">
  <div class="shell">
    <div class="duo">
      <div>
        <h2>What we do, and what we don't</h2>
        <p>PulseTech repairs and installs domestic electronic appliances: fridges and freezers, cookers and ovens both built-in and freestanding, microwaves, washing machines, televisions and air conditioners.</p>
        <p>We work two ways. A technician comes to your home, which suits anything plumbed or built in. Or you bring the appliance to the Mlolongo service centre, which is usually faster for television boards and smaller units that need time on a bench.</p>
        <p>Diagnosis costs ${esc(B.checkingFee)}. After that you get a repair price, and nothing goes ahead until you agree to it. If an appliance isn't worth repairing, we say so &mdash; that conversation is cheaper for you than the alternative.</p>
        <h2>Why the website is careful about claims</h2>
        <p>You'll notice this site doesn't quote a response time, a warranty period, or a list of brands. That's deliberate. Those things haven't been confirmed in writing yet, and publishing a guess would be a promise we might not keep. They'll appear here once they're settled.</p>
      </div>
      <div>
        <div class="plate">
          <h3 class="plate__title">${esc(B.name)}</h3>
          <p class="plate__note">Confirmed business details.</p>
          <dl class="plate__rows">
            <div><dt>Owner</dt><dd>${esc(B.owner)}</dd></div>
            <div><dt>Base</dt><dd>${esc(B.addressDisplay)}</dd></div>
            <div><dt>Experience</dt><dd>${B.yearsExperience} years</dd></div>
            <div><dt>Hours</dt><dd>${esc(B.hoursDisplay)}</dd></div>
            <div><dt>Diagnosis</dt><dd>${esc(B.checkingFee)}</dd></div>
            <div><dt>Service model</dt><dd>${esc(B.serviceModel)}</dd></div>
            <div><dt>Phone</dt><dd><a href="${tel}">${esc(B.phoneDisplay)}</a></dd></div>
            <div><dt>Email</dt><dd><a href="mailto:${B.email}">${esc(B.email)}</a></dd></div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="bay bay--dim">
  <div class="shell">
    <div class="bay-head"><h2>Work from the bench</h2></div>
    ${gallery({ limit: 3 })}
  </div>
</section>
</main>` + foot(undefined, 3);

  add(url, html, { priority: "0.6", changefreq: "monthly" });
}

/* ---------------------------- FAQ ----------------------------- */
{
  const url = "/faq/";
  const trail = [{ name: "Home", url: "/" }, { name: "FAQ", url }];
  const pending = FAQS.filter((f) => !f.confirmed);
  const html = head({
    title: "Frequently Asked Questions | PulseTech Installation &amp; Repairs",
    description:
      "Checking fees, home visits, service areas, appliances covered and how to book a technician with PulseTech in Nairobi and Mlolongo.",
    url,
    schema: [crumbSchema(trail), faqSchema(publishedFaqs)],
  }) + masthead("faq") + `
<main id="main">
<section class="masthead-page">
  <div class="shell">
    ${crumbs(trail)}
    <h1>Questions</h1>
    <p class="lede">If yours isn't answered here, WhatsApp it to us and we'll add it.</p>
  </div>
</section>

<section class="bay">
  <div class="shell">
    ${faqBlock(publishedFaqs)}
  </div>
</section>

<section class="bay bay--dim">
  <div class="shell">
    <div class="empty">
      <h3>Three answers we're not publishing yet</h3>
      <p>People often ask about ${pending.map((p) => esc(p.q.replace(/\?$/, "").toLowerCase())).join(", ")}. We haven't published answers because they haven't been confirmed, and a guess on this page would be a promise. Ask us directly and you'll get the current answer.</p>
      <a class="btn btn--ink" href="${wa("Hi PulseTech, I have a question.")}">${I.ui.whatsapp}<span>Ask a question</span></a>
    </div>
  </div>
</section>
</main>` + foot();

  add(url, html, { priority: "0.6", changefreq: "monthly" });
}

/* -------------------------- REVIEWS --------------------------- */
{
  const url = "/reviews/";
  const trail = [{ name: "Home", url: "/" }, { name: "Reviews", url }];
  const html = head({
    title: "Customer Reviews | PulseTech Installation &amp; Repairs",
    description:
      "Customer feedback for PulseTech Installation & Repairs. We publish only reviews customers have actually given us.",
    url,
    schema: [crumbSchema(trail)],
  }) + masthead("reviews") + `
<main id="main">
<section class="masthead-page">
  <div class="shell">
    ${crumbs(trail)}
    <h1>Reviews</h1>
    <p class="lede">This page is empty on purpose.</p>
  </div>
</section>

<section class="bay">
  <div class="shell">
    <div class="empty">
      <h3>No reviews published yet</h3>
      <p>Plenty of repair websites open with five-star quotes from customers who don't exist. We'd rather show you nothing than show you that. When customers give us feedback we're allowed to publish, it will appear here with their name and where they are, and a link to the original where there is one.</p>
      <p>If PulseTech has fixed something for you, we'd genuinely like to hear about it.</p>
      <div class="btn-row" style="margin-top:20px">
        <a class="btn btn--live" href="${wa("Hi PulseTech, I'd like to leave feedback about a repair.")}">${I.ui.whatsapp}<span>Leave feedback</span></a>
      </div>
    </div>
  </div>
</section>
</main>` + foot();

  add(url, html, { priority: "0.4", changefreq: "monthly" });
}

/* -------------------------- CONTACT --------------------------- */
{
  const url = "/contact/";
  const trail = [{ name: "Home", url: "/" }, { name: "Contact", url }];
  const html = head({
    title: "Contact &amp; Book a Technician | PulseTech Installation &amp; Repairs",
    description:
      "Book an appliance repair in Nairobi or Mlolongo. Call or WhatsApp 0711 702 233, or send the enquiry form. Checking fee KSh 1,000.",
    url,
    schema: [crumbSchema(trail), {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      url: abs(url),
      mainEntity: { "@id": abs("/#business") },
    }],
  }) + masthead("contact") + `
<main id="main">
<section class="masthead-page">
  <div class="shell">
    ${crumbs(trail)}
    <h1>Book a repair</h1>
    <p class="lede">The fastest route is WhatsApp. The form below reaches the same place if you'd rather write it all out.</p>
  </div>
</section>

<section class="bay">
  <div class="shell">
    <div class="duo">
      <div>
        <h2>Repair enquiry</h2>
        <p>Tell us the appliance and what it's doing. The more specific the symptom, the better prepared the technician arrives.</p>
        <form data-booking-form novalidate>
          <div class="form-grid">
            <div class="field">
              <label for="name">Your name</label>
              <input type="text" id="name" name="name" autocomplete="name" required>
              <span class="field-error" data-error-for="name"></span>
            </div>
            <div class="field">
              <label for="phone">Phone number</label>
              <input type="tel" id="phone" name="phone" autocomplete="tel" inputmode="tel" required>
              <span class="field-error" data-error-for="phone"></span>
            </div>
            <div class="field">
              <label for="appliance">Appliance</label>
              <select id="appliance" name="appliance" required>
                <option value="">Choose one</option>
                ${SERVICES.map((s) => `<option>${esc(s.shortName)}</option>`).join("")}
                <option>Something else</option>
              </select>
              <span class="field-error" data-error-for="appliance"></span>
            </div>
            <div class="field">
              <label for="brand">Brand <span class="hint">if you know it</span></label>
              <input type="text" id="brand" name="brand">
            </div>
            <div class="field">
              <label for="location">Your area</label>
              <input type="text" id="location" name="location" placeholder="e.g. Embakasi, Mlolongo, Ruiru" required>
              <span class="field-error" data-error-for="location"></span>
            </div>
            <div class="field">
              <label for="service_type">Home visit or drop-off</label>
              <select id="service_type" name="service_type">
                <option>Home visit</option>
                <option>I'll bring it to Mlolongo</option>
                <option>Not sure yet</option>
              </select>
            </div>
            <div class="field field--full">
              <label for="problem">What's it doing?</label>
              <textarea id="problem" name="problem" placeholder="Sounds, leaks, error codes, when it started" required></textarea>
              <span class="field-error" data-error-for="problem"></span>
            </div>
            <div class="field field--full">
              <label for="preferred_time">Preferred day or time <span class="hint">optional</span></label>
              <input type="text" id="preferred_time" name="preferred_time" placeholder="e.g. tomorrow morning">
            </div>
            <div class="field field--full">
              <label for="notes">Anything else <span class="hint">optional</span></label>
              <textarea id="notes" name="notes" style="min-height:90px"></textarea>
            </div>
          </div>
          <div class="btn-row" style="margin-top:22px">
            <button type="submit" class="btn btn--live">Send enquiry</button>
            <a class="btn btn--line" href="${wa("Hi PulseTech, I'd like to book an appliance repair.")}">${I.ui.whatsapp}<span>Send on WhatsApp instead</span></a>
          </div>
          <div class="form-status" data-form-status role="status" aria-live="polite"></div>
        </form>
      </div>

      <div>
        <div class="plate">
          <h3 class="plate__title">Reach us directly</h3>
          <p class="plate__note">Someone answers during working hours.</p>
          <dl class="plate__rows">
            <div><dt>Phone</dt><dd><a href="${tel}">${esc(B.phoneDisplay)}</a></dd></div>
            <div><dt>WhatsApp</dt><dd><a href="${wa("Hi PulseTech, I'd like to book an appliance repair.")}">Message us</a></dd></div>
            <div><dt>Email</dt><dd><a href="mailto:${B.email}">${esc(B.email)}</a></dd></div>
            <div><dt>Service centre</dt><dd>${esc(B.addressDisplay)}</dd></div>
            <div><dt>Hours</dt><dd>${esc(B.hoursDisplay)}</dd></div>
            <div><dt>Checking fee</dt><dd>${esc(B.checkingFee)}</dd></div>
          </dl>
        </div>

        <div class="notice" style="margin-top:24px">
          <strong>Gas smell or burning smell?</strong>
          Don't wait for the form. Switch the appliance off at the wall, close any gas valve, ventilate the room and call us.
        </div>
      </div>
    </div>
  </div>
</section>
</main>` + foot();

  add(url, html, { priority: "0.9", changefreq: "monthly" });
}

/* --------------------------- BLOG ----------------------------- */
{
  const url = "/blog/";
  const trail = [{ name: "Home", url: "/" }, { name: "Repair guides", url }];
  const [featured, ...rest] = BLOG;
  const html = head({
    title: "Repair Guides | PulseTech Installation &amp; Repairs",
    description:
      "Practical guides to common appliance faults, written by working technicians in Nairobi. What to check yourself, and when to call someone.",
    url,
    schema: [crumbSchema(trail)],
  }) + masthead("blog") + `
<main id="main">
<section class="masthead-page">
  <div class="shell">
    ${crumbs(trail)}
    <h1>Repair guides</h1>
    <p class="lede">Written from actual call-outs. Where you can fix something yourself, we say so &mdash; a wasted checking fee helps nobody.</p>
  </div>
</section>

<section class="bay">
  <div class="shell">
    <a class="post" href="/blog/${featured.slug}/" style="border-color:var(--hairline-firm)">
      <div class="post__meta">Latest guide</div>
      <h2 style="margin-bottom:10px">${esc(featured.title)}</h2>
      <p style="font-size:1.05rem">${esc(featured.description)}</p>
      <span class="tile__go" style="margin-top:18px;color:var(--element)">Read it</span>
    </a>
    <div class="post-list" style="margin-top:16px">
${rest.map((p) => `      <article class="post" style="padding:0;border:0;background:none">
        <a class="post" href="/blog/${p.slug}/">
          <div class="post__meta">Guide</div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.description)}</p>
        </a>
      </article>`).join("\n")}
    </div>
  </div>
</section>
</main>` + foot();

  add(url, html, { priority: "0.6", changefreq: "weekly" });
}

BLOG.forEach((post) => {
  const url = `/blog/${post.slug}/`;
  const svc = SERVICES.find((s) => s.slug === post.service);
  const trail = [{ name: "Home", url: "/" }, { name: "Repair guides", url: "/blog/" }, { name: post.title, url }];
  const html = head({
    title: `${post.title} | PulseTech`,
    description: post.description,
    url,
    accent: THERM_VAR[svc.thermal],
    schema: [crumbSchema(trail), {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      author: { "@type": "Organization", name: B.name },
      publisher: { "@id": abs("/#business") },
      mainEntityOfPage: abs(url),
    }],
  }) + masthead("blog") + `
<main id="main">
<section class="masthead-page">
  <div class="shell shell--narrow">
    ${crumbs(trail)}
    <h1>${esc(post.title)}</h1>
  </div>
</section>

<section class="bay">
  <div class="shell shell--narrow">
    <article class="article">
      <p class="article__meta">Published ${new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} &middot; Related service: <a class="pull" href="/services/${svc.slug}/">${esc(svc.shortName)}</a></p>
      <p style="font-size:1.18rem;color:var(--steel)">${esc(post.lede)}</p>
${post.sections.map((sec) => `      <h2>${esc(sec.h)}</h2>
      <p>${esc(sec.p)}</p>`).join("\n")}

      <div class="plate" style="margin-top:44px">
        <h3 class="plate__title">Still stuck?</h3>
        <p class="plate__note">Diagnosis is ${esc(B.checkingFee)}, and you get a price before any work starts.</p>
        <div class="btn-row">
          <a class="btn btn--live" href="${wa(svc.waMessage)}">${I.ui.whatsapp}<span>WhatsApp us</span></a>
          <a class="btn btn--line" href="/services/${svc.slug}/">${esc(svc.shortName)}</a>
        </div>
      </div>
    </article>
  </div>
</section>
</main>` + foot(svc.waMessage);

  add(url, html, { priority: "0.5", changefreq: "yearly" });
});

/* --------------------------- 404 ------------------------------ */
{
  const html = head({
    title: "Page not found | PulseTech Installation & Repairs",
    description: "That page could not be found. Browse PulseTech's appliance repair services for Nairobi and Mlolongo, or call 0711 702 233 to book a technician.",
    url: "/404.html",
  }).replace('<meta name="robots" content="index, follow, max-image-preview:large">', '<meta name="robots" content="noindex, follow">')
  + masthead("") + `
<main id="main">
<section class="masthead-page">
  <div class="shell">
    <h1>That page isn't here.</h1>
    <p class="lede">It may have moved. The appliance you're after is probably one of these.</p>
  </div>
</section>
<section class="bay">
  <div class="shell">
    ${bento(SERVICES)}
    <div class="btn-row" style="margin-top:32px">
      <a class="btn btn--live" href="${wa("Hi PulseTech, I'd like to book an appliance repair.")}">${I.ui.whatsapp}<span>WhatsApp us</span></a>
      <a class="btn btn--ink" href="/">Back to the homepage</a>
    </div>
  </div>
</section>
</main>` + foot();

  pages.push({ url: "/404.html", html, sitemap: null, exactFile: true });
}

/* ============================================================
   WRITE
   ============================================================ */
function relativise(html, depth) {
  const base = depth === 0 ? "" : "../".repeat(depth);

  const toRelative = (target) => {
    let t = target.replace(/^\//, "");
    if (t === "") t = "index.html";
    else if (t.endsWith("/")) t += "index.html";
    return base + t;
  };

  // href="/..." and src="/..." — but never protocol-relative "//host"
  html = html.replace(/(href|src)="\/(?!\/)([^"]*)"/g, (_, attr, rest) =>
    `${attr}="${toRelative("/" + rest)}"`
  );

  // srcset carries several candidates, each with a width descriptor
  html = html.replace(/srcset="([^"]*)"/g, (whole, list) => {
    if (!list.includes("/")) return whole;
    const out = list
      .split(",")
      .map((part) => {
        const bits = part.trim().split(/\s+/);
        if (bits[0].startsWith("/") && !bits[0].startsWith("//")) bits[0] = toRelative(bits[0]);
        return bits.join(" ");
      })
      .join(", ");
    return `srcset="${out}"`;
  });

  // poster="/..." and data-src="/..." on the video element
  html = html.replace(/(poster|data-src)="\/(?!\/)([^"]*)"/g, (_, attr, rest) =>
    `${attr}="${toRelative("/" + rest)}"`
  );

  return html;
}

function writePage(p) {
  let file, depth;
  if (p.exactFile) {
    file = path.join(OUT, p.url.replace(/^\//, ""));
    depth = 0;
  } else {
    file = path.join(OUT, p.url.replace(/^\//, ""), "index.html");
    depth = p.url.split("/").filter(Boolean).length;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, relativise(p.html, depth));
  return file;
}

fs.mkdirSync(OUT, { recursive: true });
const written = pages.map(writePage);

/* --- sitemap --- */
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.filter((p) => p.sitemap).map((p) => `  <url><loc>${abs(p.url)}</loc><lastmod>${today}</lastmod><changefreq>${p.sitemap.changefreq}</changefreq><priority>${p.sitemap.priority}</priority></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(OUT, "sitemap.xml"), sitemap);

/* --- robots --- */
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *
Allow: /

Sitemap: ${abs("/sitemap.xml")}
`);

/* --- redirects from the old .html URLs --- */
const legacy = [
  ["/index.html", "/"],
  ["/about.html", "/about/"],
  ["/contact.html", "/contact/"],
  ["/faq.html", "/faq/"],
  ["/reviews.html", "/reviews/"],
  ["/areas-we-serve.html", "/areas-we-serve/"],
  ["/services/index.html", "/services/"],
  ["/blog/index.html", "/blog/"],
  ...SERVICES.map((s) => [`/services/${s.slug}.html`, `/services/${s.slug}/`]),
  ...BLOG.map((p) => [`/blog/${p.slug}.html`, `/blog/${p.slug}/`]),
];
fs.writeFileSync(
  path.join(OUT, "_redirects"),
  legacy.map(([from, to]) => `${from}  ${to}  301`).join("\n") + "\n"
);
fs.writeFileSync(
  path.join(OUT, ".htaccess"),
  `Options -MultiViews\nErrorDocument 404 /404.html\n\nRewriteEngine On\n` +
    legacy.map(([from, to]) => `RewriteRule ^${from.replace(/^\//, "").replace(/\./g, "\\.")}$ ${to} [R=301,L]`).join("\n") +
    "\n"
);

/* --- favicon (SVG, no binary asset needed) --- */
fs.writeFileSync(path.join(OUT, "favicon.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
<rect width="40" height="40" rx="9" fill="#0D1A21"/>
<path d="M8 20h4.6l2.6-5.4L19 25.6l3-8 2.2 2.4H32" fill="none" stroke="#E2451D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`);

console.log(`Built ${written.length} pages:`);
written.forEach((f) => console.log("  " + path.relative(OUT, f)));
console.log(`\nsitemap.xml, robots.txt, _redirects, .htaccess, favicon.svg written.`);
if (!SITE.domainConfirmed) {
  console.log(`\n!! LAUNCH BLOCKER: SITE.origin is still ${SITE.origin}. Set the real domain in build/data.js and rebuild.`);
}
