#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataFile = path.resolve(root, 'assets', 'data', 'certifications.json');
const vendorsListFile = path.resolve(root, 'assets', 'data', 'vendors', 'vendor-list.json');

function readJson(p){ try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } }

const data = readJson(dataFile) || [];
const wanted = (readJson(vendorsListFile) || []).map(v => typeof v === 'string' ? v : v.name).filter(Boolean);

const byVendor = new Map();
for (const c of data) {
  const v = c.vendor || 'Unknown';
  const e = byVendor.get(v) || { count: 0, levels: new Set(), categories: new Set() };
  e.count++;
  if (typeof c.level !== 'undefined') e.levels.add(String(c.level));
  if (c.category) e.categories.add(c.category);
  byVendor.set(v, e);
}

const rows = [];
const seenVendorNames = new Set(Array.from(byVendor.keys()));
for (const v of (wanted.length ? wanted : Array.from(seenVendorNames))) {
  const e = byVendor.get(v) || { count: 0, levels: new Set(), categories: new Set() };
  rows.push({ vendor: v, count: e.count, levels: Array.from(e.levels).sort(), categories: Array.from(e.categories).sort() });
}

rows.sort((a,b)=> b.count - a.count || a.vendor.localeCompare(b.vendor));

const total = data.length;
const withZero = rows.filter(r=>r.count===0).map(r=>r.vendor);

console.log(`Total certifications: ${total}`);
console.log(`Vendors tracked: ${rows.length}`);
console.log('--- Coverage by vendor (top 30) ---');
for (const r of rows.slice(0, 30)) {
  console.log(`${r.vendor.padEnd(24)}  ${String(r.count).padStart(4)}  levels:[${r.levels.join(',')}] categories:[${r.categories.length}]`);
}
if (rows.length > 30) console.log(`...and ${rows.length - 30} more`);
if (withZero.length) {
  console.log('\nVendors with zero items (need data):');
  console.log(withZero.join(', '));
}

// Optional: warn if any url snuck back in
const anyUrl = data.some(x => Object.prototype.hasOwnProperty.call(x, 'url'));
if (anyUrl) {
  console.warn('\nWARNING: url fields found in dataset (should be overlay-only).');
}
