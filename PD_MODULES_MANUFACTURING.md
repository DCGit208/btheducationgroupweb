# Manufacturing Professional Development (PD) Modules — Explainer

This document explains the intent, data model, and UI behavior for Manufacturing PD Modules used on the Manufacturing & Industrial hub page.

## Purpose
- PD Modules are short, practical learning units focused on shopfloor and operational competencies.
- They complement, but do not replace, formal certifications. PD Modules reinforce day-to-day skills and leadership habits aligned to each level.

## Distinct From Certifications
- Certifications: Vendor/industry-recognized credentials with exams, mapped to levels and priced per level.
- PD Modules: Internal learning assets for skills progression; they do not issue external certificates.
- UI separation is intentional: certifications are presented in cards with pricing; PD Modules are listed in their own section.

## Levels & Counts
PD modules are aligned by professional level and rendered based on the selected level:
- Level 1: 12 modules
- Level 2: 15 modules
- Level 3: 18 modules
- Level 4: 22 modules
- Level 5: 28 modules

These counts are enforced by the content in the JSON data source.

## Data Source
- File: `assets/data/pd-modules.manufacturing.json`
- Structure:
```json
{
  "manufacturing": {
    "levels": {
      "1": [ { "code": "PD-L1-01", "title": "...", "desc": "..." }, ... ],
      "2": [ ... ],
      "3": [ ... ],
      "4": [ ... ],
      "5": [ ... ]
    }
  }
}
```
- Required fields per module:
  - `code`: Stable identifier (e.g., `PD-L3-07`).
  - `title`: Concise module name.
  - `desc`: One-line description for context.
- Optional fields (future-friendly):
  - `hours`: Estimated time to complete.
  - `tags`: Array of topic tags (e.g., `["safety", "oee"]`).

## UI Behavior (manufacturing.html)
- The PD Modules section sits directly under the Career Explorer section.
- Rendering is level-aware: changing the Level filter updates the PD Modules list.
- Initial page load renders the default level’s module set (or the level specified by `?level=` deep link, if present).
- Search and other filters (domain, vendor, solution area, region) do not alter PD Modules today; only the Level filter drives PD content.
- Accessibility: Modules render as a simple list for fast scanning and keyboard navigation.

## Pricing Model Coverage
- Level-based pricing applies to certifications (displayed in the Levels section and in certification card overlays).
- PD Modules are not individually priced at this time; they are considered part of level-aligned professional development. If monetization changes, the JSON schema can add `hours` or `price` and the UI can be adjusted.

## Extending Content
- To add/edit a PD module: update `assets/data/pd-modules.manufacturing.json` in the appropriate level array.
- Keep titles concise and descriptions under ~120 characters for layout consistency.
- Maintain stable `code` IDs for tracking, analytics, and future deep links.

## Validation & QA
- After edits, hard-refresh the Manufacturing page and confirm:
  - The PD Modules list appears under the Explorer.
  - The count matches the selected level (L1:12, L2:15, L3:18, L4:22, L5:28).
  - No 404s or console errors from fetching the JSON file.
- If the JSON path changes, update the loader in `manufacturing.html` accordingly.

## Change Log
- 2025-11-22: Initial JSON and explainer created. Level-aligned lists populated (L1–L5).