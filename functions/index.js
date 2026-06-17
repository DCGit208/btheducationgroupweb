'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

const STEWARD_ROLES = new Set(['steward', 'bth_steward', 'admin']);

function randomPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#';
  let s = 'BTH-';
  for (let i = 0; i < 14; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

async function assertSteward(uid) {
  const snap = await db.collection('users').doc(uid).get();
  if (!snap.exists) throw new functions.https.HttpsError('permission-denied', 'No operator profile.');
  const role = (snap.data().role || '').toLowerCase();
  if (!STEWARD_ROLES.has(role)) {
    throw new functions.https.HttpsError('permission-denied', 'Steward role required.');
  }
  return snap.data();
}

async function createOrUpdateAuthUser(email, password, displayName) {
  try {
    const existing = await auth.getUserByEmail(email);
    await auth.updateUser(existing.uid, { password, displayName, emailVerified: true });
    return { uid: existing.uid, created: false };
  } catch (e) {
    if (e.code !== 'auth/user-not-found') throw e;
    const user = await auth.createUser({ email, password, displayName, emailVerified: true });
    return { uid: user.uid, created: true };
  }
}

/**
 * Steward approves operator and provisions Firebase Auth + users/{uid} profile.
 * data: { operatorId, email?, password? }
 */
exports.goisApproveOperator = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Sign in required.');
  }
  await assertSteward(context.auth.uid);

  const operatorId = (data.operatorId || '').trim();
  if (!operatorId) {
    throw new functions.https.HttpsError('invalid-argument', 'operatorId required.');
  }

  const opRef = db.collection('operators').doc(operatorId);
  const opSnap = await opRef.get();
  if (!opSnap.exists) {
    throw new functions.https.HttpsError('not-found', 'Operator not found.');
  }
  const op = opSnap.data();
  const email = (data.email || op.email || '').trim().toLowerCase();
  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'Operator email required for login provisioning.');
  }

  const password = (data.password || '').trim() || randomPassword();
  const displayName = op.name || op.code || 'Operator';
  const { uid, created } = await createOrUpdateAuthUser(email, password, displayName);

  const role = (op.role || 'swi').toLowerCase().replace(/-/g, '_');

  await db.collection('users').doc(uid).set({
    role,
    name: displayName,
    email,
    operatorCode: op.code || operatorId,
    sectorId: op.sectorId || null,
    divisionId: op.divisionId || null,
    parentCode: op.parentCode || null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  await opRef.update({
    status: 'active',
    uid,
    email,
    approvedAt: admin.firestore.FieldValue.serverTimestamp(),
    approvedBy: context.auth.uid,
    loginProvisioned: true
  });

  await db.collection('operator_activities').add({
    operatorCode: 'BTH-STEWARD-001',
    type: 'OPERATOR_APPROVED',
    summary: role.toUpperCase() + ' · ' + displayName + ' · login provisioned',
    targetOperatorCode: op.code || operatorId,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return {
    success: true,
    uid,
    email,
    temporaryPassword: data.password ? null : password,
    created,
    operatorCode: op.code || operatorId,
    dashboardPath: role === 'steward' ? '/operator/steward/dashboard.html'
      : role === 'swd_inv' ? '/operator/swd-inv/dashboard.html'
      : role === 'wds' ? '/operator/wds/dashboard.html'
      : '/operator/swi/dashboard.html'
  };
});
