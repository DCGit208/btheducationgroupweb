#!/usr/bin/env node
/**
 * Bootstrap BTH steward using Firebase client SDK (no service account required).
 * Run while firestore.rules.bootstrap is deployed, then redeploy production rules.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ID = 'bth-gwix-operator-network';
const email = process.argv[2] || 'bthedugrp@gmail.com';
const password = process.argv[3] || ('BTH-Gwix-' + Math.random().toString(36).slice(2, 10) + '!9');
const displayName = process.argv[4] || 'BTH Infrastructure Steward';
const operatorCode = 'BTH-STEWARD-001';

const firebaseConfig = {
  apiKey: 'AIzaSyBILoK6tV9kFK7_6p2v2xRaEsgRTQgNHFg',
  authDomain: 'bth-gwix-operator-network.firebaseapp.com',
  projectId: 'bth-gwix-operator-network',
  storageBucket: 'bth-gwix-operator-network.firebasestorage.app',
  messagingSenderId: '279857746150',
  appId: '1:279857746150:web:3e5102056f09e4bdbfeb27'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function ensureUser() {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (e) {
    if (e.code !== 'auth/user-not-found' && e.code !== 'auth/invalid-credential' && e.code !== 'auth/wrong-password') {
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password') {
        throw new Error('User exists but password differs. Pass the correct password as arg 3 or reset in Firebase Console.');
      }
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      return cred.user;
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('Email already registered. Pass existing password as 3rd argument.');
      }
      throw err;
    }
  }
}

async function main() {
  const user = await ensureUser();
  await setDoc(doc(db, 'users', user.uid), {
    role: 'steward',
    name: displayName,
    email,
    operatorCode,
    sectorId: null,
    divisionId: null,
    createdAt: serverTimestamp()
  }, { merge: true });

  await setDoc(doc(db, 'operators', operatorCode), {
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
    createdAt: serverTimestamp()
  }, { merge: true });

  const credPath = join(__dirname, 'gois-steward-credentials.local.txt');
  writeFileSync(credPath, [
    'BTH Infrastructure Steward — GWIX Operator Network',
    'Project: ' + PROJECT_ID,
    'Email: ' + email,
    'Password: ' + password,
    'UID: ' + user.uid,
    'Login: operator/login-test.html',
    'Dashboard: operator/steward/dashboard-test.html',
    'Generated: ' + new Date().toISOString()
  ].join('\n') + '\n');

  console.log('Steward bootstrapped.');
  console.log('  users/' + user.uid);
  console.log('  operators/' + operatorCode);
  console.log('Credentials: scripts/gois-steward-credentials.local.txt');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
