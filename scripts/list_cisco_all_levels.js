const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'assets', 'data', 'certifications.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

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

const active = data.filter(c=>!c.retired && c.vendor === vendor);

for (let level = 1; level <= 5; level++) {
  console.log(`\n=== CISCO LEVEL ${level} ===`);
  
  const isFoundational = (c)=> /Fundamental|Foundational/i.test(String(c.vendor_stage || inferVendorStage(c)));
  const isAssociate = (c)=> /Associate/i.test(String(c.vendor_stage || inferVendorStage(c)));
  const isProfessional = (c)=> /Professional/i.test(String(c.vendor_stage || inferVendorStage(c)));
  const isExpert = (c)=> /Expert/i.test(String(c.vendor_stage || inferVendorStage(c)));
  
  const foundational = active.filter(c => isFoundational(c)).map(c=>c.name).sort();
  const associates = active.filter(c => isAssociate(c) && isLevelException(c, 1)).map(c=>c.name).sort();
  const professional = active.filter(c => isProfessional(c)).map(c=>c.name).sort();
  const expert = active.filter(c => isExpert(c)).map(c=>c.name).sort();
  
  console.log(`Foundational (${foundational.length}):`, foundational.slice(0, 5).join(', ') + (foundational.length > 5 ? '...' : ''));
  console.log(`Associates (${associates.length}):`, associates.join(', '));
  
  if (level >= 2) {
    console.log(`Professional (${professional.length}):`, professional.slice(0, 5).join(', ') + (professional.length > 5 ? '...' : ''));
  }
  
  if (level >= 3) {
    console.log(`Expert (${expert.length}):`, expert.slice(0, 5).join(', ') + (expert.length > 5 ? '...' : ''));
  }
  
  const total = foundational.length + 
                (level >= 1 ? Math.min(3, associates.length) : 0) +
                (level >= 2 ? professional.length : 0) +
                (level >= 3 ? expert.length : 0);
  console.log(`Expected Total Visible: ${total}`);
}
