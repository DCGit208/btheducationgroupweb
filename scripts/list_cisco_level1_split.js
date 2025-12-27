const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'assets', 'data', 'certifications.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const level = 1;
const strictChronology = true;
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
  if (/Fundamental|Foundational|Foundation|Cloud Practitioner|AI Practitioner/i.test(n)) return 'Foundational';
  if (/(Associate|Administrator|Developer)\b/i.test(n)) return 'Associate';
  if (/Professional/i.test(n)) return 'Professional';
  if (/(Specialty|Specialist)\b/i.test(n)) return 'Specialty';
  if (/(Expert|Architect)\b/i.test(n)) return 'Expert';
  return null;
}

function inLevelWindow(cert){
  if (isLevelException(cert, level)) return true;
  if (!Array.isArray(cert.level_range) || cert.level_range.length !== 2) return true;
  const [minL] = cert.level_range;
  return level >= minL;
}
function stageFitsLevel(cert){
  const st = cert.vendor_stage || inferVendorStage(cert);
  if (!st) return true;
  if (level === 1) return /Fundamental|Foundational/i.test(st);
  return true;
}

const active = data.filter(c=>!c.retired);
let filtered = active.filter(cert => {
  if (cert.vendor !== vendor) return false;
  if (strictChronology && level && !inLevelWindow(cert)) return false;
  if (strictChronology && level && !stageFitsLevel(cert) && !isLevelException(cert, level)) return false;
  return true;
});

const foundational = [];
const associates = [];
for (const c of filtered) {
  const st = c.vendor_stage || inferVendorStage(c);
  if (/Fundamental|Foundational/i.test(String(st||''))) foundational.push(c.name);
  else if (/Associate|Administrator|Developer/i.test(String(st||'')) || isLevelException(c, 1)) associates.push(c.name);
}
foundational.sort((a,b)=>a.localeCompare(b));
associates.sort((a,b)=>a.localeCompare(b));

console.log(JSON.stringify({ foundational, associates }, null, 2));
