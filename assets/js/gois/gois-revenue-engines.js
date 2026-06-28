/**
 * WDDAM revenue engines panel — Develop · Deploy · Acquire · Govern
 * Development Engine USD values are the portfolio appendix baseline (FCFA ÷ 555.56).
 * Deployment, Acquisition, and Governance accrue as additional lifecycle economics beyond that baseline.
 */
(function (global) {
  'use strict';

  var ENGINES = [
    { key: 'develop', label: 'Development', icon: 'fa-solid fa-seedling', desc: 'Workforce production economics — certification pathways, cohort structuring, operational readiness' },
    { key: 'deploy', label: 'Deployment', icon: 'fa-solid fa-truck-fast', desc: 'Operational workforce continuity — placement, contracts, retention (beyond development baseline)' },
    { key: 'acquire', label: 'Acquisition', icon: 'fa-solid fa-building-columns', desc: 'Institutional workforce transfer — acquisition rights, continuity agreements (beyond development baseline)' },
    { key: 'govern', label: 'Governance', icon: 'fa-solid fa-scale-balanced', desc: 'Lifecycle oversight — performance, compliance, reporting, continuity (beyond development baseline)' }
  ];

  function fmtUsd(n) {
    if (global.BTHPortfolio && global.BTHPortfolio.fmtUsd) {
      return global.BTHPortfolio.fmtUsd(n, { compact: true }).replace(/^\$/, '');
    }
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    return Number(n || 0).toLocaleString();
  }

  function scopeMultiplier(rank) {
    if (rank === 'steward') return { label: 'Global portfolio', mult: 1 };
    if (rank === 'swi') return { label: 'Division', mult: 1 / 130 };
    if (rank === 'swd_inv') return { label: 'SWD-INV scope', mult: 1 / 1300 };
    if (rank === 'wds') return { label: 'WDS scope', mult: 1 / 2600 };
    return { label: 'Scope', mult: 1 / 130 };
  }

  function render(mountEl, rank, profile, operatorData) {
    if (!mountEl) return;
    var p = global.GOISConfig ? global.GOISConfig.PORTFOLIO : {};
    var scope = scopeMultiplier(rank);
    var developBase = p.globalValueUsd || 2049823601;
    var scopedDevelop = Math.round(developBase * scope.mult);
    var op = operatorData || {};

    var cards = ENGINES.map(function (eng) {
      var live = op.engines && op.engines[eng.key];
      var badge = live != null
        ? '<span class="gois-badge gois-badge--live">Operational</span>'
        : '<span class="gois-badge gois-badge--arch">Architecture</span>';
      var valHtml = '';
      if (eng.key === 'develop') {
        var val = live != null ? live : scopedDevelop;
        valHtml = '<div class="gois-engine-val">' + fmtUsd(val) + ' USD</div>';
      } else {
        valHtml = '<div class="gois-engine-val gois-engine-val--muted">Beyond development baseline</div>';
      }
      return '<div class="gois-engine-card">' +
        '<h4><i class="' + eng.icon + '"></i> ' + eng.label + ' ' + badge + '</h4>' +
        valHtml +
        '<div class="gois-engine-sub">' + eng.desc + '</div></div>';
    }).join('');

    mountEl.innerHTML =
      '<div class="gois-card">' +
      '<h3><i class="fa-solid fa-chart-pie"></i> Revenue engines — ' + scope.label + '</h3>' +
      '<p style="font-size:13px;color:#64748b;margin:0 0 16px">Development Engine values reflect modeled workforce production economics (438M FCFA per cohort roll-up). Deployment, Acquisition, and Governance accrue as additional lifecycle engines — Governed Operational Revenue Participation, not investment returns.</p>' +
      '<div class="gois-engine-grid">' + cards + '</div></div>';
  }

  global.GOISRevenueEngines = { render: render };
})(typeof window !== 'undefined' ? window : global);
