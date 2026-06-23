/**
 * GOIS nav config per operator rank (GWIX Operator Network).
 * Pattern: Marriage Education DOS (dos-config.js).
 */
(function (global) {
  'use strict';

  var BASE_NAV = [
    { id: 'overview', label: 'Command center', icon: 'fa-solid fa-gauge-high' },
    { id: 'role-duties', label: 'Role & duties', icon: 'fa-solid fa-book-open' },
    { id: 'revenue-engines', label: 'Revenue engines', icon: 'fa-solid fa-chart-pie' },
    { id: 'network', label: 'Network', icon: 'fa-solid fa-sitemap' },
    { id: 'activities', label: 'Activities', icon: 'fa-solid fa-list-check' },
    { id: 'documents', label: 'Documents', icon: 'fa-solid fa-folder-open' },
    { id: 'reports', label: 'Reports', icon: 'fa-solid fa-file-export' }
  ];

  var STEWARD_EXTRA = [
    { id: 'econometric-registry', label: 'Econometric registry', icon: 'fa-solid fa-satellite-dish' },
    { id: 'operator-registry', label: 'Operator registry', icon: 'fa-solid fa-users-gear' }
  ];

  var SWI_EXTRA = [
    { id: 'governance-ops', label: 'Governance ops', icon: 'fa-solid fa-scale-balanced' }
  ];

  var SWD_INV_EXTRA = [
    { id: 'expansion-ops', label: 'Expansion ops', icon: 'fa-solid fa-arrows-up-to-line' }
  ];

  var WDS_EXTRA = [
    { id: 'cohort-ops', label: 'Cohort ops', icon: 'fa-solid fa-people-group' },
    { id: 'deployment-readiness', label: 'Deployment readiness', icon: 'fa-solid fa-truck-fast' }
  ];

  var RANK_LABELS = {
    steward: 'BTH Infrastructure Steward',
    swi: 'SWI Partner',
    swd_inv: 'SWD-INV Participant',
    wds: 'Workforce Development Structure'
  };

  var PORTFOLIO = {
    cohortValueUsd: 730000,
    divisionValueUsd: 14600000,
    sectorValueUsd: 73000000,
    globalValueUsd: 1898000000,
    cohortValueFcfa: 438000000,
    divisionValueFcfa: 8760000000,
    sectorValueFcfa: 43800000000,
    globalValueFcfa: 1138800000000,
    sectors: 26,
    divisions: 130,
    swi: 130,
    swdInv: 1300,
    wds: 2600,
    cohorts: 6500,
    capacity: 130000
  };

  global.GOISConfig = {
    PHASE: { current: 3, total: 4, label: 'Phase 3 — Login provisioning & production deploy' },
    PORTFOLIO: PORTFOLIO,
    RANK_LABELS: RANK_LABELS,
    getNavForRank: function (rank) {
      var nav = BASE_NAV.slice();
      if (rank === 'steward') {
        nav.splice(2, 0, STEWARD_EXTRA[0], STEWARD_EXTRA[1]);
      }
      if (rank === 'swi') {
        nav.splice(2, 0, SWI_EXTRA[0]);
      }
      if (rank === 'swd_inv') {
        nav.splice(2, 0, SWD_INV_EXTRA[0]);
      }
      if (rank === 'wds') {
        nav.splice(2, 0, WDS_EXTRA[0], WDS_EXTRA[1]);
      }
      return nav;
    },
    getSectionTitle: function (id, rank) {
      var nav = this.getNavForRank(rank || 'swi');
      var item = nav.find(function (n) { return n.id === id; });
      return item ? item.label : 'Dashboard';
    },
    getRankLabel: function (rank) {
      return RANK_LABELS[rank] || 'Operator';
    }
  };
})(typeof window !== 'undefined' ? window : global);
