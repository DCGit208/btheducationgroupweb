# btheducationgroupweb

The full website of BTH Education Group

Dataset health: ![dataset](assets/badges/dataset-health.svg)

Development notes:
- Certifications dataset: `assets/data/certifications.json`
- JSON Schema: `assets/data/certifications.schema.json`
- Validator: `scripts/validate-certifications.js`
- Run validator: npm run validate:data
- Reusable per-level filtering UX spec: `FILTERING_MODEL_SPEC.md`

Data pipeline scripts:
- Merge: npm run merge:data
- Validate: npm run validate:data
- Coverage: npm run coverage
- Reconcile: npm run reconcile
- Sync merged-only items back to vendor files: npm run sync:vendors
- One-shot sync and checks: npm run sync:all

UI ranking note:
- Added a small surfacing boost for Microsoft Security (Defender) and Fortinet Security (ZTNA/SASE/Email/Web) items when Recommended is enabled.
