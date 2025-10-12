#!/usr/bin/env node
/*
 Report certifications missing exam codes.
 - Reads merged dataset: assets/data/certifications.json
 - Groups by vendor and prints a summary
 - Tries to locate source vendor file by matching vendor+name in assets/data/vendors/*.json
 - Writes a CSV at assets/data/reports/missing-exams.csv for quick bulk updates
*/
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataFile = path.resolve(root, 'assets', 'data', 'certifications.json');
const vendorsDir = path.resolve(root, 'assets', 'data', 'vendors');
const reportDir = path.resolve(root, 'assets', 'data', 'reports');

function readJson(p){ try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } }

function listVendorFiles(){
  if (!fs.existsSync(vendorsDir)) return [];
  return fs.readdirSync(vendorsDir).filter(f => f.endsWith('.json'));
}

const data = readJson(dataFile) || [];
const key = (c) => `${(c.vendor||'').toLowerCase()}|${(c.name||'').toLowerCase()}`;

// Build reverse index to locate which vendor file likely contains an item
const fileIndex = new Map(); // key -> file path
for (const fname of listVendorFiles()) {
  const p = path.join(vendorsDir, fname);
  const arr = readJson(p);
  if (!Array.isArray(arr)) continue;
  for (const c of arr) {
    fileIndex.set(key(c), p);
  }
}

const missing = data.filter(c => !c.exam || !String(c.exam).trim());
const byVendor = new Map();
for (const c of missing) {
  const v = c.vendor || 'Unknown';
  const e = byVendor.get(v) || [];
  e.push(c);
  byVendor.set(v, e);
}

console.log(`Missing exam codes: ${missing.length}`);
console.log('Top vendors with missing exams (up to 20):');
[...byVendor.entries()].sort((a,b)=>b[1].length - a[1].length).slice(0,20).forEach(([v, arr])=>{
  console.log(` - ${v}: ${arr.length}`);
});

// Prepare CSV output
if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
const outCsv = [
  'id,vendor,name,level,category,focus,source_file,suggested_exam'
];
for (const c of missing) {
  const src = fileIndex.get(key(c)) || 'assets/data/certifications.json';
  const row = [
    c.id,
    JSON.stringify(c.vendor || ''),
    JSON.stringify(c.name || ''),
    c.level || '',
    JSON.stringify(c.category || ''),
    JSON.stringify(c.focus || ''),
    JSON.stringify(path.relative(root, src)),
    ''
  ].join(',');
  outCsv.push(row);
}
const csvPath = path.join(reportDir, 'missing-exams.csv');
fs.writeFileSync(csvPath, outCsv.join('\n') + '\n', 'utf8');
console.log(`\nCSV written to: ${path.relative(root, csvPath)}`);
