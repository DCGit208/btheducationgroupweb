#!/usr/bin/env node
/*
 Ingest official vendor SVG logos to replace placeholders safely.
 1) Place official SVGs under assets/images/vendor-logos/_official-source/ with the exact filenames listed below.
 2) Run: npm run replace:logos
 3) The script will copy, optimize, and report status.
*/
const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');

const root = path.resolve(__dirname, '..');
const targetDir = path.join(root, 'assets', 'images', 'vendor-logos');
const sourceDir = path.join(targetDir, '_official-source');

// Placeholders flagged by the checker; replace these when you add official assets
const placeholderFiles = [
  'cisco.svg','isc2.svg','pmi.svg','peoplecert.svg','vmware.svg','googlecloud.svg','isaca.svg','giac.svg','iapp.svg','csa.svg','redhat.svg','linuxfoundation.svg','netapp.svg','veeam.svg','splunk.svg','citrix.svg','juniper.svg','suse.svg','fortinet.svg','oracle.svg','nokia.svg','unity.svg'
];

// Conservative SVGO settings to preserve viewBox and visual fidelity
const svgoConfig = {
  multipass: true,
  plugins: [
    { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
    { name: 'removeDimensions', active: true }
  ]
};

function ensureDirs(){
  if (!fs.existsSync(sourceDir)) fs.mkdirSync(sourceDir, { recursive: true });
}

function copyAndOptimize(src, dest){
  const raw = fs.readFileSync(src, 'utf8');
  const svg = raw.replace(/^\uFEFF/, '').trim();
  // Accept XML prolog or DOCTYPE before <svg>
  const looksLikeSvg = /<svg[\s>]/i.test(svg) || /^<\?xml[^>]*>\s*<svg[\s>]/i.test(svg) || /<!DOCTYPE svg[^>]*>\s*<svg[\s>]/i.test(svg);
  if (!looksLikeSvg) throw new Error('Not an SVG file');
  const result = optimize(svg, { path: src, ...svgoConfig });
  fs.writeFileSync(dest, result.data, 'utf8');
}

function main(){
  ensureDirs();
  let copied = 0, pending = [];
  placeholderFiles.forEach(fname => {
    const src = path.join(sourceDir, fname);
    const dest = path.join(targetDir, fname);
    if (fs.existsSync(src)) {
      try {
        copyAndOptimize(src, dest);
        copied++;
        console.log('Replaced:', fname);
      } catch (e) {
        console.error('Failed to process', fname, '-', e.message);
      }
    } else {
      pending.push(fname);
    }
  });

  console.log('\nIngest summary:');
  console.log(' - Replaced:', copied);
  console.log(' - Still pending:', pending.length);
  if (pending.length) {
    console.log('   Provide official SVGs for:');
    pending.forEach(f => console.log('   *', f));
  }
}

main();
