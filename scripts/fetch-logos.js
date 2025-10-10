#!/usr/bin/env node
/*
 Fetch official SVG logos from vendor brand pages (when publicly accessible) into
 assets/images/vendor-logos/_official-source/, then run npm run replace:logos.

 Usage:
 1) Edit assets/images/vendor-logos/sources.json and paste official SVG URLs.
 2) Run: npm run fetch:logos
 3) Then run: npm run logos (or npm run replace:logos && npm run check:logos)

 Notes:
 - Only use URLs that permit redistribution under the vendor's brand guidelines.
 - Some vendors require accepting terms or downloading ZIP archives manually. For those,
   download the SVG and place it into _official-source/ instead.
*/
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const targetDir = path.resolve(__dirname, '..', 'assets', 'images', 'vendor-logos');
const sourceDir = path.join(targetDir, '_official-source');
const sourcesFile = path.join(targetDir, 'sources.json');

function ensureDir(p){ if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function fetchToFile(fileUrl, dest){
  return new Promise((resolve, reject) => {
    const lib = fileUrl.startsWith('https') ? https : http;
    lib.get(fileUrl, { headers: { 'User-Agent': 'BTH-Education-Logo-Fetcher' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow one redirect
        return fetchToFile(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const ctype = (res.headers['content-type'] || '').toLowerCase();
        const trimmed = data.replace(/^\uFEFF/, '').trim(); // remove BOM
        const looksLikeSvg = /<svg[\s>]/i.test(trimmed) || /^<\?xml[^>]*>\s*<svg[\s>]/i.test(trimmed);
        if (!(ctype.includes('image/svg+xml') || looksLikeSvg)) return reject(new Error('Not an SVG response'));
        fs.writeFileSync(dest, data, 'utf8');
        resolve();
      });
    }).on('error', reject);
  });
}

async function main(){
  ensureDir(sourceDir);
  if (!fs.existsSync(sourcesFile)) {
    console.error('Missing sources.json. Create it at', sourcesFile);
    process.exit(1);
  }
  const map = JSON.parse(fs.readFileSync(sourcesFile, 'utf8'));
  const entries = Object.entries(map).filter(([,u]) => (typeof u === 'string' && u.trim()) || (Array.isArray(u) && u.length));
  if (!entries.length) {
    console.log('No sources provided in sources.json. Add official SVG URLs and re-run.');
    return;
  }
  let ok = 0, fail = [];
  for (const [fname, value] of entries) {
    const dest = path.join(sourceDir, fname);
    const candidates = Array.isArray(value) ? value : [value];
    let success = false, lastErr = null;
    for (const u of candidates) {
      try {
        await fetchToFile(u, dest);
        console.log('Fetched:', fname);
        ok++; success = true; break;
      } catch (e) { lastErr = e; }
    }
    if (!success) {
      console.error('Failed:', fname, '-', lastErr ? lastErr.message : 'No valid URL');
      fail.push(fname);
    }
  }
  console.log('\nFetch summary:');
  console.log(' - Downloaded:', ok);
  console.log(' - Failed:', fail.length);
  if (fail.length) fail.forEach(f => console.log('   *', f));
  console.log('\nNext: npm run logos');
}

main();
