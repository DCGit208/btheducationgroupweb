/**
 * Operator network expansion view — live Firestore counts.
 */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function kpi(label, value, sub) {
    return '<div class="gois-kpi"><div class="gois-kpi-label">' + label + '</div>' +
      '<div class="gois-kpi-value">' + value + '</div>' +
      (sub ? '<div class="gois-kpi-sub">' + sub + '</div>' : '') + '</div>';
  }

  function renderSteward(mountEl, stats) {
    stats = stats || {};
    var arch = stats.architecture || {};
    mountEl.innerHTML =
      '<div class="gois-kpi-grid">' +
      kpi('Sectors', stats.sectors || 26, 'Architecture · 26 registry') +
      kpi('Divisions', stats.divisions || 130, '5 per sector') +
      kpi('SWI Partners', (stats.swi || 0) + ' / ' + (arch.swi || 130), 'Live / architecture') +
      kpi('SWD-INV', (stats.swdInv || 0) + ' / ' + (arch.swdInv || 1300), 'Expansion layer') +
      kpi('WDS', (stats.wds || 0) + ' / ' + (arch.wds || 2600), 'Operational layer') +
      kpi('Pending', stats.pendingOperators || 0, 'Awaiting approval') +
      '</div>' +
      '<div class="gois-card"><h3><i class="fa-solid fa-sitemap"></i> Global operator topology</h3>' +
      '<p style="font-size:13px;color:#64748b;margin:0 0 12px">Live counts from operator registry. Architecture targets shown as denominators.</p>' +
      '<div class="gois-table-wrap"><table class="gois-table">' +
      '<thead><tr><th>Layer</th><th>Live</th><th>Architecture</th><th>Function</th></tr></thead><tbody>' +
      '<tr><td>Sectors</td><td><strong>26</strong></td><td>26</td><td>Strategic workforce infrastructure domains</td></tr>' +
      '<tr><td>Divisions</td><td><strong>' + (stats.divisions || 130) + '</strong></td><td>130</td><td>1 SWI · 10 SWD-INV · 20 WDS · 50 cohorts</td></tr>' +
      '<tr><td>SWI Partners</td><td><strong>' + (stats.swi || 0) + '</strong></td><td>130</td><td>Division governance & stewardship</td></tr>' +
      '<tr><td>SWD-INV</td><td><strong>' + (stats.swdInv || 0) + '</strong></td><td>1,300</td><td>Portfolio expansion & scaling</td></tr>' +
      '<tr><td>WDS</td><td><strong>' + (stats.wds || 0) + '</strong></td><td>2,600</td><td>Cohort ops & deployment readiness</td></tr>' +
      '</tbody></table></div></div>';
  }

  function renderDivision(mountEl, rank, profile, operatorData, downline) {
    var op = operatorData || {};
    var division = op.divisionId || profile.divisionId || '—';
    var sector = op.sectorId || profile.sectorId || '—';
    var dl = downline || op.network || {};

    var rows = '';
    if (rank === 'swi') {
      rows =
        row('SWD-INV participants', dl.swdInv || 0, 'Registered active') +
        row('WDS structures', dl.wds || 0, 'Operational layer') +
        row('Network nodes', dl.total || 0, 'Direct downline');
    } else if (rank === 'swd_inv') {
      rows =
        row('WDS structures', dl.wds || 0, 'Under your scope') +
        row('Cohorts supervised', dl.cohorts || 0, 'Expansion target');
    } else {
      rows =
        row('Active cohorts', dl.cohorts || op.network && op.network.cohorts || 0, 'Operational') +
        row('Capacity deployed', dl.capacity || op.network && op.network.capacity || 0, 'Workforce units');
    }

    var nodeRows = '';
    if (dl.nodes && dl.nodes.length) {
      nodeRows = '<div class="gois-card" style="margin-top:12px"><h3>Registered downline</h3><div class="gois-table-wrap"><table class="gois-table">' +
        '<thead><tr><th>Code</th><th>Name</th><th>Role</th></tr></thead><tbody>' +
        dl.nodes.map(function (n) {
          return '<tr><td><code>' + esc(n.code) + '</code></td><td>' + esc(n.name) + '</td><td>' + esc(n.role) + '</td></tr>';
        }).join('') + '</tbody></table></div></div>';
    }

    mountEl.innerHTML =
      '<div class="gois-kpi-grid">' +
      kpi('Sector', esc(sector), 'Registry') +
      kpi('Division', esc(division), 'Your unit') +
      kpi('Network', dl.total || 0, 'Active nodes') +
      '</div>' +
      '<div class="gois-card"><h3><i class="fa-solid fa-sitemap"></i> Your network</h3>' +
      '<div class="gois-table-wrap"><table class="gois-table">' +
      '<thead><tr><th>Component</th><th>Count</th><th>Notes</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>' +
      nodeRows +
      (rank === 'swi' ? '<div id="goisNetworkTreeMount"></div>' : '');
  }

  function row(a, b, c) {
    return '<tr><td>' + a + '</td><td><strong>' + b + '</strong></td><td style="color:#64748b;font-size:12px">' + c + '</td></tr>';
  }

  async function render(mountEl, rank, profile, operatorData, globalStats, downline) {
    if (!mountEl) return;
    if (rank === 'steward') {
      renderSteward(mountEl, globalStats);
      return;
    }
    renderDivision(mountEl, rank, profile, operatorData, downline);
    if (rank === 'swi' && global.GOISNetworkTree && global.GOISData) {
      var treeMount = document.getElementById('goisNetworkTreeMount');
      var op = operatorData || {};
      var sectorId = op.sectorId || profile.sectorId;
      var divisionId = op.divisionId || profile.divisionId;
      var rootCode = op.code || profile.operatorCode;
      var divisionOps = await global.GOISData.loadDivisionOperators(sectorId, divisionId);
      global.GOISNetworkTree.render(treeMount, rootCode, divisionOps);
    }
  }

  global.GOISNetwork = { render: render };
})(typeof window !== 'undefined' ? window : global);
