/**
 * GOIS Role & duties — charter content + document filtering per role.
 */
(function (global) {
  'use strict';

  var DOC_JSON = '../../assets/data/workforce-deployment-documents.json';

  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var DUTIES = {
    steward: {
      title: 'BTH Infrastructure Steward',
      lead: 'Master operator for the Global Workforce Infrastructure Exchange — registry authority, econometric publishing, and operator network oversight across 26 sectors.',
      bullets: [
        'Publish verified econometric events to the public GWIX feed',
        'Approve and register SWI · SWD-INV · WDS operators',
        'Monitor WDDAM markets: Develop · Deploy · Acquire · Govern',
        'Audit divisional governance and portfolio continuity',
        'Coordinate institutional documentation exchange'
      ]
    },
    swi: {
      title: 'Strategic Workforce Infrastructure Partner',
      lead: 'Executive-level division steward — governance, ecosystem stewardship, divisional oversight, and strategic coordination.',
      bullets: [
        'Govern division workforce infrastructure across four engines',
        'Oversee 10 SWD-INV participants and 20 WDS structures',
        'Report division performance and continuity to BTH Steward',
        'Execute institutional stewardship and GORP compliance',
        'Expand division network within sector architecture'
      ]
    },
    swd_inv: {
      title: 'Strategic Workforce Development Infrastructure Participant',
      lead: 'Expansion-layer participant — workforce portfolio development, institutional coordination, and infrastructure scaling. Not an investor.',
      bullets: [
        'Drive workforce expansion and portfolio development',
        'Coordinate institutional deployment continuity',
        'Supervise WDS operational structures in your scope',
        'Track acquisition and development engine performance',
        'Report expansion metrics through governed participation'
      ]
    },
    wds: {
      title: 'Workforce Development Structure',
      lead: 'Operational structure — workforce production, deployment readiness, cohort operations, and performance supervision.',
      bullets: [
        'Operate cohort production and deployment readiness',
        'Maintain workforce continuity and placement standards',
        'Execute daily deployment operations per Operations Manual',
        'Track cohort-level performance across WDDAM phases',
        'Report operational activity to SWI / SWD-INV oversight'
      ]
    }
  };

  function roleDocFilter(rank) {
    var map = {
      steward: ['Executive', 'SWI', 'SWD-INV', 'WDS', 'Institutional', 'Government', 'Multilateral'],
      swi: ['Executive', 'SWI', 'SWD-INV', 'Institutional'],
      swd_inv: ['SWD-INV', 'SWI', 'WDS', 'Institutional'],
      wds: ['WDS', 'SWD-INV', 'SWI']
    };
    return map[rank] || map.swi;
  }

  function renderDuties(mountEl, rank) {
    if (!mountEl) return;
    var d = DUTIES[rank] || DUTIES.swi;
    var list = d.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('');
    mountEl.innerHTML =
      '<div class="gois-card">' +
      '<h3><i class="fa-solid fa-book-open"></i> ' + esc(d.title) + ' — duties</h3>' +
      '<p style="font-size:14px;color:#475569;margin:0 0 16px">' + esc(d.lead) + '</p>' +
      '<ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.7;color:#334155">' + list + '</ul>' +
      '<div style="margin-top:16px;display:flex;flex-wrap:wrap;gap:8px">' +
      '<a class="gois-btn gois-btn-primary" href="../../workforce-deployment.html#documentation-center"><i class="fa-solid fa-folder"></i> Documentation exchange</a>' +
      '<a class="gois-btn" href="../../gwix.html"><i class="fa-solid fa-chart-line"></i> GWIX Exchange</a>' +
      '</div></div>';
  }

  async function loadDocuments() {
    var res = await fetch(DOC_JSON);
    if (!res.ok) throw new Error('Could not load document registry');
    return res.json();
  }

  async function renderDocuments(mountEl, rank) {
    if (!mountEl) return;
    mountEl.innerHTML = '<div class="gois-empty">Loading documents…</div>';
    try {
      var docs = await loadDocuments();
      var allowed = roleDocFilter(rank);
      var filtered = docs.filter(function (doc) {
        return (doc.roles || []).some(function (r) { return allowed.indexOf(r) !== -1; });
      });
      if (!filtered.length) {
        mountEl.innerHTML = '<div class="gois-empty">No documents for this role.</div>';
        return;
      }
      var rows = filtered.map(function (doc) {
        return '<tr>' +
          '<td><strong>' + esc(doc.id) + '</strong></td>' +
          '<td>' + esc(doc.title) + '</td>' +
          '<td style="font-size:12px;color:#64748b">' + esc(doc.purpose) + '</td>' +
          '<td><a class="gois-btn" href="../../' + esc(doc.pdf) + '" download><i class="fa-solid fa-download"></i> Download</a></td>' +
          '</tr>';
      }).join('');
      mountEl.innerHTML =
        '<div class="gois-card">' +
        '<h3><i class="fa-solid fa-folder-open"></i> Role-filtered documentation</h3>' +
        '<p style="font-size:13px;color:#64748b;margin:0 0 12px">Documents scoped to your operator role per Workforce Deployment V2 constitution.</p>' +
        '<div class="gois-table-wrap"><table class="gois-table">' +
        '<thead><tr><th>#</th><th>Document</th><th>Purpose</th><th></th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div></div>';
    } catch (err) {
      mountEl.innerHTML = '<div class="gois-empty" style="color:#991b1b">' + esc(err.message) + '</div>';
    }
  }

  global.GOISCharter = {
    renderDuties: renderDuties,
    renderDocuments: renderDocuments
  };
})(typeof window !== 'undefined' ? window : global);
