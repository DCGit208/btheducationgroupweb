#!/usr/bin/env python3
# Apply fetched images/logos to HTML; rewrites remote URLs and ensures logos render.
import os, re, json, sys
from pathlib import Path

ROOT = Path(".")
MAP_PATH = ROOT / "assets/images/bth/sources.json"
IMG_DIR = ROOT / "assets/images/bth"

BRANDS = [
    ("microsoft", "Microsoft"),
    ("comptia", "CompTIA"),
    ("ec-council", "EC-Council"),
    ("eccouncil", "EC-Council"),
    ("cisco", "Cisco"),
    ("aws", "AWS"),
    ("pmi", "PMI"),
    ("oracle", "Oracle"),
    ("adobe", "Adobe"),
    ("autodesk", "Autodesk"),
    ("redhat", "Red Hat"),
    ("pearson", "Pearson"),
    ("pearsonvue", "Pearson VUE"),
    ("pearson-vue", "Pearson VUE"),
]

def load_map():
    if not MAP_PATH.exists():
        print("ERROR: sources.json not found at", MAP_PATH)
        sys.exit(1)
    with MAP_PATH.open(encoding="utf-8") as f:
        return json.load(f)

def rewrite_remote_urls(saved_map):
    html_files = list(ROOT.glob("*.html"))
    replaced_total = 0
    for f in html_files:
        txt = f.read_text(encoding="utf-8")
        new_txt = txt
        for remote, local in saved_map.items():
            local_rel = os.path.relpath(local, start=f.parent).replace("\\", "/")
            if remote in new_txt:
                new_txt = new_txt.replace(remote, local_rel)
                replaced_total += 1
        if new_txt != txt:
            f.write_text(new_txt, encoding="utf-8")
            print("Rewrote", f.name)
    print("Remote URL replacements:", replaced_total)

def list_all_logos():
    items = []
    for p in IMG_DIR.glob("*"):
        if p.is_file() and (p.suffix.lower() in [".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif"]):
            items.append(p)
    return sorted(items, key=lambda x: x.name.lower())

def best_logo(brand_key):
    logos = list_all_logos()
    cand = [p for p in logos if brand_key in p.name.lower()]
    if not cand:
        return None
    rank = {".svg":0, ".png":1, ".webp":2, ".jpg":3, ".jpeg":3, ".gif":4}
    cand.sort(key=lambda p:(rank.get(p.suffix.lower(),9), -len(p.name)))
    return cand[0]

def ensure_partner_grid_has_images():
    f = ROOT / "partners.html"
    if not f.exists():
        print("WARN: partners.html missing")
        return
    html = f.read_text(encoding="utf-8")

    # Try brand replacements first
    replaced = 0
    for key, label in BRANDS:
        logo = best_logo(key)
        if not logo:
            continue
        rel = os.path.relpath(logo, start=f.parent).replace("\\", "/")
        img_html = f'<div class="logo-card"><img src="{rel}" alt="{label} logo"></div>'
        pattern = re.compile(r'<div\s+class="logo-card"[^>]*>\s*' + re.escape(label) + r'\s*</div>', re.IGNORECASE)
        new_html = pattern.sub(img_html, html)
        if new_html != html:
            replaced += 1
            html = new_html

    # If branded replacements failed, or no placeholders exist, inject a grid from all logos we have
    if replaced == 0:
        logos = list_all_logos()
        if logos:
            grid_items = "\n".join(
                f'<div class="logo-card"><img src="{os.path.relpath(p, start=f.parent).replace("\\", "/")}" alt="Partner logo"></div>'
                for p in logos[:48]
            )
            if re.search(r'<div[^>]+class="logos-grid"[^>]*>', html, flags=re.IGNORECASE):
                html = re.sub(
                    r'(<div[^>]+class="logos-grid"[^>]*>)(.*?)(</div>)',
                    lambda m: m.group(1) + "\n" + grid_items + "\n" + m.group(3),
                    html,
                    flags=re.DOTALL | re.IGNORECASE
                )
            else:
                # Append a logos section if none exists
                html += (
                    "\n<section class=\"section\"><div class=\"container logos-wrap\">"
                    "<div class=\"logos-grid\">" + grid_items + "</div></div></section>\n"
                )

    f.write_text(html, encoding="utf-8")
    print("partners.html updated with logo grid.")

if __name__ == "__main__":
    m = load_map()
    rewrite_remote_urls(m)
    ensure_partner_grid_has_images()
    print("Done.")
