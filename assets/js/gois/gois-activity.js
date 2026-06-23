/**
 * Operator activity log + econometric event publishing (Firestore).
 */
(function (global) {
  'use strict';

  var EVENT_META = {
    SWI_ACTIVATED: { label: 'SWI Partner Activated', feedView: 'roles', delta: 'SWI' },
    SWD_INV_ACTIVATED: { label: 'SWD-INV Activated', feedView: 'roles', delta: 'SWD-INV' },
    WDS_ACTIVATED: { label: 'WDS Activated', feedView: 'roles', delta: 'WDS' },
    COHORT_DEPLOYED: { label: 'Cohort Deployed', feedView: 'portfolio', delta: '+50' },
    DIVISION_CONFIRMED: { label: 'Division Confirmed', feedView: 'divisions', delta: '8.76B' },
    SECTOR_LIVE: { label: 'Sector Live', feedView: 'sectors', delta: 'LIVE' },
    DEVELOPMENT_OUTPUT: { label: 'Development Output', feedView: 'markets', delta: 'DEV' },
    DEPLOYMENT_LIVE: { label: 'Deployment Live', feedView: 'markets', delta: 'DEP' },
    ACQUISITION_OPEN: { label: 'Acquisition Pathway', feedView: 'markets', delta: 'ACQ' },
    GOVERNANCE_CYCLE: { label: 'Governance Cycle', feedView: 'markets', delta: 'GOV' },
    INSTITUTIONAL_MANDATE: { label: 'Institutional Mandate', feedView: 'institutions', delta: 'LIVE' }
  };

  function db() {
    return global.db || null;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function formatTime(ts) {
    if (!ts) return '—';
    var d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  }

  async function logActivity(profile, type, summary, extra) {
    var firestore = db();
    if (!firestore || !profile) return;
    var payload = {
      operatorCode: profile.operatorCode || 'SYSTEM',
      operatorRole: profile.role || '',
      type: type,
      summary: summary,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    if (extra) Object.assign(payload, extra);
    await firestore.collection('operator_activities').add(payload);
  }

  function renderActivityList(mountEl, items) {
    if (!mountEl) return;
    if (!items || !items.length) {
      mountEl.innerHTML = '<div class="gois-empty">No activities recorded yet.</div>';
      return;
    }
    var html = items.map(function (item) {
      return '<div class="gois-activity-item">' +
        '<div class="gois-activity-time">' + esc(formatTime(item.createdAt)) + '</div>' +
        '<div><strong>' + esc(item.type || 'Activity') + '</strong>' +
        (item.operatorCode ? ' · <code style="font-size:11px">' + esc(item.operatorCode) + '</code>' : '') +
        '<br><span style="color:#64748b">' + esc(item.summary || item.message || '') + '</span></div></div>';
    }).join('');
    mountEl.innerHTML = '<div class="gois-activity-list">' + html + '</div>';
  }

  async function loadActivities(profile, limit, isSteward) {
    if (isSteward && global.GOISData) {
      return global.GOISData.loadAllActivities(limit || 50);
    }
    var firestore = db();
    if (!firestore || !profile || !profile.operatorCode) return [];
    limit = limit || 25;
    try {
      var snap = await firestore.collection('operator_activities')
        .where('operatorCode', '==', profile.operatorCode)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();
      return snap.docs.map(function (d) {
        return Object.assign({ id: d.id }, d.data());
      });
    } catch (e) {
      console.warn('[GOIS] activity load', e);
      return global.GOISData ? global.GOISData.loadAllActivities(limit) : [];
    }
  }

  async function publishEconometricEvent(payload, profile) {
    var firestore = db();
    if (!firestore) throw new Error('Firestore not configured');
    var meta = EVENT_META[payload.type] || {};
    var doc = {
      type: payload.type,
      scope: payload.scope,
      summary: payload.summary,
      subject: payload.scope,
      text: payload.summary,
      delta: payload.delta || meta.delta || 'LIVE',
      feedView: payload.feedView || meta.feedView || 'sectors',
      source: 'bth_steward',
      published: true,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    var ref = await firestore.collection('gwix_econometric_events').add(doc);
    if (profile) {
      await logActivity(profile, 'ECONOMETRIC_PUBLISHED', payload.type + ' · ' + payload.scope + ' · ' + payload.summary, { eventId: ref.id });
    }
    return doc;
  }

  function renderRecentEvents(mountEl) {
    if (!mountEl) return;
    mountEl.innerHTML = '<div class="gois-empty">Loading recent publications…</div>';
    if (!global.GOISData) return;
    global.GOISData.loadRecentEconometricEvents(15).then(function (events) {
      if (!events.length) {
        mountEl.innerHTML = '<div class="gois-empty">No econometric events published yet. Use the form above — they appear here and on GWIX Exchange within seconds.</div>';
        return;
      }
      var rows = events.map(function (ev) {
        return '<tr><td style="font-family:DM Mono,monospace;font-size:11px">' + esc(formatTime(ev.createdAt)) + '</td>' +
          '<td>' + esc(ev.type) + '</td>' +
          '<td><strong>' + esc(ev.scope || ev.subject) + '</strong><br><span style="color:#64748b;font-size:12px">' + esc(ev.summary || ev.text) + '</span></td>' +
          '<td><span class="gois-badge gois-badge--live">' + esc(ev.delta || 'LIVE') + '</span></td></tr>';
      }).join('');
      mountEl.innerHTML = '<div class="gois-table-wrap"><table class="gois-table">' +
        '<thead><tr><th>Time</th><th>Type</th><th>Event</th><th>Delta</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    });
  }

  function renderEconometricRegistry(mountEl, rank, profile) {
    if (!mountEl || rank !== 'steward') return;

    var typeOptions = Object.keys(EVENT_META).map(function (key) {
      return '<option value="' + key + '">' + EVENT_META[key].label + '</option>';
    }).join('');

    mountEl.innerHTML =
      '<div class="gois-card">' +
      '<h3><i class="fa-solid fa-satellite-dish"></i> Econometric registry</h3>' +
      '<p style="font-size:13px;color:#64748b;margin:0 0 16px">Publish verified events to Firestore → live on <a href="../../gwix.html" target="_blank" rel="noopener">GWIX Exchange</a> Market Activity Feed.</p>' +
      '<form id="goisEconometricForm">' +
      '<div class="gois-form-group"><label>Event type</label>' +
      '<select id="goisEventType" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px">' + typeOptions + '</select></div>' +
      '<div class="gois-form-group"><label>Feed tab</label>' +
      '<select id="goisEventFeedView" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px">' +
      '<option value="sectors">Sectors</option><option value="divisions">Divisions</option><option value="markets">Markets</option>' +
      '<option value="roles">Roles</option><option value="institutions">Institutions</option><option value="portfolio">Portfolio</option></select></div>' +
      '<div class="gois-form-group"><label>Subject (sector / division / role)</label>' +
      '<input type="text" id="goisEventScope" placeholder="e.g. EdTech · Division IV" required style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"></div>' +
      '<div class="gois-form-group"><label>Summary</label>' +
      '<input type="text" id="goisEventSummary" placeholder="Brief econometric summary" required style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"></div>' +
      '<div class="gois-form-group"><label>Delta badge</label>' +
      '<input type="text" id="goisEventDelta" placeholder="e.g. LIVE, +50, 8.76B, SWI" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"></div>' +
      '<button type="submit" class="gois-btn gois-btn-primary"><i class="fa-solid fa-broadcast-tower"></i> Publish to GWIX feed</button>' +
      '<p id="goisEventStatus" style="font-size:12px;margin-top:12px;color:#64748b"></p></form></div>' +
      '<div class="gois-card"><h3><i class="fa-solid fa-clock-rotate-left"></i> Recent publications</h3><div id="goisRecentEvents"></div></div>';

    var typeSelect = document.getElementById('goisEventType');
    var feedSelect = document.getElementById('goisEventFeedView');
    var deltaInput = document.getElementById('goisEventDelta');

    typeSelect.addEventListener('change', function () {
      var meta = EVENT_META[typeSelect.value];
      if (meta && feedSelect) feedSelect.value = meta.feedView;
      if (meta && deltaInput && !deltaInput.value) deltaInput.value = meta.delta;
    });

    renderRecentEvents(document.getElementById('goisRecentEvents'));

    var form = document.getElementById('goisEconometricForm');
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var status = document.getElementById('goisEventStatus');
      status.textContent = 'Publishing…';
      try {
        await publishEconometricEvent({
          type: typeSelect.value,
          scope: document.getElementById('goisEventScope').value.trim(),
          summary: document.getElementById('goisEventSummary').value.trim(),
          feedView: feedSelect.value,
          delta: document.getElementById('goisEventDelta').value.trim() || (EVENT_META[typeSelect.value] || {}).delta
        }, profile);
        status.textContent = 'Published — live on GWIX Exchange feed now.';
        status.style.color = '#15803d';
        form.reset();
        renderRecentEvents(document.getElementById('goisRecentEvents'));
        global.dispatchEvent(new CustomEvent('gois-econometric-published'));
      } catch (err) {
        status.textContent = err.message || 'Publish failed.';
        status.style.color = '#991b1b';
      }
    });
  }

  function renderOperatorRegistry(mountEl, profile) {
    if (!mountEl || !global.GOISRegistry) return;
    global.GOISRegistry.renderRegistry(mountEl, profile);
  }

  global.GOISActivity = {
    logActivity: logActivity,
    loadActivities: loadActivities,
    renderActivityList: renderActivityList,
    renderEconometricRegistry: renderEconometricRegistry,
    renderOperatorRegistry: renderOperatorRegistry,
    publishEconometricEvent: publishEconometricEvent,
    EVENT_META: EVENT_META
  };
})(typeof window !== 'undefined' ? window : global);
