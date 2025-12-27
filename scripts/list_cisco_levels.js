const fs = require('fs');
const path = require('path');

// Load dataset
const dataPath = path.join(__dirname, '..', 'assets', 'data', 'certifications.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Emulate page defaults
const strictChronology = true;
const vendor = 'Cisco';
const category = '';
const focus = '';
const tracks = [];
const vendorArea = '';
const partnership = '';
const search = '';

const selectedByLevel = { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set(), 5: new Set() };
function getCumulativeSelection(l){ const ids = new Set(); for (let i=1; i<=l; i++){ if (selectedByLevel[i]) selectedByLevel[i].forEach(id=>ids.add(id)); } return ids; }
function matchesException(cert) {
  if (!cert) return null;
  const v = String(cert.vendor||'');
  const nm = String(cert.name||'');
  const ex = String(cert.exam||'');
  // Matches Level 1 Cisco associate starters in the app
  const rule = { vendor: 'Cisco', examRegex: /(200-301|200-201|200-901)|\bCCNA\b|CYBEROPS|CBROPS|DEVASC/i, allowAtLevels: [1] };
  if (rule.vendor && rule.vendor !== v) return null;
  if (rule.examRegex && !(rule.examRegex.test(nm) || rule.examRegex.test(ex))) return null;
  return rule;
}
function isLevelException(cert, lvl){ const r = matchesException(cert); if (!r) return false; if (!Array.isArray(r.allowAtLevels)) return false; return r.allowAtLevels.includes(lvl); }

function inferVendorStage(c){
  const n = String((c.name||c)||'');
  // Cisco acronyms
  if (/(\bCCST\b|\bCCT\b|Certified Support Technician|Certified Technician)\b/i.test(n)) return 'Foundational';
  if (/(\bCCNA\b|CyberOps Associate|DevNet Associate)\b/i.test(n)) return 'Associate';
  if (/(\bCCNP\b|DevNet Professional)\b/i.test(n)) return 'Professional';
  if (/(\bCCIE\b|\bCCDE\b|DevNet Expert)\b/i.test(n)) return 'Expert';
  // Generic
  if (/Fundamental|Foundational|Foundation|Cloud Practitioner|AI Practitioner/i.test(n)) return 'Foundational';
  if (/(Associate|Administrator|Developer)\b/i.test(n)) return 'Associate';
  if (/Professional/i.test(n)) return 'Professional';
  if (/(Specialty|Specialist)\b/i.test(n)) return 'Specialty';
  if (/(Expert|Architect)\b/i.test(n)) return 'Expert';
  return null;
}

function buildFiltered(level){
  const prior = level ? getCumulativeSelection(level-1) : new Set();
  const active = data.filter(c=>!c.retired);
  function inLevelWindow(cert){
    if (isLevelException(cert, level)) return true;
    if (!Array.isArray(cert.level_range) || cert.level_range.length !== 2) return true;
    const [minL/*, maxL*/] = cert.level_range;
    if (!level) return true;
    return level >= minL;
  }
  function stageFitsLevel(cert){
    if (!level) return true;
    const st = cert.vendor_stage || inferVendorStage(cert);
    if (!st) return true;
    if (level === 1) return /Fundamental|Foundational/i.test(st);
    if (level === 2) return /Fundamental|Foundational|Associate|Administrator|Developer/i.test(st);
    if (level === 3) return /Fundamental|Foundational|Associate|Administrator|Developer|Professional|Expert|Specialty|Architect/i.test(st);
    if (level >= 4) return /Fundamental|Foundational|Associate|Administrator|Developer|Professional|Expert|Specialty|Architect/i.test(st);
    return true;
  }
  function prereqsMet(cert){
    const reqs = cert.prereqTags || [];
    if (!reqs.length) return true;
    const priorCerts = data.filter(c=>prior.has(c.id));
    const priorTags = new Set([].concat(...priorCerts.map(c=>c.tags||[])));
    return reqs.every(r=>priorTags.has(r));
  }

  let filtered = active.filter(cert => {
    if (cert.retired) return false;
    if (level && strictChronology && !inLevelWindow(cert)) return false;
    if (category && cert.category !== category) return false;
    if (focus && cert.focus !== focus) return false;
    if (tracks.length > 0) {
      const ct = Array.isArray(cert.tracks) ? cert.tracks : [];
      if (!ct.some(t => tracks.includes(t))) return false;
    }
    if (vendor && cert.vendor !== vendor) return false;
    if (vendor && vendorArea) {
      const areas = Array.isArray(cert.vendor_area) ? cert.vendor_area : (cert.vendor_area ? [cert.vendor_area] : (cert.vendor==='Microsoft' && cert.solution_area ? [cert.solution_area] : []));
      if (!areas.includes(vendorArea)) return false;
    }
    if (partnership === 'premium' && !cert.premium) return false;
    if (partnership === 'standard' && cert.premium) return false;
    if (search && !(String(cert.name).toLowerCase().includes(search) || String(cert.vendor).toLowerCase().includes(search) || String(cert.focus).toLowerCase().includes(search))) return false;
    if (strictChronology && level && !prereqsMet(cert) && !isLevelException(cert, level)) return false;
    if (strictChronology && level && !stageFitsLevel(cert) && !isLevelException(cert, level)) return false;
    return true;
  });

  const names = filtered.map(c=>c.name).sort((a,b)=>a.localeCompare(b));
  return { count: names.length, names };
}

const output = {};
for (let lvl=1; lvl<=5; lvl++) {
  output[lvl] = buildFiltered(lvl);
}
console.log(JSON.stringify(output, null, 2));
