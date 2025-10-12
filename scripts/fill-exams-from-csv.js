#!/usr/bin/env node
/*
 Fill exam codes from assets/data/reports/missing-exams.csv into vendor source files.
 - For each row with a non-empty suggested_exam, update the corresponding item in source_file.
 - Match by vendor+name (as in the CSV) and update the "exam" field.
 - After running, re-run merge + validate to propagate changes.
*/
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const csvPath = path.resolve(root, 'assets', 'data', 'reports', 'missing-exams.csv');

function parseCSV(text) {
  const rows = [];
  let field = '';
  let row = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { // escaped quote
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(field);
        field = '';
      } else if (ch === '\n' || ch === '\r') {
        if (field.length || row.length) {
          row.push(field);
          rows.push(row);
          row = [];
          field = '';
        }
        // swallow consecutive newlines
      } else {
        field += ch;
      }
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function run() {
  if (!fs.existsSync(csvPath)) {
    console.log('No CSV found at', path.relative(root, csvPath));
    process.exit(0);
  }
  const text = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCSV(text);
  if (!rows.length) { console.log('CSV is empty'); return; }
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
  const required = ['id', 'vendor', 'name', 'source_file', 'suggested_exam'];
  for (const r of required) if (!(r in idx)) {
    console.error('CSV missing column:', r); process.exit(1);
  }

  // Group updates by source file for fewer writes
  const updatesByFile = new Map();
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row.length) continue;
    const suggested = (row[idx['suggested_exam']] || '').trim();
    if (!suggested) continue; // only apply filled rows
    const vendor = (row[idx['vendor']] || '').replace(/^"|"$/g, '');
    const name = (row[idx['name']] || '').replace(/^"|"$/g, '');
    const srcRel = (row[idx['source_file']] || '').replace(/^"|"$/g, '');
    const srcPath = path.resolve(root, srcRel);
    if (!fs.existsSync(srcPath)) {
      console.warn('Source file not found for update:', srcRel);
      continue;
    }
    const arr = updatesByFile.get(srcPath) || [];
    arr.push({ vendor, name, exam: suggested });
    updatesByFile.set(srcPath, arr);
  }

  let filesUpdated = 0, itemsUpdated = 0, missingMatches = 0;
  for (const [filePath, updates] of updatesByFile.entries()) {
    let data;
    try { data = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch (e) {
      console.error('Failed to parse JSON:', path.relative(root, filePath), e.message);
      continue;
    }
    if (!Array.isArray(data)) {
      console.warn('Skipping non-array JSON:', path.relative(root, filePath));
      continue;
    }
    const key = (c) => `${(c.vendor||'').toLowerCase()}|${(c.name||'').toLowerCase()}`;
    const index = new Map(data.map((c, i) => [key(c), i]));
    let changed = false;
    for (const u of updates) {
      const k = `${u.vendor.toLowerCase()}|${u.name.toLowerCase()}`;
      const pos = index.get(k);
      if (typeof pos === 'number') {
        if (!data[pos].exam || data[pos].exam !== u.exam) {
          data[pos].exam = u.exam;
          changed = true;
          itemsUpdated++;
        }
      } else {
        console.warn('No match found in', path.relative(root, filePath), 'for', u.vendor, '|', u.name);
        missingMatches++;
      }
    }
    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      filesUpdated++;
      console.log('Updated', path.relative(root, filePath));
    }
  }
  console.log(`Done. Files updated: ${filesUpdated}, items updated: ${itemsUpdated}, missing matches: ${missingMatches}`);
}

run();
