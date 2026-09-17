#!/usr/bin/env python3
"""
Media optimisation for the PulseTech site.

Takes the client's original files, applies a light tonal correction where the
original is underexposed (these were shot in dim kitchens), resizes to the
widths the layout actually requests, and writes WebP plus a JPEG fallback.

Nothing here alters the content of a photograph. Exposure and contrast are
lifted only where the original is too dark to read on a screen.

Run: python3 build/optimize_media.py
"""

import os, subprocess, shutil
from PIL import Image, ImageEnhance

SRC = "/home/claude/media/media"
IMG = "/home/claude/pulsetech/site/images"
VID = "/home/claude/pulsetech/site/videos"

# source -> (output stem, subfolder, widths, brightness, contrast)
PLAN = {
    "C_k71LXMyki_02.jpg": ("pulsetech-technician-cooker-repair-nairobi", "hero",     [1080, 860, 640, 420], 1.38, 1.10),
    "C_k71LXMyki_03.jpg": ("pulsetech-cooker-burner-wiring-repair",      "services", [1080, 860, 640, 420], 1.42, 1.12),
    "C4OB4Q1MOpb_01.jpg": ("pulsetech-washing-machine-drum-door-repair", "services", [720, 560, 420],       1.06, 1.04),
    "C_GJYBZsSwg_05.jpg": ("pulsetech-washing-machine-control-board",    "work",     [720, 560, 420],       1.10, 1.05),
    "C-_MNfHMfT1_06.jpg": ("pulsetech-washing-machine-internals",        "work",     [720, 560, 420],       1.08, 1.05),
    "C-_KF_Psl98_07.jpg": ("pulsetech-washing-machine-drum-removed",     "work",     [720, 560, 420],       1.06, 1.06),
}

VIDEO = ("C_KRPzhKZ36_04.mp4", "pulsetech-gas-hob-tested-after-repair")


def build_images():
    rows = []
    for src, (stem, folder, widths, bright, contrast) in PLAN.items():
        path = os.path.join(SRC, src)
        im = Image.open(path).convert("RGB")
        if bright != 1.0:
            im = ImageEnhance.Brightness(im).enhance(bright)
        if contrast != 1.0:
            im = ImageEnhance.Contrast(im).enhance(contrast)
        # a touch of sharpening recovers detail lost to the phone's noise reduction
        im = ImageEnhance.Sharpness(im).enhance(1.25)

        out_dir = os.path.join(IMG, folder)
        os.makedirs(out_dir, exist_ok=True)

        for w in widths:
            if w > im.width:
                continue
            h = round(im.height * w / im.width)
            resized = im.resize((w, h), Image.LANCZOS)
            webp = os.path.join(out_dir, f"{stem}-{w}.webp")
            resized.save(webp, "WEBP", quality=80, method=6)
            rows.append((os.path.relpath(webp, IMG), w, h, os.path.getsize(webp)))

        # single JPEG fallback at the largest width, for older browsers
        big = max(w for w in widths if w <= im.width)
        h = round(im.height * big / im.width)
        jpg = os.path.join(out_dir, f"{stem}-{big}.jpg")
        im.resize((big, h), Image.LANCZOS).save(jpg, "JPEG", quality=78, optimize=True, progressive=True)
        rows.append((os.path.relpath(jpg, IMG), big, h, os.path.getsize(jpg)))

    return rows


def build_video():
    src = os.path.join(SRC, VIDEO[0])
    stem = VIDEO[1]
    out_dir = os.path.join(VID, "work")
    os.makedirs(out_dir, exist_ok=True)

    mp4 = os.path.join(out_dir, f"{stem}.mp4")
    subprocess.run([
        "ffmpeg", "-v", "error", "-y", "-i", src,
        "-an",                       # no audio track at all: it will be muted anyway
        "-vcodec", "libx264", "-crf", "26", "-preset", "slow",
        "-pix_fmt", "yuv420p",       # required for Safari
        "-movflags", "+faststart",   # metadata first, so it can start before full download
        mp4,
    ], check=True)

    # poster frame, so the slot is filled instantly and never shifts
    tmp = "/tmp/poster.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src,
                    "-vf", "select=eq(n\\,8)", "-vframes", "1", tmp], check=True)
    poster = Image.open(tmp).convert("RGB")
    poster = ImageEnhance.Brightness(poster).enhance(1.12)
    poster_path = os.path.join(out_dir, f"{stem}-poster.webp")
    poster.save(poster_path, "WEBP", quality=82, method=6)

    return [
        (os.path.relpath(mp4, VID), None, None, os.path.getsize(mp4)),
        (os.path.relpath(poster_path, VID), poster.width, poster.height, os.path.getsize(poster_path)),
    ]


def build_og():
    """
    1200x630 social share card, composed from the hero photograph with a
    dark scrim and the business name. Generated rather than hand-designed
    so it can be rebuilt whenever the hero photo changes.

    NOTE: uses Poppins Bold, because the site faces (Bricolage Grotesque
    and Instrument Sans) are not installed in this environment. Regenerate
    with the real faces before launch if you want exact brand match.
    """
    from PIL import ImageDraw, ImageFont

    W, H = 1200, 630
    src = Image.open(os.path.join(SRC, "C_k71LXMyki_02.jpg")).convert("RGB")
    src = ImageEnhance.Brightness(src).enhance(1.12)
    src = ImageEnhance.Contrast(src).enhance(1.22)

    # cover-crop to 1200x630
    scale = max(W / src.width, H / src.height)
    src = src.resize((round(src.width * scale), round(src.height * scale)), Image.LANCZOS)
    left = (src.width - W) // 2
    top = max(0, (src.height - H) // 3)       # bias upward, toward the technician
    card = src.crop((left, top, left + W, top + H))

    # scrim so type stays legible over a busy photograph
    scrim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(scrim)
    for y in range(H):
        a = int(250 * (y / H) ** 2.2) + 26
        d.line([(0, y), (W, y)], fill=(13, 26, 33, min(a, 250)))
    card = Image.alpha_composite(card.convert("RGBA"), scrim).convert("RGB")

    d = ImageDraw.Draw(card)
    F = "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"
    Fm = "/usr/share/fonts/truetype/google-fonts/Poppins-Medium.ttf"
    big, mid, small = ImageFont.truetype(F, 66), ImageFont.truetype(Fm, 31), ImageFont.truetype(Fm, 26)

    d.rectangle([72, 398, 78, 560], fill="#E2451D")                       # element-hue rule
    d.text((104, 392), "PulseTech", font=big, fill="#FFFFFF")
    d.text((104, 470), "Appliance repair — Nairobi & Mlolongo", font=mid, fill="#FFFFFF")
    d.text((104, 516), "Fridges · Cookers · Washing machines · TVs · AC", font=small, fill="#A9B7BD")

    out_dir = os.path.join(IMG, "og")
    os.makedirs(out_dir, exist_ok=True)
    jpg = os.path.join(out_dir, "pulsetech-share-card.jpg")
    card.save(jpg, "JPEG", quality=84, optimize=True, progressive=True)
    return [(os.path.relpath(jpg, IMG), W, H, os.path.getsize(jpg))]


if __name__ == "__main__":
    for d in (IMG, VID):
        for sub in os.listdir(d):
            p = os.path.join(d, sub)
            if os.path.isdir(p):
                for f in os.listdir(p):
                    if f != ".gitkeep":
                        os.remove(os.path.join(p, f))

    rows = build_images()
    rows += build_video()
    rows += build_og()

    total = sum(r[3] for r in rows)
    print(f"{'file':62} {'dims':>12} {'size':>9}")
    print("-" * 86)
    for name, w, h, size in sorted(rows):
        dims = f"{w}x{h}" if w else "video"
        print(f"{name:62} {dims:>12} {size/1024:8.1f}K")
    print("-" * 86)
    print(f"{'TOTAL':62} {'':>12} {total/1024:8.1f}K")


