/**
 * GOIS reporting — CSV exports for activities, engines, operators.
 */
(function (global) {
  'use strict';

  function downloadCsv(filename, rows) {
    var csv = rows.map(function (row) {
      return row.map(function (cell) {
        var s = String(cell == null ? '' : cell);
        if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
        return s;
      }).join(',');
    }).join('\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function formatTime(ts) {
    if (!ts) return '';
    var d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toISOString();
  }

  async function exportActivityCsv(profile, isSteward) {
    var items = [];
    if (isSteward && global.GOISData) {
      items = await global.GOISData.loadAllActivities(200);
    } else if (global.GOISActivity) {
      items = await global.GOISActivity.loadActivities(profile, 200);
    }
    var rows = [['timestamp', 'operatorCode', 'type', 'summary']];
    items.forEach(function (item) {
      rows.push([formatTime(item.createdAt), item.operatorCode || '', item.type || '', item.summary || item.message || '']);
    });
    downloadCsv('gois-activity-' + Date.now() + '.csv', rows);
  }

  async function exportEngineCsv(profile, operatorData) {
    var op = operatorData || {};
    var engines = op.engines || {};
    var rows = [
      ['engine', 'fcfa_value'],
      ['develop', engines.develop || 0],
      ['deploy', engines.deploy || 0],
      ['acquire', engines.acquire || 0],
      ['govern', engines.govern || 0]
    ];
    downloadCsv('gois-engines-' + (profile.operatorCode || 'export') + '.csv', rows);
  }

  async function exportOperatorsCsv() {
    if (!global.GOISRegistry || !global.GOISRegistry.loadActiveOperators) return;
    var active = await global.GOISRegistry.loadActiveOperators();
    var rows = [['code', 'role', 'name', 'email', 'sectorId', 'divisionId', 'status']];
    active.forEach(function (row) {
      var d = row.data;
      rows.push([d.code, d.role, d.name, d.email, d.sectorId, d.divisionId, d.status]);
    });
    downloadCsv('gois-operators-' + Date.now() + '.csv', rows);
  }

  function renderReports(mountEl, profile, operatorData, isSteward) {
    if (!mountEl) return;
    mountEl.innerHTML =
      '<div class="gois-card"><h3><i class="fa-solid fa-file-export"></i> Reports</h3>' +
      '<p style="font-size:13px;color:#64748b;margin:0 0 12px">Export governance data for institutional reporting.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
      '<button type="button" class="gois-btn" id="goisExportActivity"><i class="fa-solid fa-file-csv"></i> Activity CSV</button>' +
      '<button type="button" class="gois-btn" id="goisExportEngines"><i class="fa-solid fa-file-csv"></i> Engine summary</button>' +
      (isSteward ? '<button type="button" class="gois-btn" id="goisExportOperators"><i class="fa-solid fa-file-csv"></i> Operator registry</button>' : '') +
      '</div></div>';

    document.getElementById('goisExportActivity').addEventListener('click', function () {
      exportActivityCsv(profile, isSteward);
    });
    document.getElementById('goisExportEngines').addEventListener('click', function () {
      exportEngineCsv(profile, operatorData);
    });
    if (isSteward) {
      document.getElementById('goisExportOperators').addEventListener('click', exportOperatorsCsv);
    }
  }

  global.GOISReporting = { renderReports: renderReports, exportActivityCsv: exportActivityCsv };
})(typeof window !== 'undefined' ? window : global);
