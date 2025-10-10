// Simple generator to create ~350+ certifications across 39 vendors, distributed over levels 1-5
// Run with: node scripts/generate-certifications.js > assets/data/certifications.json

const vendors = [
  'CompTIA','Cisco','Juniper','Aruba','CWNP','Nokia','Huawei','ZTE','Fortinet',
  'AWS','Microsoft','Google Cloud','Red Hat','SUSE','VMware/Omnissa','Snowflake','MongoDB','NetApp','Oracle',
  '(ISC)²','ISACA','EC-Council','GIAC','IAPP','CSA','PeopleCert','PMI','Scrum Alliance','Veeam','Splunk','Citrix','Teradata','ForgeRock','ETA International','Linux Foundation','Unity','NVIDIA','Zend','Qt','CNCF'
];

// Focus areas by category
const categories = [
  { key: 'core-it', focus: ['Foundations','Enterprise R&S','Wireless'] },
  { key: 'cloud-platforms', focus: ['Public Cloud','Virtualization','Data Platforms'] },
  { key: 'cybersecurity', focus: ['Blue Team','Offensive Security','GRC & Audit','Privacy','Cloud Security'] },
  { key: 'software-devops', focus: ['Programming','DevOps','Kubernetes','Databases','Application Platforms'] },
  { key: 'governance-agile', focus: ['Service Management','Project/Program/Portfolio','Agile Frameworks'] },
  { key: 'specialized-tech', focus: ['Storage & Data Protection','Observability & SIEM','Virtualization & EUC','Identity','Electronics'] },
  { key: 'emerging-tech', focus: ['AI & ML','AR/VR & Metaverse'] }
];

// Create a consistent palette of names by level
const levelNames = {
  1: ['Foundations','Associate Foundations','Essentials'],
  2: ['Associate','Administrator','Practitioner'],
  3: ['Professional','Specialist','Advanced'],
  4: ['Expert','Lead','Architect'],
  5: ['Master','Principal','Distinguished']
};

let id = 1;
const results = [];

// Strategy: ~9 certs per vendor x ~39 vendors = ~351
// For each vendor, create 2 at level 1, 2 at level 2, 2 at level 3, 2 at level 4, 1 at level 5
// Spread across categories/focus areas in a round-robin to keep variety

function pickCategory(idx) {
  return categories[idx % categories.length];
}

function pickFocus(cat, idx) {
  return cat.focus[idx % cat.focus.length];
}

vendors.forEach((vendor, vIdx) => {
  const perVendor = [1,1,2,2,2,2,3,4,5]; // 9 entries, mid ones repeated for variety
  perVendor.forEach((level, i) => {
    const cat = pickCategory(vIdx + i);
    const focus = pickFocus(cat, vIdx + i);
    const nameRoot = levelNames[level][(vIdx + i) % levelNames[level].length];
    const name = `${vendor} ${nameRoot}`;

    results.push({
      id: id++,
      name,
      vendor,
      category: cat.key,
      focus,
      level,
      retired: false,
      premium: ['CompTIA','AWS','Microsoft','Cisco','(ISC)²','PMI','PeopleCert','VMware/Omnissa'].includes(vendor),
      exam: '',
      logo: ''
    });
  });
});

console.log(JSON.stringify(results, null, 2));
