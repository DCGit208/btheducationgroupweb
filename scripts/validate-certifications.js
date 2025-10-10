#!/usr/bin/env node
/*
 Validates assets/data/certifications.json
 Checks: schema, enums, level range, duplicate ids, url format, category/focus presence
 Prints summary counts per vendor and level.
*/
const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', 'assets', 'data', 'certifications.json');
const schemaFile = path.resolve(__dirname, '..', 'assets', 'data', 'certifications.schema.json');
const badgeDir = path.resolve(__dirname, '..', 'assets', 'badges');
const allowedCategories = new Set([
  'core-it','cloud-platforms','cybersecurity','software-devops','governance-agile','specialized-tech','emerging-tech'
]);

function isHttpUrl(u){
  // Accept undefined/null (no-URL policy), empty string, or http(s) URLs
  return u == null || (typeof u === 'string' && (!u || /^https?:\/\//i.test(u)));
}

function validate() {
  const raw = fs.readFileSync(file, 'utf8');
  let data;
  try { data = JSON.parse(raw); } catch (e) { console.error('JSON parse error:', e.message); process.exit(1); }
  if (!Array.isArray(data)) { console.error('Top-level JSON must be an array.'); process.exit(1); }

  const ids = new Set();
  const errors = [];
  const vendorCounts = new Map();
  const levelCounts = new Map([[1,0],[2,0],[3,0],[4,0],[5,0]]);
  let missingExamCount = 0;

  data.forEach((c, idx) => {
    const ctx = `#${idx} (id=${c && c.id})`;
    if (typeof c.id !== 'number') errors.push(`${ctx} missing/invalid id`);
    if (ids.has(c.id)) errors.push(`${ctx} duplicate id`); else ids.add(c.id);
    if (typeof c.name !== 'string' || !c.name.trim()) errors.push(`${ctx} missing/invalid name`);
    if (typeof c.vendor !== 'string' || !c.vendor.trim()) errors.push(`${ctx} missing/invalid vendor`);
    if (!allowedCategories.has(c.category)) errors.push(`${ctx} category not in allowed set: ${c.category}`);
    if (typeof c.focus !== 'string' || !c.focus.trim()) errors.push(`${ctx} missing/invalid focus`);
    if (typeof c.level !== 'number' || c.level < 1 || c.level > 5) errors.push(`${ctx} level must be 1..5`);
    if (typeof c.retired !== 'boolean') errors.push(`${ctx} retired must be boolean`);
    if (typeof c.premium !== 'boolean') errors.push(`${ctx} premium must be boolean`);
  if (!isHttpUrl(c.url)) errors.push(`${ctx} url must be http(s) or empty`);
    if (c.logo && typeof c.logo !== 'string') errors.push(`${ctx} logo must be string when present`);
  if (!c.exam || !String(c.exam).trim()) missingExamCount++;

    vendorCounts.set(c.vendor, (vendorCounts.get(c.vendor)||0)+1);
    if (levelCounts.has(c.level)) levelCounts.set(c.level, levelCounts.get(c.level)+1);
  });

  // Optional JSON Schema validation (if schema exists and Ajv is available)
  let schemaErrors = [];
  try {
    if (fs.existsSync(schemaFile)) {
      // Lazy require Ajv only if present
      let Ajv;
      try { Ajv = require('ajv'); } catch (_) { Ajv = null; }
      if (Ajv) {
        const ajv = new Ajv({ allErrors: true, strict: false });
        try {
          const addFormats = require('ajv-formats');
          addFormats(ajv);
        } catch (_) { /* optional */ }
        const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
        const valid = ajv.validate(schema, data);
        if (!valid) schemaErrors = (ajv.errors || []).map(e => `schema: ${e.instancePath} ${e.message}`);
      }
    }
  } catch (e) {
    console.warn('Schema validation skipped:', e.message);
  }

  const allErrors = [...errors, ...schemaErrors];
  if (allErrors.length) {
    console.error('Validation FAILED with', allErrors.length, 'issues:');
    allErrors.slice(0, 100).forEach(e => console.error(' -', e));
    if (allErrors.length > 100) console.error(` ...and ${allErrors.length-100} more`);
    try { writeBadge('failing'); } catch (_) {}
    process.exit(2);
  }

  console.log('Validation PASSED');
  console.log('Total certifications:', data.length);
  console.log('Vendors:', vendorCounts.size);
  console.log('Counts by vendor (top 20):');
  [...vendorCounts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,20).forEach(([v,c])=>console.log(` - ${v}: ${c}`));
  console.log('Counts by level:');
  for (const [lvl, cnt] of levelCounts.entries()) console.log(` - L${lvl}: ${cnt}`);
  if (missingExamCount > 0) console.log('Missing exam codes:', missingExamCount);
  try { writeBadge('passing'); } catch (_) {}
}

validate();

function writeBadge(status) {
  if (!fs.existsSync(badgeDir)) fs.mkdirSync(badgeDir, { recursive: true });
  const passing = status === 'passing';
  const leftText = 'dataset';
  const rightText = passing ? 'healthy' : 'failing';
  const rightColor = passing ? '#2da44e' : '#d73a49';
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="140" height="20" role="img" aria-label="${leftText}: ${rightText}">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <mask id="m"><rect width="140" height="20" rx="3" fill="#fff"/></mask>
  <g mask="url(#m)">
    <rect width="70" height="20" fill="#555"/>
    <rect x="70" width="70" height="20" fill="${rightColor}"/>
    <rect width="140" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
    <text x="35" y="15">${leftText}</text>
    <text x="105" y="15">${rightText}</text>
  </g>
</svg>`;
  fs.writeFileSync(path.join(badgeDir, 'dataset-health.svg'), svg, 'utf8');
}
