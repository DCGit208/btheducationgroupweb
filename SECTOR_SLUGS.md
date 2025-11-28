# Sector → Slug → Filename mapping (aligned to existing hub pages)

Existing (already developed)
- Information Technology → `technology` → `programs/informationtechnology.html`
- Healthcare Technology → `healthcare` → `programs/healthcare.html`

Canonical (target) sectors to (re)build using full template
- Manufacturing & Industrial → `manufacturing` → `programs/manufacturing.html`
- Automotive Technology → `automotive` → `programs/automotive.html`
- Energy & Renewable Systems → `renewable-energy` → `programs/renewable-energy.html`
- Construction & Infrastructure → `architecture-engineering` → `programs/architecture-engineering.html`
- Communications & Telecommunications → `telecommunications` → `programs/telecommunications.html`
- Creative Arts & Digital Design → `creative-arts` → `programs/creative-arts.html`
- Finance & Accounting → `finance` → `programs/finance.html`
- Business & Management → `business-development` → `programs/business-development.html`
- Environmental & Sustainability → `environmental` → (pending page) `programs/environmental-sustainability.html` (will rename to `environmental.html`)
- Public Safety & Emergency Services → `public-safety` → (pending page)
- Aerospace & Defense → `aerospace` → (pending page)
- Transportation & Logistics → `transportation` → `programs/transportation-logistics.html` (will rename to `transportation-logistics.html` or `transportation.html` after confirmation)
- Research & Development → `research-development` → (pending page)
- EdTech → `edtech` → (pending page)
- Biotech & Life Sciences → `biotech` → (pending page)
- Web Development & Software Engineering → `webdev` → (pending page)
- Government & Civic Technology → `govtech` → (pending page)
- Agriculture Technology → `agtech` → (pending page)

Pending confirmation:
- Short slugs above chosen to align with existing `program.html` card `data-sector` attributes and current file names where present.
- Pages marked “pending page” or rename will be normalized during rebuild (ensuring internal links + dataset sector keys match these slugs exactly).

Notes
- Each certification entry `sector` field will use the slug (e.g., `manufacturing`).
- If alternative slug schema (long-form vs short-form) is preferred, specify and a mass refactor script will adjust filenames, hrefs, and data keys.
