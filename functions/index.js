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

function generatedOperatorCode(role) {
  const prefix = role === 'cohort_leader' ? 'CL' : role === 'cohort_member' ? 'CM' : 'OP';
  return prefix + '-' + Date.now().toString(36).toUpperCase().slice(-8);
}

function dashboardPathForRole(role) {
  return role === 'steward' ? '/operator/steward/dashboard.html'
    : role === 'swd_inv' ? '/operator/swd-inv/dashboard.html'
    : role === 'wds' ? '/operator/wds/dashboard.html'
    : role === 'cohort_leader' ? '/operator/cohort-leader/dashboard.html'
    : role === 'cohort_member' ? '/operator/cohort-member/dashboard.html'
    : '/operator/swi/dashboard.html';
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
    cohortId: op.cohortId || null,
    teamId: op.teamId || null,
    memberId: op.memberId || null,
    leaderCode: op.leaderCode || null,
    workforceLevel: op.workforceLevel || null,
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
    dashboardPath: dashboardPathForRole(role)
  };
});

/**
 * Steward approves a public cohort application and provisions login/profile records.
 * data: { applicationId, role?, operatorCode?, teamId?, memberId?, leaderCode?, workforceLevel?, password? }
 */
exports.goisApproveCohortApplication = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Sign in required.');
  }
  await assertSteward(context.auth.uid);

  const applicationId = (data.applicationId || '').trim();
  if (!applicationId) {
    throw new functions.https.HttpsError('invalid-argument', 'applicationId required.');
  }

  const appRef = db.collection('cohort_applications').doc(applicationId);
  const appSnap = await appRef.get();
  if (!appSnap.exists) {
    throw new functions.https.HttpsError('not-found', 'Cohort application not found.');
  }
  const app = appSnap.data();
  if (app.status === 'provisioned') {
    throw new functions.https.HttpsError('failed-precondition', 'Application already provisioned.');
  }

  const role = ((data.role || (app.applicantType === 'leader' ? 'cohort_leader' : 'cohort_member')) || '')
    .toLowerCase()
    .replace(/-/g, '_');
  if (!['cohort_leader', 'cohort_member'].includes(role)) {
    throw new functions.https.HttpsError('invalid-argument', 'Role must be cohort_leader or cohort_member.');
  }

  const email = (app.email || '').trim().toLowerCase();
  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'Application email required.');
  }

  const displayName = app.name || email;
  const password = (data.password || '').trim() || randomPassword();
  const { uid, created } = await createOrUpdateAuthUser(email, password, displayName);
  const operatorCode = (data.operatorCode || generatedOperatorCode(role)).trim();
  const teamId = (data.teamId || app.teamId || (role === 'cohort_leader' ? app.cohortId + '-' + operatorCode : '') || '').trim();
  const memberId = (data.memberId || operatorCode).trim();
  const leaderCode = (data.leaderCode || app.leaderCode || (role === 'cohort_leader' ? operatorCode : '') || '').trim();
  const workforceLevel = (data.workforceLevel || app.requestedWorkforceLevel || '').toString();

  const profile = {
    role,
    name: displayName,
    email,
    operatorCode,
    sectorId: app.sectorId || null,
    divisionId: app.divisionId || null,
    parentCode: app.wdsCode || null,
    wdsCode: app.wdsCode || null,
    cohortId: app.cohortId || null,
    teamId: teamId || null,
    memberId: role === 'cohort_member' ? memberId : null,
    leaderCode: leaderCode || null,
    workforceLevel: workforceLevel || null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  const batch = db.batch();
  batch.set(db.collection('users').doc(uid), profile, { merge: true });
  batch.set(db.collection('operators').doc(operatorCode), {
    code: operatorCode,
    role,
    name: displayName,
    email,
    uid,
    sectorId: app.sectorId || '',
    divisionId: app.divisionId || '',
    parentCode: app.wdsCode || '',
    wdsCode: app.wdsCode || '',
    cohortId: app.cohortId || '',
    teamId: teamId || '',
    memberId: role === 'cohort_member' ? memberId : '',
    leaderCode: leaderCode || '',
    workforceLevel: workforceLevel || '',
    status: 'active',
    loginProvisioned: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    createdBy: context.auth.uid,
    approvedAt: admin.firestore.FieldValue.serverTimestamp(),
    approvedBy: context.auth.uid,
    sourceApplicationId: applicationId
  }, { merge: true });

  if (role === 'cohort_leader') {
    batch.set(db.collection('cohort_teams').doc(teamId), {
      cohortId: app.cohortId || '',
      wdsCode: app.wdsCode || '',
      sectorId: app.sectorId || '',
      divisionId: app.divisionId || '',
      code: teamId,
      name: displayName + ' Team',
      leaderCode: operatorCode,
      leaderUid: uid,
      memberTarget: 10,
      status: 'recruiting',
      targets: {
        assignedCohorts: 10,
        developmentValueFcfa: 4380000000,
        deploymentAnnualTargetFcfa: 4380000000,
        deploymentParticipationFcfa: 438000000,
        leaderDevelopmentParticipationFcfa: 46000000,
        memberDevelopmentPoolFcfa: 100000000,
        acquisitionValueFcfa: 4380000000,
        governanceAnnualTargetFcfa: 438000000
      },
      actuals: {
        assignedCohortsCompleted: 0,
        developmentValueFcfa: 0,
        deploymentValueFcfa: 0,
        deploymentParticipationFcfa: 0,
        acquisitionValueFcfa: 0,
        governanceValueFcfa: 0
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  } else {
    batch.set(db.collection('cohort_members').doc(memberId), {
      uid,
      cohortId: app.cohortId || '',
      teamId: teamId || '',
      wdsCode: app.wdsCode || '',
      sectorId: app.sectorId || '',
      divisionId: app.divisionId || '',
      leaderCode: leaderCode || '',
      memberCode: operatorCode,
      name: displayName,
      email,
      workforceLevel: workforceLevel || '',
      status: 'active',
      progress: {
        attendancePct: 0,
        certificationPct: 0,
        practicalPct: 0,
        projectPct: 0,
        deploymentReadinessPct: 0
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  }

  batch.update(appRef, {
    status: 'provisioned',
    role,
    uid,
    operatorCode,
    teamId: teamId || '',
    memberId: role === 'cohort_member' ? memberId : '',
    provisionedAt: admin.firestore.FieldValue.serverTimestamp(),
    provisionedBy: context.auth.uid
  });
  batch.set(db.collection('operator_activities').doc(), {
    operatorCode: 'BTH-STEWARD-001',
    type: 'COHORT_APPLICATION_PROVISIONED',
    summary: role.toUpperCase() + ' · ' + displayName + ' · ' + (app.cohortId || 'cohort'),
    targetOperatorCode: operatorCode,
    applicationId,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  await batch.commit();

  return {
    success: true,
    uid,
    email,
    operatorCode,
    role,
    dashboardPath: dashboardPathForRole(role),
    temporaryPassword: data.password ? null : password,
    created
  };
});
