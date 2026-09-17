# Media inventory

**Seven real assets supplied and integrated.** Six photographs and one video
clip, all taken by the business on actual jobs. No stock photography appears
anywhere on this site.

Regenerate optimised derivatives at any time:

```bash
python3 build/optimize_media.py
node build/build.js
```

The optimiser is the only thing that writes to `site/images/` and
`site/videos/`, and it clears those folders before each run — don't hand-place
files there.

---

## What was supplied, and where each ended up

| Original | Subject | Used on |
|---|---|---|
| `C_k71LXMyki_02.jpg` | Technician rewiring a freestanding cooker's burner assembly, face visible | **Homepage hero**, gallery, About, social share card |
| `C_k71LXMyki_03.jpg` | Same job, close on the burner assembly with pliers | **Cooker & oven repair hero**, gallery |
| `C_KRPzhKZ36_04.mp4` | Repaired gas hob, three burners lit blue | **Video panel** on homepage and Work |
| `C4OB4Q1MOpb_01.jpg` | Front-loader stripped down, door seal and drum out | **Washing machine repair hero**, gallery |
| `C_GJYBZsSwg_05.jpg` | LG washing machine control board removed | Gallery |
| `C-_MNfHMfT1_06.jpg` | Washing machine with top off, internals exposed | Gallery |
| `C-_KF_Psl98_07.jpg` | Stainless drum out of the cabinet | Gallery |

### An important gap

The photographs cover **two** of the seven services: cookers and washing
machines. There is nothing of a fridge, freezer, microwave, TV or air
conditioner.

Those five service pages therefore keep their drawn diagrams. Putting a washing
machine photograph on the fridge page would be a lie told in pictures, and the
kind of thing customers notice. Each is a photo slot waiting to be filled.

---

## Generated derivatives

Each photograph is emitted as WebP at every width the layout requests, plus one
progressive JPEG fallback at full size.

| Output | Widths | WebP total | JPEG fallback |
|---|---|---|---|
| `hero/pulsetech-technician-cooker-repair-nairobi` | 420 / 640 / 860 / 1080 | 180 KB | 137 KB |
| `services/pulsetech-cooker-burner-wiring-repair` | 420 / 640 / 860 / 1080 | 175 KB | 139 KB |
| `services/pulsetech-washing-machine-drum-door-repair` | 420 / 560 / 720 | 148 KB | 104 KB |
| `work/pulsetech-washing-machine-control-board` | 420 / 560 / 720 | 105 KB | 71 KB |
| `work/pulsetech-washing-machine-internals` | 420 / 560 / 720 | 58 KB | 51 KB |
| `work/pulsetech-washing-machine-drum-removed` | 420 / 560 / 720 | 73 KB | 58 KB |
| `og/pulsetech-share-card.jpg` | 1200×630 | — | 89 KB |
| `videos/work/pulsetech-gas-hob-tested-after-repair.mp4` | 360×360, 1.5s | — | 22 KB |
| `videos/work/…-poster.webp` | 360×360 | 7 KB | — |

**A visitor never downloads all of this.** Responsive `sizes` attributes mean a
phone pulls the 420px WebP, roughly 20 KB per image. Everything below the fold
is `loading="lazy"`, and the video has `preload="none"` — the file is fetched
only when someone presses play.

---

## What was done to the originals, and what wasn't

Both cooker photographs were shot in a dim kitchen and were close to unreadable
on screen. They were brightened (×1.38 and ×1.42) with a small contrast and
sharpening lift. The four washing machine photographs needed almost nothing
(×1.06–1.10).

**Nothing was added, removed, composited or retouched.** No object was cleaned
up, no background replaced, no result improved. These are the jobs as they
happened, in a working kitchen, with a tool bag on the floor — which is a good
deal more convincing than a staged studio shot would be.

The social share card is composed from the hero photograph with a dark scrim
and the business name over it. It is set in Poppins Bold, because the site's own
faces were not installed in the build environment. Worth regenerating with
Bricolage Grotesque before launch if you want an exact brand match.

---

## One thing to confirm with Kennedy

The control board photograph clearly reads **LG Electronics**. That is direct
evidence of at least one brand serviced, but a brand list has still not been
supplied, so nothing has been published from it. Ask him which brands he works
on — "Samsung fridge repair Nairobi" and its siblings are real searches the
site currently cannot answer.

---

## Alt text in use

Written to describe what is happening, not to carry keywords. These get read
aloud to people using screen readers.

- Hero: *A PulseTech technician rewiring the burner assembly of a freestanding
  gas cooker during a home repair*
- Cooker page: *Close view of a cooker's burner assembly with the wiring loom
  exposed, being tested with pliers*
- Washing machine page: *A front-loading washing machine stripped down, with the
  door seal and drum assembly removed*
- Control board: *A washing machine control board removed from the machine,
  circuitry and display visible*
- Internals: *A washing machine with the top panel removed, showing the internal
  wiring, detergent drawer and drum*
- Drum: *A stainless steel washing machine drum removed from its cabinet and
  standing on the workshop floor*
- Video: *Three gas burners lit with steady blue flames on a repaired cooker hob*

---

## Still linked, not shown

Two of the original eight Instagram posts had no photograph supplied. They are
linked as buttons under the gallery rather than faked with a stand-in image:

- `instagram.com/reel/C-_NOlpSRME/`
- `instagram.com/p/C_GPcG9MLX8/`

Supply those two files and they join the gallery.

---

## What to ask for next, in priority order

1. **A fridge repair photograph.** Fridge repair is the highest-volume search
   term of the seven and currently the only major service with no visual proof.
2. **Freezer, microwave, TV and AC photos**, one good frame each.
3. **Paired before/after shots of the same appliance.** The `/work/` page has
   the section built and waiting. Nothing converts a repair customer faster.
4. **A clean portrait of Kennedy.** The hero shot works, but a deliberate
   photograph would be stronger on the About page.
5. **A logo file**, if one exists. Currently a typographic mark.
6. **The Instagram handle**, so eight post links can point at a profile.

### Shooting notes for Kennedy

- Shoot **horizontally** for hero and video, vertically only for Instagram.
- Get near a window or switch the kitchen light on. Almost every photo supplied
  was underexposed, and correcting that in software costs sharpness.
- Hands in frame beat a tidy appliance. People are buying the technician.
- For before/after, shoot from **the same spot** both times. That's what makes
  the comparison work.

---

## Adding a new photo

1. Put the original with the others and add a line to `PLAN` in
   `build/optimize_media.py`: source file, output stem, folder, widths, and
   brightness/contrast if it needs correcting.
2. Run `python3 build/optimize_media.py`.
3. Add it to `MEDIA` or `GALLERY` in `build/data.js`, with real alt text.
4. Run `node build/build.js`, then `node build/qa.js`.

Filenames are generated from the stem, so keep them descriptive:
`pulsetech-fridge-compressor-repair-nairobi`, not `IMG_3948`.
