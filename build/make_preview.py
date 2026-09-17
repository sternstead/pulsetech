#!/usr/bin/env python3
"""
Builds a single-file, fully self-contained copy of one page for review.

Inlines the stylesheet, the script and every local image/video as a data URI,
so the result can be opened anywhere with no server and no sibling files.

This is a review aid only. It is NOT what gets deployed — the real site keeps
its assets as separate cacheable files, which is far better for performance.

Usage: python3 build/make_preview.py <page-dir> <output.html> "<banner note>"
       python3 build/make_preview.py work /tmp/work.html "Work page preview"
"""

import base64, mimetypes, os, re, sys

ROOT = os.path.join(os.path.dirname(__file__), "..", "site")


def datauri(path):
    mt, _ = mimetypes.guess_type(path)
    if path.endswith(".webp"):
        mt = "image/webp"
    if path.endswith(".mp4"):
        mt = "video/mp4"
    with open(path, "rb") as f:
        return f"data:{mt};base64," + base64.b64encode(f.read()).decode()


def build(page, out, note):
    page_dir = os.path.join(ROOT, page) if page else ROOT
    html = open(os.path.join(page_dir, "index.html")).read()
    depth = len([p for p in page.split("/") if p])
    up = "../" * depth

    html = html.replace(f'<link rel="stylesheet" href="{up}css/styles.css">',
                        "<style>\n" + open(os.path.join(ROOT, "css/styles.css")).read() + "\n</style>")
    html = html.replace(f'<script src="{up}js/site.js" defer></script>',
                        "<script>\n" + open(os.path.join(ROOT, "js/site.js")).read() + "\n</script>")
    html = re.sub(r'<link rel="icon"[^>]*>', "", html)
    # structured data still carries the placeholder domain; strip it from previews
    html = re.sub(r'<script type="application/ld\+json">.*?</script>\n?', "", html, flags=re.S)

    # inline every local asset reference
    refs = set(re.findall(r'"((?:\.\./)*(?:images|videos)/[^"\s]+\.(?:webp|jpg|png|mp4))', html))
    for ref in sorted(refs, key=len, reverse=True):
        path = os.path.normpath(os.path.join(page_dir, ref))
        if os.path.exists(path):
            html = html.replace(ref, datauri(path))

    banner = (
        '<div style="background:#E2451D;color:#fff;padding:11px 20px;'
        'font:500 14px/1.4 system-ui,sans-serif;text-align:center">'
        f"{note}</div>"
    )
    html = html.replace('<a class="skip-link" href="#main">Skip to content</a>',
                        '<a class="skip-link" href="#main">Skip to content</a>\n' + banner)

    open(out, "w").write(html)
    print(f"{out}  {round(len(html)/1024)} KB")


if __name__ == "__main__":
    build(sys.argv[1], sys.argv[2], sys.argv[3])
