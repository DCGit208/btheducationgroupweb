/**
 * GOIS Firestore data layer — live operator stats, network counts, aggregates.
 */
(function (global) {
  "use strict";

  function db() {
    return global.db || null;
  }

  async function loadActiveOperatorCounts() {
    var firestore = db();
    var counts = {
      swi: 0,
      swd_inv: 0,
      wds: 0,
      steward: 0,
      total: 0,
      pending: 0,
    };
    if (!firestore) return counts;
    try {
      var snap = await firestore.collection("operators").get();
      snap.forEach(function (doc) {
        var d = doc.data();
        var status = (d.status || "").toLowerCase();
        if (status === "pending") {
          counts.pending++;
          return;
        }
        if (status !== "active") return;
        counts.total++;
        var role = (d.role || "").toLowerCase().replace(/-/g, "_");
        if (role === "swi") counts.swi++;
        else if (role === "swd_inv") counts.swd_inv++;
        else if (role === "wds") counts.wds++;
        else if (role === "steward" || role === "bth_steward") counts.steward++;
      });
    } catch (e) {
      console.warn("[GOIS] loadActiveOperatorCounts", e);
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
        wds: p.wds || 2600,
      },
    };
  }

  function normRole(role) {
    return (role || "").toLowerCase().replace(/-/g, "_");
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
    if (viewerRole === "swi" && sameScope(d, sectorId, divisionId)) {
      if (role === "swd_inv" && (!d.parentCode || d.parentCode === parentCode))
        return true;
    }
    if (
      viewerRole === "swd_inv" &&
      role === "wds" &&
      !d.parentCode &&
      sameScope(d, sectorId, divisionId)
    ) {
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
      var snap = await firestore
        .collection("operators")
        .where("status", "==", "active")
        .get();

      snap.forEach(function (doc) {
        var d = doc.data();
        var role = normRole(d.role);
        if (d.code === parentCode) return;
        if (!isLinkedToParent(d, parentCode, sectorId, divisionId, viewerRole))
          return;

        result.nodes.push({
          id: doc.id,
          code: d.code,
          name: d.name,
          role: d.role,
          parentCode: d.parentCode || d.uplineCode || "",
        });
        if (role === "swd_inv") result.swdInv++;
        if (role === "wds") {
          result.wds++;
          result.cohorts +=
            d.network && d.network.cohorts ? d.network.cohorts : 0;
          result.capacity +=
            d.network && d.network.capacity ? d.network.capacity : 0;
        }
      });
      result.total = result.nodes.length;
    } catch (e) {
      console.warn("[GOIS] loadDownlineForOperator", e);
    }
    return result;
  }

  async function loadDivisionOperators(sectorId, divisionId) {
    var firestore = db();
    if (!firestore) return [];
    try {
      var snap = await firestore
        .collection("operators")
        .where("status", "==", "active")
        .get();
      return snap.docs
        .map(function (doc) {
          return Object.assign({ id: doc.id }, doc.data());
        })
        .filter(function (d) {
          if (normRole(d.role) === "steward") return false;
          if (sectorId && d.sectorId !== sectorId) return false;
          if (divisionId && d.divisionId !== divisionId) return false;
          return true;
        });
    } catch (e) {
      console.warn("[GOIS] loadDivisionOperators", e);
      return [];
    }
  }

  async function loadRecentEconometricEvents(limit) {
    var firestore = db();
    if (!firestore) return [];
    limit = limit || 30;
    try {
      var snap = await firestore
        .collection("gwix_econometric_events")
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();
      return snap.docs.map(function (d) {
        return Object.assign({ id: d.id }, d.data());
      });
    } catch (e) {
      console.warn("[GOIS] loadRecentEconometricEvents", e);
      return [];
    }
  }

  async function loadAllActivities(limit) {
    var firestore = db();
    if (!firestore) return [];
    limit = limit || 50;
    try {
      var snap = await firestore
        .collection("operator_activities")
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();
      return snap.docs.map(function (d) {
        return Object.assign({ id: d.id }, d.data());
      });
    } catch (e) {
      console.warn("[GOIS] loadAllActivities", e);
      return [];
    }
  }

  async function getDoc(collection, id) {
    var firestore = db();
    if (!firestore || !id) return null;
    try {
      var snap = await firestore.collection(collection).doc(id).get();
      return snap.exists ? Object.assign({ id: snap.id }, snap.data()) : null;
    } catch (e) {
      console.warn("[GOIS] getDoc " + collection, e);
      return null;
    }
  }

  async function queryByField(collection, field, value, limit) {
    var firestore = db();
    if (!firestore || !field || !value) return [];
    try {
      var snap = await firestore
        .collection(collection)
        .where(field, "==", value)
        .limit(limit || 50)
        .get();
      return snap.docs.map(function (d) {
        return Object.assign({ id: d.id }, d.data());
      });
    } catch (e) {
      console.warn("[GOIS] queryByField " + collection + "." + field, e);
      return [];
    }
  }

  async function loadCohortScope(profile) {
    var role = normRole(profile && profile.role);
    var cohortRoles = [
      "cohort_leader",
      "team_leader",
      "cohort_member",
      "member",
    ];
    if (cohortRoles.indexOf(role) === -1) {
      return null;
    }

    var cohortId = profile.cohortId || "";
    var teamId = profile.teamId || "";
    var memberId = profile.memberId || "";
    var operatorCode = profile.operatorCode || "";
    var scope = {
      cohort: null,
      team: null,
      member: null,
      members: [],
      payments: [],
    };

    scope.cohort = await getDoc("cohorts", cohortId);
    scope.team = await getDoc("cohort_teams", teamId);

    if (role === "cohort_leader" || role === "team_leader") {
      scope.members = await queryByField(
        "cohort_members",
        "teamId",
        teamId,
        25,
      );
      scope.payments = await queryByField(
        "cohort_payments",
        "teamId",
        teamId,
        100,
      );
    } else {
      scope.member = await getDoc("cohort_members", memberId);
      if (!scope.member && operatorCode) {
        var matched = await queryByField(
          "cohort_members",
          "memberCode",
          operatorCode,
          1,
        );
        scope.member = matched[0] || null;
      }
      scope.payments = await queryByField(
        "cohort_payments",
        "memberId",
        memberId || operatorCode,
        100,
      );
    }

    return scope;
  }

  global.GOISData = {
    loadActiveOperatorCounts: loadActiveOperatorCounts,
    loadStewardGlobalStats: loadStewardGlobalStats,
    loadDownlineForOperator: loadDownlineForOperator,
    loadDivisionOperators: loadDivisionOperators,
    loadRecentEconometricEvents: loadRecentEconometricEvents,
    loadAllActivities: loadAllActivities,
    loadCohortScope: loadCohortScope,
  };
})(typeof window !== "undefined" ? window : global);
