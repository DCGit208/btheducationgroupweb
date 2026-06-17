#!/usr/bin/env node
/** Seed sample pending operators + initial econometric events for demo. */
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));
const credPath = join(__dirname, 'gois-steward-credentials.local.txt');

const firebaseConfig = {
  apiKey: 'AIzaSyBILoK6tV9kFK7_6p2v2xRaEsgRTQgNHFg',
  authDomain: 'bth-gwix-operator-network.firebaseapp.com',
  projectId: 'bth-gwix-operator-network',
  storageBucket: 'bth-gwix-operator-network.firebasestorage.app',
  messagingSenderId: '279857746150',
  appId: '1:279857746150:web:3e5102056f09e4bdbfeb27'
};

function parseCreds() {
  if (!existsSync(credPath)) throw new Error('Missing ' + credPath);
  var text = readFileSync(credPath, 'utf8');
  var email = (text.match(/Email: (.+)/) || [])[1];
  var password = (text.match(/Password: (.+)/) || [])[1];
  if (!email || !password) throw new Error('Could not parse credentials file');
  return { email, password };
}

const SAMPLES = [
  { code: 'SWI-EDTECH-IV', role: 'swi', name: 'Division Steward · EdTech IV', sectorId: 'EdTech', divisionId: 'IV', status: 'pending' },
  { code: 'SWD-EDTECH-IV-01', role: 'swd_inv', name: 'Expansion Lead · EdTech IV', sectorId: 'EdTech', divisionId: 'IV', parentCode: 'SWI-EDTECH-IV', status: 'pending' },
  { code: 'WDS-EDTECH-IV-01', role: 'wds', name: 'Cohort Ops · EdTech IV', sectorId: 'EdTech', divisionId: 'IV', parentCode: 'SWD-EDTECH-IV-01', status: 'pending' }
];

const EVENTS = [
  { type: 'SECTOR_LIVE', scope: 'EdTech', summary: 'Sector development capacity synchronized · 5,000 architecture', feedView: 'sectors', delta: 'LIVE' },
  { type: 'DIVISION_CONFIRMED', scope: 'EdTech · Division IV', summary: 'Division operating unit confirmed · 8.76B FCFA engine', feedView: 'divisions', delta: '8.76B' },
  { type: 'DEVELOPMENT_OUTPUT', scope: 'Development Market', summary: 'Cohort production pathway active · 438M per cohort', feedView: 'markets', delta: 'DEV' }
];

async function main() {
  var { email, password } = parseCreds();
  var app = initializeApp(firebaseConfig);
  var auth = getAuth(app);
  var db = getFirestore(app);
  await signInWithEmailAndPassword(auth, email, password);

  for (var s of SAMPLES) {
    await setDoc(doc(db, 'operators', s.code), Object.assign({}, s, {
      email: '',
      network: {},
      engines: { develop: 0, deploy: 0, acquire: 0, govern: 0 },
      createdAt: serverTimestamp(),
      createdBy: 'BTH-STEWARD-001'
    }), { merge: true });
    console.log('Operator:', s.code);
  }

  for (var ev of EVENTS) {
    await addDoc(collection(db, 'gwix_econometric_events'), Object.assign({}, ev, {
      subject: ev.scope,
      text: ev.summary,
      published: true,
      source: 'bth_steward',
      createdAt: serverTimestamp()
    }));
    console.log('Event:', ev.type);
  }

  console.log('Sample data seeded.');
}

main().catch(function (err) {
  console.error(err.message || err);
  process.exit(1);
});
