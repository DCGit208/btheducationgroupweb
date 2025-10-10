const fs = require('fs');
const path = require('path');

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

function getVendorLogoMap(html) {
  const start = html.indexOf('const vendorLogoMap = {');
  if (start < 0) return new Map();
  const end = html.indexOf('};', start);
  const block = html.substring(start, end + 2);
  const entries = [...block.matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)].map(m => [m[1], m[2]]);
  return new Map(entries);
}

(function main(){
  const root = process.cwd();
  const dataPath = path.join(root, 'assets/data/certifications.json');
  const htmlPath = path.join(root, 'programs/informationtechnology.html');
  const logosDir = path.join(root, 'assets/images/vendor-logos');

  const data = readJson(dataPath);
  const html = fs.readFileSync(htmlPath, 'utf8');
  const map = getVendorLogoMap(html);
  const mapKeys = Array.from(map.keys());

  const vendors = Array.from(new Set(data.map(x => x.vendor).filter(Boolean))).sort();
  const files = new Set(fs.readdirSync(logosDir));

  const missingMap = vendors.filter(v => !mapKeys.includes(v));
  const mappedButMissing = [];
  for (const [vendor, p] of map.entries()) {
    const rel = String(p).replace(/^\.\/+/, '');
    const fname = path.basename(rel);
    if (!files.has(fname)) mappedButMissing.push({ vendor, path: p, fname });
  }

  const unsafeLogos = data
    .filter(x => x.logo && /^https?:\/\//i.test(String(x.logo)))
    .map(x => ({ vendor: x.vendor, logo: x.logo, name: x.name }))
    .slice(0, 50);

  const result = {
    vendorsCount: vendors.length,
    mapKeysCount: mapKeys.length,
    missingMap,
    missingMapCount: missingMap.length,
    mappedButMissing,
    mappedButMissingCount: mappedButMissing.length,
    unsafeLogoCount: unsafeLogos.length,
    sampleUnsafe: unsafeLogos.slice(0, 5)
  };

  console.log(JSON.stringify(result, null, 2));
})();
