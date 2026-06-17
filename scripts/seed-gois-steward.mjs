#!/usr/bin/env node
/**
 * Seed the first BTH Infrastructure Steward account.
 * Uses serviceAccountKey.json OR Application Default Credentials (Firebase CLI login).
 */
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __dirname = dirname(fileURLToPath(import.meta.url));
const keyPath = join(__dirname, 'serviceAccountKey.json');
const PROJECT_ID = 'bth-gwix-operator-network';

const email = process.argv[2];
const password = process.argv[3];
const displayName = process.argv[4] || 'BTH Infrastructure Steward';

if (!email || !password) {
  console.error('Usage: node scripts/seed-gois-steward.mjs <email> <password> [displayName]');
  process.exit(1);
}

if (existsSync(keyPath)) {
  const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} else {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: PROJECT_ID
  });
}

const auth = admin.auth();
const db = admin.firestore();
const operatorCode = 'BTH-STEWARD-001';

async function main() {
  let user;
  try {
    user = await auth.getUserByEmail(email);
    console.log('Auth user already exists:', user.uid);
    await auth.updateUser(user.uid, { password, displayName, emailVerified: true });
    console.log('Updated password and profile for existing user.');
  } catch (e) {
    if (e.code !== 'auth/user-not-found') throw e;
    user = await auth.createUser({ email, password, displayName, emailVerified: true });
    console.log('Created Auth user:', user.uid);
  }

  await db.collection('users').doc(user.uid).set({
    role: 'steward',
    name: displayName,
    email,
    operatorCode,
    sectorId: null,
    divisionId: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  await db.collection('operators').doc(operatorCode).set({
    code: operatorCode,
    role: 'steward',
    name: displayName,
    email,
    status: 'active',
    uid: user.uid,
    network: { sectors: 26, divisions: 130, swi: 130, swdInv: 1300, wds: 2600, cohorts: 6500 },
    engines: {
      develop: 432744000000,
      deploy: 318864000000,
      acquire: 250536000000,
      govern: 136656000000
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  const credPath = join(__dirname, 'gois-steward-credentials.local.txt');
  writeFileSync(credPath, [
    'BTH Infrastructure Steward — GWIX Operator Network',
    'Project: ' + PROJECT_ID,
    'Email: ' + email,
    'Password: ' + password,
    'Login: operator/login-test.html',
    'Dashboard: operator/steward/dashboard-test.html',
    'Generated: ' + new Date().toISOString()
  ].join('\n') + '\n');

  console.log('Steward profile ready.');
  console.log('  users/' + user.uid);
  console.log('  operators/' + operatorCode);
  console.log('Credentials saved to scripts/gois-steward-credentials.local.txt (gitignored)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
