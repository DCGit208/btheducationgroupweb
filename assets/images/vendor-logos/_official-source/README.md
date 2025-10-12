Drop official, brand-compliant SVGs here with EXACT filenames to replace placeholders.

Required filenames (current placeholder list):
- cisco.svg
- isc2.svg
- pmi.svg
- peoplecert.svg
- vmware.svg
- googlecloud.svg
- isaca.svg
- giac.svg
- iapp.svg
- csa.svg
- redhat.svg
- linuxfoundation.svg
- netapp.svg
- veeam.svg
- splunk.svg
- citrix.svg
- juniper.svg
- suse.svg
- fortinet.svg
- oracle.svg
- nokia.svg
- unity.svg

How to ingest:
1) Place the official SVG(s) into this folder using the exact filename(s) above.
2) From the repo root, run:
   npm run logos
3) The script will optimize and copy the SVGs into ../ (vendor-logos) and report replacements.
4) Optionally run:
   npm run optimize:logos
   npm run check:logos

Notes:
- Ensure the SVGs are vector-only (no embedded bitmaps) and include viewBox.
- The pipeline preserves viewBox and IDs by default.
- If a logo requires a different filename, update vendorLogoMap in programs/informationtechnology.html to match.
