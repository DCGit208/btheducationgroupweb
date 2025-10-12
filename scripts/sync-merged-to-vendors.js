#!/usr/bin/env node
/*
 Sync merged-only certifications back into per-vendor JSON files so all items
 are sourced from vendor files. This makes merges reproducible and reduces drift.

 Strategy:
 - Load merged dataset and vendor files.
 - Identify items present in merged but not in vendor JSONs (by vendor+name).
 - Group by vendor and append fields into the vendor's JSON file (create it if missing).
   Do not include id, url, or logo.
 - Optionally include extra fields from a safe whitelist (tracks, solution_area, time_estimate_months,
   vendor_stage, neutral, prereqTags, tags) to reduce UI inference.
 - Optional --augment: add missing whitelisted fields to existing vendor entries (no overwrite).
 - Sort entries by level then name for readability.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const mergedPath = path.join(root, 'assets', 'data', 'certifications.json');
const vendorsDir = path.join(root, 'assets', 'data', 'vendors');
const argv = process.argv.slice(2);
const INCLUDE_EXTRAS = argv.includes('--no-extras') ? false : true;
const AUGMENT_EXISTING = argv.includes('--augment');

const EXTRA_FIELDS = [
  'tracks',
  'solution_area',
  'time_estimate_months',
  'vendor_stage',
  'neutral',
  'prereqTags',
  'tags'
];

function readJson(p){ try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch(e){ return null; } }
function writeJson(p, data){ fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8'); }
function listVendorFiles(){ return fs.readdirSync(vendorsDir).filter(f=>f.endsWith('.json') && f!=='vendor-list.json'); }
function slugVendor(v){
  const map = {
    '(isc)²': 'isc2'
  };
  const key = String(v||'').toLowerCase().trim();
  if (map[key]) return map[key];
  return key
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/&/g,'and')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/-+/g,'-')
    .replace(/^-|-$/g,'');
}

const merged = readJson(mergedPath) || [];
if (!Array.isArray(merged) || merged.length===0) {
  console.error('Merged dataset missing or empty at', mergedPath);
  process.exit(1);
}

// Build vendor index from files
const vendorFileIndex = new Map(); // vendor name -> { path, arr, byKey }
for (const f of listVendorFiles()) {
  const p = path.join(vendorsDir, f);
  const arr = readJson(p) || [];
  const byKey = new Map(arr.map(c=>[`${(c.vendor||'').toLowerCase()}|${(c.name||'').toLowerCase()}`, c]));
  let vendorName = null;
  for (const c of arr) { if (c && c.vendor) { vendorName = c.vendor; break; } }
  if (!vendorName) {
    const base = path.basename(f, '.json');
    vendorName = base.replace(/-/g, ' ');
    vendorName = vendorName.replace(/\b(aws)\b/i, 'AWS');
  }
  vendorFileIndex.set(vendorName, { path: p, arr, byKey });
}

// Helper to get or create vendor file entry
function getVendorSink(vendor){
  // Try exact name match first
  if (vendorFileIndex.has(vendor)) return vendorFileIndex.get(vendor);
  // Try case-insensitive match
  for (const [k, v] of vendorFileIndex.entries()) {
    if (k.toLowerCase() === String(vendor||'').toLowerCase()) return v;
  }
  // Create new file
  const slug = slugVendor(vendor);
  const p = path.join(vendorsDir, `${slug}.json`);
  const obj = { path: p, arr: [], byKey: new Map() };
  vendorFileIndex.set(vendor, obj);
  return obj;
}

// Build current vendor keys
const currentVendorKeys = new Set();
for (const { byKey } of vendorFileIndex.values()) {
  for (const k of byKey.keys()) currentVendorKeys.add(k);
}

// Find merged-only items
const toAddByVendor = new Map();
for (const c of merged) {
  const key = `${(c.vendor||'').toLowerCase()}|${(c.name||'').toLowerCase()}`;
  if (!currentVendorKeys.has(key)) {
    const rec = {
      name: c.name,
      vendor: c.vendor,
      category: c.category,
      focus: c.focus,
      level: c.level,
      retired: !!c.retired,
      premium: !!c.premium,
      exam: c.exam || undefined
    };
    if (INCLUDE_EXTRAS) {
      for (const f of EXTRA_FIELDS) {
        const v = c[f];
        if (v === undefined || v === null) continue;
        if (Array.isArray(v) && v.length === 0) continue;
        rec[f] = v;
      }
    }
    if (!toAddByVendor.has(c.vendor)) toAddByVendor.set(c.vendor, []);
    toAddByVendor.get(c.vendor).push(rec);
  }
}

let vendorsTouched = 0;
let recordsAdded = 0;
let fieldsAugmented = 0;
for (const [vendor, items] of toAddByVendor.entries()) {
  const sink = getVendorSink(vendor);
  const before = sink.arr.length;
  for (const rec of items) {
    const key = `${(rec.vendor||'').toLowerCase()}|${(rec.name||'').toLowerCase()}`;
    if (!sink.byKey.has(key)) {
      sink.arr.push(rec);
      sink.byKey.set(key, rec);
      recordsAdded++;
    }
  }
  // Optional augment pass for existing entries (add missing extra fields only)
  if (AUGMENT_EXISTING && INCLUDE_EXTRAS) {
    for (const c of merged.filter(m=> (m.vendor||'').toLowerCase() === (vendor||'').toLowerCase())) {
      const k = `${(c.vendor||'').toLowerCase()}|${(c.name||'').toLowerCase()}`;
      const target = sink.byKey.get(k);
      if (!target) continue;
      for (const f of EXTRA_FIELDS) {
        if (target[f] !== undefined) continue; // do not overwrite
        const v = c[f];
        if (v === undefined || v === null) continue;
        if (Array.isArray(v) && v.length === 0) continue;
        target[f] = v;
        fieldsAugmented++;
      }
    }
  }
  // Sort for readability
  sink.arr.sort((a,b)=> (a.level - b.level) || String(a.name).localeCompare(b.name));
  // Ensure directory
  fs.mkdirSync(path.dirname(sink.path), { recursive: true });
  writeJson(sink.path, sink.arr);
  if (sink.arr.length !== before) vendorsTouched++;
  console.log(`Updated ${vendor}: +${sink.arr.length - before} items -> ${sink.arr.length}`);
}

console.log(`Sync complete. Vendors touched: ${vendorsTouched}, records added: ${recordsAdded}, fields augmented: ${fieldsAugmented}${AUGMENT_EXISTING?' (augment mode)':''}${INCLUDE_EXTRAS?' (with extras)':' (minimal)'}`);