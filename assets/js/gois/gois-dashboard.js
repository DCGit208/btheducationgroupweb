/**
 * GOIS main dashboard controller — binds auth, sections, KPIs, live Firestore data.
 */
(function (global) {
  'use strict';

  var state = { profile: null, operator: null, globalStats: null };

  function getRank() {
    return document.body.getAttribute('data-gois-rank') || 'swi';
  }

  function isSteward() {
    return getRank() === 'steward';
  }

  function fmtUsd(n) {
    if (global.BTHPortfolio && global.BTHPortfolio.fmtUsd) {
      return global.BTHPortfolio.fmtUsd(n, { compact: true });
    }
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
    return '$' + Number(n || 0).toLocaleString();
  }

  function fmtUsdShort(n) {
    if (global.BTHPortfolio && global.BTHPortfolio.fmtUsdShort) {
      return global.BTHPortfolio.fmtUsdShort(n);
    }
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    return String(n);
  }

  function kpi(label, value, sub) {
    return '<div class="gois-kpi"><div class="gois-kpi-label">' + label + '</div>' +
      '<div class="gois-kpi-value">' + value + '</div>' +
      (sub ? '<div class="gois-kpi-sub">' + sub + '</div>' : '') + '</div>';
  }

  function renderOverviewKpis() {
    var mount = document.getElementById('goisOverviewKpis');
    if (!mount) return;
    var p = global.GOISConfig ? global.GOISConfig.PORTFOLIO : {};
    var rank = getRank();
    var op = state.operator && state.operator.data ? state.operator.data : {};
    var gs = state.globalStats || {};

    if (rank === 'steward') {
      mount.innerHTML =
        kpi('Global economy', fmtUsd(p.globalValueUsd || 2049823601), 'Development engine') +
        kpi('Active operators', gs.activeOperators != null ? gs.activeOperators : 1, (gs.pendingOperators || 0) + ' pending') +
        kpi('SWI · SWD · WDS', (gs.swi || 0) + ' · ' + (gs.swdInv || 0) + ' · ' + (gs.wds || 0), 'Live registry') +
        kpi('Econometric events', state.eventCount != null ? state.eventCount : '—', 'GWIX feed source');
    } else if (rank === 'swi') {
      var net = state.downline || op.network || {};
      mount.innerHTML =
        kpi('Division value', fmtUsd(p.divisionValueUsd || 15767874), op.sectorId + ' · Div ' + (op.divisionId || '—')) +
        kpi('SWD-INV', net.swdInv != null ? net.swdInv : 0, 'Active in network') +
        kpi('WDS', net.wds != null ? net.wds : 0, 'Operational layer') +
        kpi('Status', (op.status || 'active').toUpperCase(), op.code || '—');
    } else if (rank === 'swd_inv') {
      var net2 = state.downline || op.network || {};
      mount.innerHTML =
        kpi('Expansion scope', op.sectorId || 'Portfolio', 'SWD-INV participant') +
        kpi('WDS supervised', net2.wds != null ? net2.wds : 0, 'Under your node') +
        kpi('Cohorts', net2.cohorts || 0, 'Development target') +
        kpi('GORP', op.gorpStatus || 'Active', op.code || '—');
    } else {
      var net3 = state.downline || op.network || {};
      mount.innerHTML =
        kpi('Cohort ops', net3.cohorts || op.network && op.network.cohorts || 0, 'Active') +
        kpi('Capacity', net3.capacity || 0, 'Workforce units') +
        kpi('Deployment', op.deploymentPct != null ? op.deploymentPct + '%' : '—', 'Readiness') +
        kpi('Status', (op.status || 'active').toUpperCase(), op.code || '—');
    }
  }

  function updateTopbar(profile) {
    var nameEl = document.getElementById('goisUserName');
    var codeEl = document.getElementById('goisUserCode');
    var metaEl = document.getElementById('goisTopbarMeta');
    if (nameEl) nameEl.textContent = profile.name || profile.email || 'Operator';
    if (codeEl) codeEl.textContent = profile.operatorCode || profile.role || '—';
    if (metaEl) {
      var parts = [global.GOISConfig.getRankLabel(getRank())];
      if (profile.sectorId) parts.push('Sector ' + profile.sectorId);
      if (profile.divisionId) parts.push('Division ' + profile.divisionId);
      metaEl.textContent = parts.join(' · ');
    }
  }

  async function loadOperator(profile) {
    if (!global.GOISAuth || !profile) return null;
    return global.GOISAuth.resolveOperatorDoc(profile);
  }

  async function loadLiveData() {
    if (isSteward() && global.GOISData) {
      state.globalStats = await global.GOISData.loadStewardGlobalStats();
      var events = await global.GOISData.loadRecentEconometricEvents(500);
      state.eventCount = events.length;
    }
    if (global.GOISData && state.profile) {
      state.downline = await global.GOISData.loadDownlineForOperator(
        state.operator && state.operator.data,
        state.profile
      );
    }
  }

  async function refreshSections() {
    var rank = getRank();
    var profile = state.profile || {};
    var opData = state.operator && state.operator.data ? state.operator.data : {};
    var steward = isSteward();

    await loadLiveData();

    if (global.GOISCharter) {
      global.GOISCharter.renderDuties(document.getElementById('goisRoleDutiesMount'), rank);
      global.GOISCharter.renderDocuments(document.getElementById('goisDocumentsMount'), rank);
    }
    if (global.GOISRevenueEngines) {
      global.GOISRevenueEngines.render(document.getElementById('goisRevenueEnginesMount'), rank, profile, opData, state.globalStats);
    }
    if (global.GOISNetwork) {
      await global.GOISNetwork.render(document.getElementById('goisNetworkMount'), rank, profile, opData, state.globalStats, state.downline);
    }
    if (global.GOISActivity) {
      var activities = await global.GOISActivity.loadActivities(profile, 50, steward);
      global.GOISActivity.renderActivityList(document.getElementById('goisActivitiesMount'), activities);
      if (steward) {
        global.GOISActivity.renderEconometricRegistry(document.getElementById('goisEconometricMount'), rank, profile);
        global.GOISActivity.renderOperatorRegistry(document.getElementById('goisOperatorRegistryMount'), profile);
      }
    }
    if (global.GOISReporting) {
      global.GOISReporting.renderReports(document.getElementById('goisReportsMount'), profile, opData, steward);
    }
    renderOverviewKpis();
    renderRankOps();
  }

  function renderRankOps() {
    var rank = getRank();
    var governance = document.getElementById('goisGovernanceOpsMount');
    var expansion = document.getElementById('goisExpansionOpsMount');
    var cohort = document.getElementById('goisCohortOpsMount');
    var deploy = document.getElementById('goisDeploymentReadinessMount');
    var nodes = state.downline && state.downline.nodes ? state.downline.nodes : [];

    function nodeList(title) {
      if (!nodes.length) return '<p style="font-size:13px;color:#64748b">No downline operators registered yet.</p>';
      var lis = nodes.map(function (n) {
        return '<li><strong>' + n.name + '</strong> · ' + (n.role || '').toUpperCase() + ' · <code>' + n.code + '</code></li>';
      }).join('');
      return '<ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.8;color:#334155">' + lis + '</ul>';
    }

    if (governance && rank === 'swi') {
      governance.innerHTML =
        '<div class="gois-card"><h3><i class="fa-solid fa-scale-balanced"></i> Governance operations</h3>' +
        '<p style="font-size:13px;color:#64748b">Division stewardship checklist — report to BTH Steward weekly.</p>' +
        nodeList('Downline') +
        '<ul style="margin:12px 0 0;padding-left:20px;font-size:14px;line-height:1.8;color:#334155">' +
        '<li>SWD-INV performance review</li><li>WDS continuity audit</li><li>GORP compliance checkpoint</li></ul></div>';
    }
    if (expansion && rank === 'swd_inv') {
      expansion.innerHTML =
        '<div class="gois-card"><h3><i class="fa-solid fa-arrows-up-to-line"></i> Expansion operations</h3>' +
        nodeList('WDS structures') + '</div>';
    }
    if (cohort && rank === 'wds') {
      cohort.innerHTML =
        '<div class="gois-card"><h3><i class="fa-solid fa-people-group"></i> Cohort operations</h3>' +
        '<p style="font-size:13px;color:#64748b">Track L1–L5 cohort production and certification pathways per Operations Manual.</p></div>';
    }
    if (deploy && rank === 'wds') {
      deploy.innerHTML =
        '<div class="gois-card"><h3><i class="fa-solid fa-truck-fast"></i> Deployment readiness</h3>' +
        '<p style="font-size:13px;color:#64748b">Placement pipeline · contract continuity · Deploy-phase WDDAM checklist.</p></div>';
    }
  }

  async function onAuthReady(e) {
    state.profile = e.detail.profile;
    state.operator = await loadOperator(state.profile);
    updateTopbar(state.profile);
    await refreshSections();
  }

  function init() {
    if (global.GOISRouter) global.GOISRouter.init();
    if (global.GOISAuth) global.GOISAuth.init();

    global.addEventListener('gois-auth-ready', onAuthReady);
    global.addEventListener('gois-registry-changed', refreshSections);
    global.addEventListener('gois-econometric-published', refreshSections);
    global.addEventListener('gois-section-change', function (e) {
      if (['activities', 'operator-registry', 'econometric-registry', 'overview', 'network'].indexOf(e.detail.section) !== -1) {
        refreshSections();
      }
    });

    var pill = document.getElementById('goisPhasePill');
    if (pill && global.GOISConfig) pill.textContent = global.GOISConfig.PHASE.label;
  }

  global.GOISDashboard = { init: init, refresh: refreshSections };
})(typeof window !== 'undefined' ? window : global);
