const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'assets', 'data', 'certifications.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const level = 2;
const vendor = 'Cisco';

function matchesException(cert) {
  if (!cert) return null;
  const v = String(cert.vendor||'');
  const nm = String(cert.name||'');
  const ex = String(cert.exam||'');
  const rules = [
    { vendor: 'Cisco', examRegex: /(200-301|200-201|200-901)|\bCCNA\b|CYBEROPS|CBROPS|DEVASC|DevNet Associate/i, allowAtLevels: [1] }
  ];
  for (const rule of rules) {
    if (rule.vendor && rule.vendor !== v) continue;
    if (rule.examRegex && !(rule.examRegex.test(nm) || rule.examRegex.test(ex))) continue;
    return rule;
  }
  return null;
}
function isLevelException(cert, lvl){ const r=matchesException(cert); return !!(r && Array.isArray(r.allowAtLevels) && r.allowAtLevels.includes(lvl)); }

function inferVendorStage(c){
  const n = String((c.name||c)||'');
  if (/(\bCCST\b|\bCCT\b|Certified Support Technician|Certified Technician)\b/i.test(n)) return 'Foundational';
  if (/(\bCCNA\b|CyberOps Associate|DevNet Associate)\b/i.test(n)) return 'Associate';
  if (/(\bCCNP\b|DevNet Professional)\b/i.test(n)) return 'Professional';
  if (/(\bCCIE\b|\bCCDE\b|DevNet Expert)\b/i.test(n)) return 'Expert';
  if (/Fundamental|Foundational|Foundation/i.test(n)) return 'Foundational';
  if (/(Associate|Administrator|Developer)\b/i.test(n)) return 'Associate';
  if (/Professional/i.test(n)) return 'Professional';
  if (/(Specialty|Specialist)\b/i.test(n)) return 'Specialty';
  if (/(Expert|Architect)\b/i.test(n)) return 'Expert';
  return null;
}

function inLevelWindow(cert){
  if (isLevelException(cert, 1)) return true;
  if (!Array.isArray(cert.level_range) || cert.level_range.length !== 2) return true;
  const [minL] = cert.level_range;
  return level >= minL;
}

const active = data.filter(c=>!c.retired && c.vendor === vendor);

const isFoundational = (c)=> /Fundamental|Foundational/i.test(String(c.vendor_stage || inferVendorStage(c)));
const isAssociate = (c)=> /Associate/i.test(String(c.vendor_stage || inferVendorStage(c)));
const isProfessional = (c)=> /Professional/i.test(String(c.vendor_stage || inferVendorStage(c)));

const out = [];
const seen = new Set();

// 1. Foundations
const foundational = active.filter(c => isFoundational(c));
foundational.sort((a,b)=>a.name.localeCompare(b.name));
for (const c of foundational) {
  if (!seen.has(c.id)) { seen.add(c.id); out.push(c); }
}

// 2. Associates (L1 exceptions)
const associates = active.filter(c => isAssociate(c) && isLevelException(c, 1));
associates.sort((a,b)=>a.name.localeCompare(b.name));
for (const c of associates) {
  if (!seen.has(c.id)) { seen.add(c.id); out.push(c); }
}

// 3. Professional (L3+ only, NOT L2)
if (level >= 3) {
  const professional = active.filter(c => {
    if (seen.has(c.id)) return false;
    if (!isProfessional(c)) return false;
    if (!inLevelWindow(c)) return false;
    return true;
  });
  professional.sort((a,b)=>a.name.localeCompare(b.name));
  for (const c of professional) {
    if (!seen.has(c.id)) { seen.add(c.id); out.push(c); }
  }
}

const grouped = { foundational: [], associates: [], professional: [] };
for (const c of out) {
  const st = c.vendor_stage || inferVendorStage(c);
  if (/Fundamental|Foundational/i.test(String(st||''))) grouped.foundational.push(c.name);
  else if (/Associate/i.test(String(st||''))) grouped.associates.push(c.name);
  else if (/Professional/i.test(String(st||''))) grouped.professional.push(c.name);
}

console.log('\nCisco Level 2 Certifications (' + out.length + ' total):\n');
console.log('='.repeat(60));
console.log('\n🔹 FOUNDATIONAL (' + grouped.foundational.length + '):');
grouped.foundational.forEach((name, i) => console.log('  ' + (i+1) + '. ' + name));
console.log('\n🔹 ASSOCIATES (' + grouped.associates.length + '):');
grouped.associates.forEach((name, i) => console.log('  ' + (i+1) + '. ' + name));
console.log('\n🔹 PROFESSIONAL (' + grouped.professional.length + '):');
grouped.professional.forEach((name, i) => console.log('  ' + (i+1) + '. ' + name));
console.log('\n' + '='.repeat(60));
console.log('Total: ' + out.length + ' certifications at Cisco Level 2');
console.log('(Cumulative: L1 Foundational + L1 Associates + L2 Professional)\n');
