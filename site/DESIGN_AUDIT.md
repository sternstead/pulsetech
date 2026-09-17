# Design audit

## The problem with the previous design

It wasn't badly built. It was **anonymous**. Cream background, navy headings,
amber accent, identical white cards in three-column grids, a text-only hero.
That combination is the default look of roughly every template and every
AI-generated site produced in the last two years. Nothing about it said
*appliance repair*, and nothing about it said *this business*.

The brief asked for something a top-tier agency would produce. Agencies don't
start from a palette. They start from the subject.

---

## Direction

The subject is appliances and the workshop they get repaired in. So the
vocabulary comes from that world: enamel panels, petrol-dark machine housings,
brushed steel, and the heat that every one of these machines is built to move
around.

**Colour encodes what the appliance does with heat.** This is the central idea
and it is information, not decoration.

| Hue | Hex | Meaning | Services |
|---|---|---|---|
| Cold | `#12656F` | Sealed systems, refrigerant, compressors | Fridge, freezer, AC |
| Element | `#E2451D` | Heating elements, ignition | Cooker & oven, microwave |
| Water | `#2C6690` | Pumps, drainage, seals | Washing machine |
| Electronic | `#4A5F69` | Boards, backlights, panels | TV |

The service grid, the mega menu and each service page carry the code, with a
legend under the grid. A returning customer learns what kind of job theirs is
without reading a word. `--element` doubles as the live-action hue for every
primary CTA, which is defensible: it is the colour of a thing switched on.

Neutrals are deliberately **cool** — `#F1F3F2` enamel, not cream. Cream plus a
warm accent is the tell the old build fell into.

**Typography.** Bricolage Grotesque for display, Instrument Sans for body. Two
families, clearly distinct. Bricolage has real optical and width variation, so
headlines survive being set very large and very tight (`-0.035em` at the top of
the scale) without turning to mush. No monospace anywhere. No all-caps labels.
No single accented word in a headline.

**Signature device: the spec plate.** Every appliance carries a rating plate —
a small engraved panel of label/value facts. That became the recurring
structural element: hero facts, service specifications, business details,
contact details. It replaces the generic card entirely, and it is the one place
boldness is spent.

---

## Checked, section by section

**Visual hierarchy.** One `h1` per page, verified programmatically. Display
scale runs `clamp(2.5rem → 5.1rem)` at the top and drops cleanly through four
levels. Body copy capped at 68 characters. Section headings capped at 46
characters so they break where intended.

**Homepage.** Follows the funnel in the brief: hero → trust band → services →
work → process → coverage → FAQ → CTA. Five contact opportunities before the
footer, at different levels of commitment (WhatsApp, call, service enquiry,
area check, form).

**Hero.** Asymmetric split, oversized headline, and — now that real media
exists — a photograph of Kennedy rewiring a cooker's burner assembly on a
call-out. This is the right image for the top of the page: a face, hands, tools,
a real kitchen. It carries a light cool grade and a gradient scrim so the
caption stays legible over a busy frame.

The sealed-circuit schematic hasn't been discarded. It moved to the fridge,
freezer and AC service pages, where it explains the system being repaired and
where no photograph exists. That's a better home for it than the hero was.

**Mobile.** Designed, not shrunk. The bento grid reflows 6 → 4 → 2 columns.
The dock is a genuine three-action bar, not a shrunken desktop CTA. Hero
padding drops via `clamp()` rather than a breakpoint jump. `body` carries
`padding-bottom: 58px` below 900px so the dock never covers content, and the
dock and footer both carry `env(safe-area-inset-bottom)` for notched iPhones.
Tap targets are 44px minimum throughout.

**Navigation.** Sticky, with `scroll-padding-top` so anchored content doesn't
land under it. Desktop gets a two-column mega menu for both Services and Areas.
Contact is now in the primary nav, which it wasn't before. Below 1080px it
collapses to a full-screen drawer with accordion sections.

**Typography and spacing.** All spacing derives from one `--bay` token that
scales `56px → 104px` with viewport. Section backgrounds alternate
enamel / dim / dark so the page has rhythm rather than being white throughout.

**Imagery.** Six real photographs and one video, all from actual jobs. WebP with
JPEG fallbacks at four widths, responsive `sizes`, explicit dimensions.
Photographs carry a consistent grade — `saturate(.94) contrast(1.04)` — so a
set shot on different days in different kitchens reads as one body of work.

Two of seven services have photographs. The other five keep diagrams rather than
borrowing an unrelated picture. See `MEDIA_INVENTORY.md`.

**CTAs.** Three tiers with distinct treatment: `--live` for the primary action,
`--ink` for solid secondary, `--line` for tertiary. WhatsApp messages are
context-aware — the fridge page prefills "Hi PulseTech, I need help with my
fridge", the areas page prefills "do you cover my area? I'm in ".

**Floating WhatsApp.** Enters once, after 420px of scroll or 2.6 seconds,
whichever comes first, so it never lands on top of the hero CTA at load.
Desktop only — on mobile the dock does this job, and running both would be the
"random plugin" failure the brief warned about.

**Forms.** Labels on everything, no placeholder-as-label. Errors are specific
and in the interface's voice. Errors clear as soon as the visitor fixes them.
Focus moves to the first bad field. With no endpoint configured, the form says
so plainly and offers WhatsApp — it does not fake a success message.

**Empty states.** Treated as invitations. The reviews page argues *why* it is
empty, which is more persuasive than five invented five-star quotes. The FAQ
page names the three questions it is not answering and explains why.

**Accessibility.** Skip link. Semantic landmarks. Visible 3px focus ring on
every interactive element. Dropdowns are real `<button>`s with `aria-expanded`
and `aria-controls`. Drawer traps focus, closes on ESC, restores focus on
close, locks body scroll, and reopens the desktop nav if the viewport grows.
FAQs use native `<details>`/`<summary>` — keyboard-operable with zero JS. All
decorative SVG is `aria-hidden`; both illustrations carry `<title>` and
`<desc>`.

Contrast, measured against WCAG AA:

| Pair | Ratio | AA |
|---|---|---|
| `--ink` on `--enamel` | 15.4:1 | Pass |
| `--steel` on `--enamel` | 5.1:1 | Pass |
| `--white` on `--element` | 4.6:1 | Pass |
| `--steel-light` on `--ink` | 9.2:1 | Pass |
| `--white` on `--ink` | 17.1:1 | Pass |

**Animation.** Restrained on purpose. One reveal per section, once, on
intersection. Hover lifts on tiles. Menu and accordion transitions that show
what changed. That is all. `prefers-reduced-motion` disables every one of them,
and the reveal is opt-in via a `.js` class on `<html>`, so a JavaScript failure
can never leave content hidden.

**Consistency.** Every page runs through one generator, so header, footer,
dock, floating button and schema are identical by construction. The previous
build had them copy-pasted into 17 files, which is how sites drift.

---

**Gallery and lightbox.** Now justified, so now built. Six photographs in a
responsive grid, each opening a native `<dialog>` lightbox with previous/next,
arrow-key navigation, a caption, and a link to the original Instagram post.
Using `<dialog>` means focus containment, ESC and backdrop dismissal come from
the browser rather than from hand-written traps.

**Video.** Poster frame renders instantly; the file is fetched only on press.
The clip is 1.5 seconds of a repaired hob lighting clean and blue — it earns its
place next to the "we test it with you" claim in the process section.

## Things I deliberately did not build

- **A before/after slider.** Still nothing to put in it: no paired shots of the
  same appliance were supplied. The section exists on `/work/` as an honest
  empty state explaining what's needed.
- **An embedded interactive map.** A drawn SVG schematic communicates the
  service region better for a business without a walk-in storefront, costs no
  tiles and no script, and can't shift layout. The brief permitted this.
- **Instagram embeds.** Eight embeds would add several hundred kilobytes of
  third-party JavaScript and trackers. Click-to-open cards instead.
- **Counter animations on statistics.** The brief mentioned them. Four numbers
  counting up on load is motion that draws attention to nothing.

---

## What still needs a human

**No browser was available in the build environment, so nothing here was
visually verified in a rendering engine.** Everything above is structural and
code-level review. Before sign-off, open the site in a real browser and check:

1. Bricolage Grotesque loads and the hero headline doesn't reflow awkwardly at
   the swap.
2. The hero photograph's crop at 320px, where the portrait frame is tallest.
3. The lightbox on iOS Safari, and the video's play behaviour on a real phone.
2. The bento grid at 320px, 390px and 768px.
3. The drawer on an actual iPhone, particularly scroll lock behaviour.
4. The dock against the home indicator on a notched device.
5. The mega menu with a keyboard only — Tab, Enter, ESC.
6. Run PageSpeed Insights and axe DevTools against the deployed URL.
