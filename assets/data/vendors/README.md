Per-vendor certification datasets

- Add files here named like `microsoft.json`, `aws.json`, `cisco.json`, etc.
- Each file should export a JSON array of certifications with fields at minimum:
  - id (optional; will be generated if missing)
  - name (required)
  - vendor (required; exact vendor label in UI)
  - category (e.g., core-it, cloud-platforms, cybersecurity, software-devops, governance-agile, specialized-tech, emerging-tech)
  - focus (vendor-neutral discipline string)
  - level (1..5)
  - retired (boolean)
  - premium (boolean)
  - exam (string)
  - logo (relative path or URL)
  - url (string)
- You can include extra fields; the page will enrich items further at runtime (tracks, vendor_stage, vendor_area, etc.).

Merging
- Run scripts/merge-certs.js to merge files into assets/data/certifications.json
- Items in vendor files override base items by id or by (vendor+name) match
- IDs are generated if missing to maintain stability across merges
