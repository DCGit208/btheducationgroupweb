#!/usr/bin/env node
/*
 Compare merged certifications.json with per-vendor files to highlight any items
 that exist in the merged dataset but not in vendor JSONs (by vendor+name),
 and items in vendor JSONs that were dropped by merge (should be none).
 Useful to catch accidental manual edits in merged file and reconcile to sources.
*/
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const mergedPath = path.join(root, 'assets', 'data', 'certifications.json');
const vendorsDir = path.join(root, 'assets', 'data', 'vendors');

function readJson(p){ try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch(e){ return null; } }
function listVendorFiles(){ return fs.readdirSync(vendorsDir).filter(f=>f.endsWith('.json') && f!=='vendor-list.json'); }

const merged = readJson(mergedPath) || [];
const byKeyMerged = new Map(merged.map(c=>[`${(c.vendor||'').toLowerCase()}|${(c.name||'').toLowerCase()}`, c]));

const vendorItems = [];
for (const f of listVendorFiles()) {
  const arr = readJson(path.join(vendorsDir, f));
  if (Array.isArray(arr)) vendorItems.push(...arr);
}
const byKeyVendor = new Map(vendorItems.map(c=>[`${(c.vendor||'').toLowerCase()}|${(c.name||'').toLowerCase()}`, c]));

const inMergedOnly = [];
for (const [k, c] of byKeyMerged.entries()) {
  if (!byKeyVendor.has(k)) inMergedOnly.push({ vendor: c.vendor, name: c.name, level: c.level, category: c.category });
}
const inVendorOnly = [];
for (const [k, c] of byKeyVendor.entries()) {
  if (!byKeyMerged.has(k)) inVendorOnly.push({ vendor: c.vendor, name: c.name });
}

console.log('Reconcile Report');
console.log('Merged total:', merged.length, 'Vendor-sourced total:', vendorItems.length);
console.log('In merged only (not found in vendor files):', inMergedOnly.length);
for (const x of inMergedOnly.slice(0, 50)) console.log('-', x.vendor, ':', x.name, `(L${x.level}, ${x.category})`);
if (inMergedOnly.length > 50) console.log('...and', inMergedOnly.length-50, 'more');
console.log('In vendor only (not found after merge):', inVendorOnly.length);
for (const x of inVendorOnly.slice(0, 50)) console.log('-', x.vendor, ':', x.name);
