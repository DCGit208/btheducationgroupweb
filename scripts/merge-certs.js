#!/usr/bin/env node
/*
 Merge per-vendor certification files into assets/data/certifications.json
 - Reads existing certifications.json as base
 - Merges all JSON arrays from assets/data/vendors/*.json (excluding vendor-list.json)
 - Deduplicates by id, and by (vendor+name) if id missing; vendor files override base on conflicts
 - Fills defaults and generates ids when missing
*/
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const baseFile = path.resolve(root, 'assets', 'data', 'certifications.json');
const vendorsDir = path.resolve(root, 'assets', 'data', 'vendors');

function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return null; }
}
function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
function listVendorFiles() {
  if (!fs.existsSync(vendorsDir)) return [];
  return fs.readdirSync(vendorsDir)
    .filter(f => f.endsWith('.json') && f !== 'vendor-list.json');
}
function hashId(str) { // simple FNV-1a like hash to 32-bit unsigned
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0);
}
function normalizeItem(c) {
  const out = { ...c };
  if (!out.name || !out.vendor) return null;
  if (typeof out.level !== 'number') out.level = Number(out.level || 1);
  if (typeof out.retired !== 'boolean') out.retired = !!out.retired;
  if (typeof out.premium !== 'boolean') out.premium = !!out.premium;
  // Normalize category to canonical set
  const cat = String(out.category || '').toLowerCase().trim();
  switch (cat) {
    case 'networking':
      out.category = 'core-it'; break;
    case 'cloud':
      out.category = 'cloud-platforms'; break;
    case 'security':
      out.category = 'cybersecurity'; break;
    case 'it-service-management':
      out.category = 'governance-agile'; break;
    case 'data-analytics':
    case 'data-storage':
      out.category = 'specialized-tech'; break;
    case 'core-it':
    case 'cloud-platforms':
    case 'cybersecurity':
    case 'software-devops':
    case 'governance-agile':
    case 'specialized-tech':
    case 'emerging-tech':
      out.category = cat; break;
    default:
      out.category = cat || 'core-it'; // default fallback
  }
  out.focus = out.focus || '';
  // Light vendor intelligence at merge time (UI does richer inference)
  const nm = String(out.name || '');
  if (out.vendor === 'Huawei') {
    if (!out.vendor_area) {
      if (/Datacom/i.test(nm)) out.vendor_area = 'Datacom';
      else if (/Security/i.test(nm)) out.vendor_area = 'Security';
      else if (/Cloud Service/i.test(nm)) out.vendor_area = 'Cloud Service';
      else if (/5G|Carrier/i.test(nm)) out.vendor_area = '5G/Carrier';
    }
    if (!out.vendor_stage) {
      if (/HCIA|Associate/i.test(nm)) out.vendor_stage = 'Associate';
      else if (/HCIP|Professional/i.test(nm)) out.vendor_stage = 'Professional';
      else if (/HCIE|Expert/i.test(nm)) out.vendor_stage = 'Expert';
    }
  }
  if (out.vendor === 'ZTE') {
    if (!out.vendor_area) {
      if (/5G|Carrier/i.test(nm)) out.vendor_area = '5G/Carrier'; else out.vendor_area = 'Networking';
    }
    if (!out.vendor_stage) {
      if (/ZCNE|Engineer/i.test(nm)) out.vendor_stage = 'Associate';
      else if (/ZCNP|Professional/i.test(nm)) out.vendor_stage = 'Professional';
      else if (/ZCIE|Expert/i.test(nm)) out.vendor_stage = 'Expert';
    }
  }
  // Drop external URLs from merged dataset (overlays in UI provide descriptions)
  if (typeof out.url !== 'undefined') delete out.url;
  if (!out.id) {
    out.id = 5_000_000 + hashId(`${out.vendor}|${out.name}`);
  }
  return out;
}

function merge() {
  if (!fs.existsSync(baseFile)) {
    console.error('Base dataset not found at', baseFile);
    process.exit(1);
  }
  const base = readJson(baseFile);
  if (!Array.isArray(base)) {
    console.error('Base dataset is not an array');
    process.exit(1);
  }
  const byId = new Map();
  const byKey = new Map(); // vendor|name
  let added = 0, replaced = 0, skipped = 0;

  for (const c of base) {
    const item = normalizeItem(c);
    if (!item) { skipped++; continue; }
    byId.set(item.id, item);
    byKey.set(`${item.vendor}|${item.name}`.toLowerCase(), item);
  }

  const files = listVendorFiles();
  for (const f of files) {
    const p = path.join(vendorsDir, f);
    const arr = readJson(p);
    if (!Array.isArray(arr)) continue;
    for (const c of arr) {
      const item = normalizeItem(c);
      if (!item) { skipped++; continue; }
      const key = `${item.vendor}|${item.name}`.toLowerCase();
      const prevById = byId.get(item.id);
      const prevByKey = byKey.get(key);
      if (prevById) { byId.set(item.id, item); replaced++; continue; }
      if (prevByKey) {
        // prefer vendor file item; replace map entries consistently
        byId.delete(prevByKey.id);
        byKey.set(key, item);
        byId.set(item.id, item);
        replaced++;
        continue;
      }
      byId.set(item.id, item);
      byKey.set(key, item);
      added++;
    }
  }

  const merged = Array.from(byId.values())
    .sort((a,b)=> a.vendor.localeCompare(b.vendor) || (a.level - b.level) || a.name.localeCompare(b.name));
  writeJson(baseFile, merged);
  console.log(`Merge complete: total=${merged.length}, added=${added}, replaced=${replaced}, skipped=${skipped}`);
}

merge();
