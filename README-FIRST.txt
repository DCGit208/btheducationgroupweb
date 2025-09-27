
BTH PRO WEBSITE — BUNDLED (Site + Tools)
========================================

1) Preview locally:
   - Open index.html in a browser, or use VS Code with Live Server.

2) Fetch current images/logos from your live site:
   - Terminal in this folder:
       pip install requests beautifulsoup4
       python3 tools/fetch_assets.py
   - This saves images to: assets/images/bth/ and creates assets/images/bth/sources.json

3) Apply fetched assets to pages (replace placeholders + wire logos):
       python3 tools/apply_fetched_assets.py

4) Review locally, then upload everything via FTP.
