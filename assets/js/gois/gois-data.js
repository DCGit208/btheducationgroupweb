/**
 * GOIS Firestore data layer — live operator stats, network counts, aggregates.
 */
(function (global) {
  'use strict';

  function db() {
    return global.db || null;
  }

  async function loadActiveOperatorCounts() {
    var firestore = db();
    var counts = { swi: 0, swd_inv: 0, wds: 0, steward: 0, total: 0, pending: 0 };
    if (!firestore) return counts;
    try {
      var snap = await firestore.collection('operators').get();
      snap.forEach(function (doc) {
        var d = doc.data();
        var status = (d.status || '').toLowerCase();
        if (status === 'pending') {
          counts.pending++;
          return;
        }
        if (status !== 'active') return;
        counts.total++;
        var role = (d.role || '').toLowerCase().replace(/-/g, '_');
        if (role === 'swi') counts.swi++;
        else if (role === 'swd_inv') counts.swd_inv++;
        else if (role === 'wds') counts.wds++;
        else if (role === 'steward' || role === 'bth_steward') counts.steward++;
      });
    } catch (e) {
      console.warn('[GOIS] loadActiveOperatorCounts', e);
    }
    return counts;
  }

  async function loadStewardGlobalStats() {
    var p = global.GOISConfig ? global.GOISConfig.PORTFOLIO : {};
    var counts = await loadActiveOperatorCounts();
    return {
      sectors: p.sectors || 26,
      divisions: p.divisions || 130,
      swi: counts.swi || 0,
      swdInv: counts.swd_inv || 0,
      wds: counts.wds || 0,
      cohorts: p.cohorts || 6500,
      activeOperators: counts.total,
      pendingOperators: counts.pending,
      architecture: {
        swi: p.swi || 130,
        swdInv: p.swdInv || 1300,
        wds: p.wds || 2600
      }
    };
  }

  function normRole(role) {
    return (role || '').toLowerCase().replace(/-/g, '_');
  }

  function sameScope(a, sectorId, divisionId) {
    if (sectorId && a.sectorId && a.sectorId !== sectorId) return false;
    if (divisionId && a.divisionId && a.divisionId !== divisionId) return false;
    return true;
  }

  function isLinkedToParent(d, parentCode, sectorId, divisionId, viewerRole) {
    var role = normRole(d.role);
    var link = d.parentCode === parentCode || d.uplineCode === parentCode;
    if (link) return true;
    if (viewerRole === 'swi' && sameScope(d, sectorId, divisionId)) {
      if (role === 'swd_inv' && (!d.parentCode || d.parentCode === parentCode)) return true;
    }
    if (viewerRole === 'swd_inv' && role === 'wds' && !d.parentCode && sameScope(d, sectorId, divisionId)) {
      return true;
    }
    return false;
  }

  async function loadDownlineForOperator(operatorData, profile) {
    var firestore = db();
    var op = operatorData || {};
    var sectorId = op.sectorId || profile.sectorId;
    var divisionId = op.divisionId || profile.divisionId;
    var parentCode = op.code || profile.operatorCode;
    var viewerRole = normRole(profile.role || op.role);
    var result = { swdInv: 0, wds: 0, cohorts: 0, capacity: 0, nodes: [] };

    if (!firestore || !parentCode) return result;

    try {
      var snap = await firestore.collection('operators')
        .where('status', '==', 'active')
        .get();

      snap.forEach(function (doc) {
        var d = doc.data();
        var role = normRole(d.role);
        if (d.code === parentCode) return;
        if (!isLinkedToParent(d, parentCode, sectorId, divisionId, viewerRole)) return;

        result.nodes.push({ id: doc.id, code: d.code, name: d.name, role: d.role, parentCode: d.parentCode || d.uplineCode || '' });
        if (role === 'swd_inv') result.swdInv++;
        if (role === 'wds') {
          result.wds++;
          result.cohorts += d.network && d.network.cohorts ? d.network.cohorts : 0;
          result.capacity += d.network && d.network.capacity ? d.network.capacity : 0;
        }
      });
      result.total = result.nodes.length;
    } catch (e) {
      console.warn('[GOIS] loadDownlineForOperator', e);
    }
    return result;
  }

  async function loadDivisionOperators(sectorId, divisionId) {
    var firestore = db();
    if (!firestore) return [];
    try {
      var snap = await firestore.collection('operators')
        .where('status', '==', 'active')
        .get();
      return snap.docs.map(function (doc) {
        return Object.assign({ id: doc.id }, doc.data());
      }).filter(function (d) {
        if (normRole(d.role) === 'steward') return false;
        if (sectorId && d.sectorId !== sectorId) return false;
        if (divisionId && d.divisionId !== divisionId) return false;
        return true;
      });
    } catch (e) {
      console.warn('[GOIS] loadDivisionOperators', e);
      return [];
    }
  }

  async function loadRecentEconometricEvents(limit) {
    var firestore = db();
    if (!firestore) return [];
    limit = limit || 30;
    try {
      var snap = await firestore.collection('gwix_econometric_events')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();
      return snap.docs.map(function (d) {
        return Object.assign({ id: d.id }, d.data());
      });
    } catch (e) {
      console.warn('[GOIS] loadRecentEconometricEvents', e);
      return [];
    }
  }

  async function loadAllActivities(limit) {
    var firestore = db();
    if (!firestore) return [];
    limit = limit || 50;
    try {
      var snap = await firestore.collection('operator_activities')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();
      return snap.docs.map(function (d) {
        return Object.assign({ id: d.id }, d.data());
      });
    } catch (e) {
      console.warn('[GOIS] loadAllActivities', e);
      return [];
    }
  }

  global.GOISData = {
    loadActiveOperatorCounts: loadActiveOperatorCounts,
    loadStewardGlobalStats: loadStewardGlobalStats,
    loadDownlineForOperator: loadDownlineForOperator,
    loadDivisionOperators: loadDivisionOperators,
    loadRecentEconometricEvents: loadRecentEconometricEvents,
    loadAllActivities: loadAllActivities
  };
})(typeof window !== 'undefined' ? window : global);
