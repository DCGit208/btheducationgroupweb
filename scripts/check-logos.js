#!/usr/bin/env node
/*
 Simple logo checker: lists placeholder-like SVGs and missing logos referenced in dataset.
*/
const fs = require('fs');
const path = require('path');

const logosDir = path.resolve(__dirname, '..', 'assets', 'images', 'vendor-logos');
const dataFile = path.resolve(__dirname, '..', 'assets', 'data', 'certifications.json');
const licenseFile = path.join(logosDir, 'licenses.json');

function isPlaceholder(svgContent){
  const t = svgContent.toLowerCase();
  // Flag only if contains a <text> element and placeholder-like wording
  if (!t.includes('<text')) return false;
  const cues = ['placeholder', 'your logo', 'logo here'];
  return cues.some(w => t.includes(w));
}

function main(){
  const raw = fs.readFileSync(dataFile, 'utf8');
  const data = JSON.parse(raw);
  const referenced = new Set();
  data.forEach(c => { if (c.logo && typeof c.logo === 'string') referenced.add(path.basename(c.logo)); });

  const files = fs.readdirSync(logosDir).filter(f => f.endsWith('.svg'));
  const missing = [];
  const placeholders = [];
  const license = fs.existsSync(licenseFile) ? JSON.parse(fs.readFileSync(licenseFile, 'utf8')) : {};
  const unlicensed = [];

  referenced.forEach(file => {
    const p = path.join(logosDir, file);
    if (!fs.existsSync(p)) { missing.push(file); return; }
    try {
      const content = fs.readFileSync(p, 'utf8');
      if (isPlaceholder(content)) placeholders.push(file);
      // If referenced and no license entry present, flag it
      if (!license[file]) unlicensed.push(file);
    } catch(_){ /* ignore */ }
  });

  console.log('Logo check summary:');
  console.log(' - Referenced logos:', referenced.size);
  console.log(' - Existing SVG files:', files.length);
  console.log(' - Missing logo files:', missing.length);
  if (missing.length) missing.forEach(m => console.log('   *', m));
  console.log(' - Suspected placeholders:', placeholders.length);
  if (placeholders.length) placeholders.forEach(p => console.log('   *', p));
  console.log(' - Missing license records:', unlicensed.length);
  if (unlicensed.length) unlicensed.forEach(u => console.log('   *', u));
  if (unlicensed.length) console.log('\nHint: add entries to assets/images/vendor-logos/licenses.json to document usage authorization.');
}

main();
