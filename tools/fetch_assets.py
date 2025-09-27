#!/usr/bin/env python3
# Strong fetcher: grabs <img>, srcset, inline style url(...), and urls inside linked CSS.
# Fixes absolute_url so scheme-less "cdn2.editmysite.com/..." becomes "https://cdn2.editmysite.com/..."
# Requires: python3 -m pip install requests beautifulsoup4
import os, re, json, hashlib, urllib.parse, pathlib, sys
from pathlib import Path
import requests
from bs4 import BeautifulSoup

BASE = "https://btheducationgroup.org"
OUT = Path("assets/images/bth")
OUT.mkdir(parents=True, exist_ok=True)

def safe_name(url: str) -> str:
    base = pathlib.Path(urllib.parse.urlparse(url).path).name or "asset"
    if not os.path.splitext(base)[1]:
        base += ".bin"
    return f"{hashlib.sha1(url.encode()).hexdigest()[:10]}_{base}"

def absolute_url(url: str) -> str:
    u = url.strip()
    if u.startswith(("http://", "https://", "data:")):
        return u
    if u.startswith("//"):                 # e.g. //cdn2.editmysite.com/...
        return "https:" + u
    # domain path without scheme: cdn2.editmysite.com/...
    if re.match(r'^[A-Za-z0-9.-]+\.[A-Za-z]{2,}(/.*)?$', u):
        return "https://" + u
    # relative path
    return urllib.parse.urljoin(BASE + "/", u.lstrip("/"))

def gather_from_html(session, page_url, urls, css_urls):
    try:
        r = session.get(page_url, timeout=25)
        r.raise_for_status()
    except Exception as e:
        print("WARN:", page_url, e)
        return
    soup = BeautifulSoup(r.text, "html.parser")

    # <img src> + srcset
    for img in soup.select("img[src]"):
        urls.add(absolute_url(img["src"]))
        srcset = img.get("srcset", "")
        if srcset:
            for part in srcset.split(","):
                u = part.strip().split(" ")[0]
                if u:
                    urls.add(absolute_url(u))

    # <source src / srcset>
    for src in soup.select("source[src], source[srcset]"):
        if src.get("src"):
            urls.add(absolute_url(src["src"]))
        if src.get("srcset"):
            for part in src["srcset"].split(","):
                u = part.strip().split(" ")[0]
                if u:
                    urls.add(absolute_url(u))

    # inline CSS url(...)
    for tag in soup.find_all(style=True):
        style = tag["style"]
        for m in re.finditer(r"url\(([^)]+)\)", style):
            raw = m.group(1).strip().strip('"').strip("'")
            if raw:
                urls.add(absolute_url(raw))

    # linked CSS
    for link in soup.select('link[rel="stylesheet"][href]'):
        css_urls.add(absolute_url(link["href"]))

def gather_from_css(session, css_url, urls):
    try:
        r = session.get(css_url, timeout=25)
        r.raise_for_status()
    except Exception as e:
        print("WARN css:", css_url, e)
        return
    for m in re.finditer(r"url\(([^)]+)\)", r.text):
        raw = m.group(1).strip().strip('"').strip("'")
        if raw and not raw.lower().startswith("data:"):
            urls.add(absolute_url(raw))

def download_all(session, urls):
    saved = {}
    for u in sorted(urls):
        if not any(u.lower().endswith(ext) for ext in (".png",".jpg",".jpeg",".svg",".webp",".gif")):
            continue
        name = safe_name(u)
        dest = OUT / name
        try:
            resp = session.get(u, timeout=30)
            resp.raise_for_status()
            dest.write_bytes(resp.content)
            saved[u] = str(dest)
            print("OK", u, "->", dest)
        except Exception as e:
            print("FAIL", u, e)
    (OUT / "sources.json").write_text(json.dumps(saved, indent=2), encoding="utf-8")
    return saved

if __name__ == "__main__":
    pages = [
        BASE + "/",
        BASE + "/index.html",
        BASE + "/oedp", BASE + "/oedp.html",
        BASE + "/pece", BASE + "/pece.html",
        BASE + "/about", BASE + "/about.html",
        BASE + "/industry-solutions", BASE + "/industry-solutions.html",
        BASE + "/contact", BASE + "/contact.html",
        BASE + "/education-franchise", BASE + "/education-franchise.html",
    ]
    s = requests.Session()
    s.headers["User-Agent"] = "BTH-Fetcher/1.2"
    img_urls, css_urls = set(), set()

    for p in pages:
        print("Scanning", p)
        gather_from_html(s, p, img_urls, css_urls)

    for cu in sorted(css_urls):
        print("Scanning CSS", cu)
        gather_from_css(s, cu, img_urls)

    print("Found", len(img_urls), "image urls (after CSS expansion)")
    saved = download_all(s, img_urls)
    print("Saved", len(saved), "assets -> assets/images/bth/")
    print("Done.")
