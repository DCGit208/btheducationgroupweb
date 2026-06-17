/**
 * WDDAM revenue engines panel — Develop · Deploy · Acquire · Govern
 */
(function (global) {
  'use strict';

  var ENGINES = [
    { key: 'develop', label: 'Development', icon: 'fa-solid fa-seedling', desc: 'Workforce production economics' },
    { key: 'deploy', label: 'Deployment', icon: 'fa-solid fa-truck-fast', desc: 'Operational workforce continuity' },
    { key: 'acquire', label: 'Acquisition', icon: 'fa-solid fa-building-columns', desc: 'Institutional workforce transfer' },
    { key: 'govern', label: 'Governance', icon: 'fa-solid fa-scale-balanced', desc: 'Lifecycle oversight & compliance' }
  ];

  function fmtFcfa(n) {
    if (n >= 1e12) return (n / 1e12).toFixed(4) + 'T';
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    return Number(n || 0).toLocaleString();
  }

  function scopeMultiplier(rank, profile) {
    if (rank === 'steward') return { label: 'Global portfolio', mult: 1 };
    if (rank === 'swi') return { label: 'Division', mult: 1 / 130 };
    if (rank === 'swd_inv') return { label: 'SWD-INV scope', mult: 1 / 1300 };
    if (rank === 'wds') return { label: 'WDS scope', mult: 1 / 2600 };
    return { label: 'Scope', mult: 1 / 130 };
  }

  function render(mountEl, rank, profile, operatorData) {
    if (!mountEl) return;
    var p = global.GOISConfig ? global.GOISConfig.PORTFOLIO : {};
    var scope = scopeMultiplier(rank, profile);
    var base = p.globalValueFcfa || 1138800000000;
    var scopedBase = Math.round(base * scope.mult);
    var op = operatorData || {};

    var cards = ENGINES.map(function (eng) {
      var pct = eng.key === 'develop' ? 0.38 : eng.key === 'deploy' ? 0.28 : eng.key === 'acquire' ? 0.22 : 0.12;
      var live = op.engines && op.engines[eng.key];
      var val = live != null ? live : Math.round(scopedBase * pct);
      var badge = live != null
        ? '<span class="gois-badge gois-badge--live">Operational</span>'
        : '<span class="gois-badge gois-badge--arch">Architecture</span>';
      return '<div class="gois-engine-card">' +
        '<h4><i class="' + eng.icon + '"></i> ' + eng.label + ' ' + badge + '</h4>' +
        '<div class="gois-engine-val">' + fmtFcfa(val) + ' FCFA</div>' +
        '<div class="gois-engine-sub">' + eng.desc + '</div></div>';
    }).join('');

    mountEl.innerHTML =
      '<div class="gois-card">' +
      '<h3><i class="fa-solid fa-chart-pie"></i> Revenue engines — ' + scope.label + '</h3>' +
      '<p style="font-size:13px;color:#64748b;margin:0 0 16px">WDDAM markets across Develop · Deploy · Acquire · Govern. Governed Operational Revenue Participation — not investment returns.</p>' +
      '<div class="gois-engine-grid">' + cards + '</div></div>';
  }

  global.GOISRevenueEngines = { render: render };
})(typeof window !== 'undefined' ? window : global);
