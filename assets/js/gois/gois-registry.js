/**
 * GOIS operator registry — approve, reject, register operators (steward).
 */
(function (global) {
  'use strict';

  function db() {
    return global.db || null;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function generateCode(role) {
    var prefix = role === 'swi' ? 'SWI' : role === 'swd_inv' ? 'SWD' : 'WDS';
    return prefix + '-' + Date.now().toString(36).toUpperCase().slice(-6);
  }

  async function logActivity(profile, type, summary) {
    if (!global.GOISActivity || !global.GOISActivity.logActivity) return;
    await global.GOISActivity.logActivity(profile, type, summary);
  }

  async function approveOperator(docId, profile) {
    var firestore = db();
    if (!firestore) throw new Error('Firestore not configured');
    var ref = firestore.collection('operators').doc(docId);
    var snap = await ref.get();
    if (!snap.exists) throw new Error('Operator not found');
    var data = snap.data();
    await ref.update({
      status: 'active',
      approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
      approvedBy: profile.operatorCode || profile.email
    });
    await logActivity(profile, 'OPERATOR_APPROVED', (data.role || 'operator') + ' · ' + (data.name || data.code) + ' activated');
    return data;
  }

  async function rejectOperator(docId, profile, reason) {
    var firestore = db();
    if (!firestore) throw new Error('Firestore not configured');
    var ref = firestore.collection('operators').doc(docId);
    var snap = await ref.get();
    if (!snap.exists) throw new Error('Operator not found');
    var data = snap.data();
    await ref.update({
      status: 'rejected',
      rejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
      rejectedBy: profile.operatorCode || profile.email,
      rejectReason: reason || ''
    });
    await logActivity(profile, 'OPERATOR_REJECTED', (data.name || data.code) + ' rejected');
  }

  async function registerOperator(profile, form) {
    var firestore = db();
    if (!firestore) throw new Error('Firestore not configured');
    var role = form.role;
    var code = form.code || generateCode(role);
    var docId = code;

    await firestore.collection('operators').doc(docId).set({
      code: code,
      role: role,
      name: form.name,
      email: form.email || '',
      sectorId: form.sectorId || '',
      divisionId: form.divisionId || '',
      parentCode: form.parentCode || '',
      status: form.status || 'pending',
      network: {
        swdInv: role === 'swi' ? 0 : undefined,
        wds: role === 'swi' || role === 'swd_inv' ? 0 : undefined,
        cohorts: role === 'wds' ? 0 : undefined,
        capacity: role === 'wds' ? 0 : undefined
      },
      engines: {
        develop: 0,
        deploy: 0,
        acquire: 0,
        govern: 0
      },
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: profile.operatorCode || profile.email
    }, { merge: true });

    await logActivity(profile, 'OPERATOR_REGISTERED', role.toUpperCase() + ' · ' + form.name + ' · ' + code);
    return code;
  }

  async function loadOperatorsByStatus(status) {
    var firestore = db();
    if (!firestore) return [];
    try {
      var snap = await firestore.collection('operators')
        .where('status', '==', status)
        .limit(50)
        .get();
      return snap.docs.map(function (d) {
        return { id: d.id, data: d.data() };
      });
    } catch (e) {
      console.warn('[GOIS] loadOperatorsByStatus', e);
      return [];
    }
  }

  async function loadActiveOperators() {
    return loadOperatorsByStatus('active');
  }

  function renderRegistry(mountEl, profile) {
    if (!mountEl) return;

    mountEl.innerHTML =
      '<div class="gois-card">' +
      '<h3><i class="fa-solid fa-user-plus"></i> Register operator</h3>' +
      '<form id="goisRegisterForm" style="display:grid;gap:12px;max-width:520px">' +
      '<div class="gois-form-group"><label>Role</label>' +
      '<select id="goisRegRole" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px">' +
      '<option value="swi">SWI Partner</option><option value="swd_inv">SWD-INV Participant</option><option value="wds">WDS</option></select></div>' +
      '<div class="gois-form-group"><label>Name</label><input id="goisRegName" required placeholder="Operator name" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"></div>' +
      '<div class="gois-form-group"><label>Email</label><input id="goisRegEmail" type="email" required placeholder="Required for login on approval" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"></div>' +
      '<div class="gois-form-group"><label>Upline code (optional)</label><input id="goisRegParent" placeholder="SWI code for SWD-INV / WDS" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="gois-form-group"><label>Sector</label><input id="goisRegSector" placeholder="e.g. EdTech" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"></div>' +
      '<div class="gois-form-group"><label>Division</label><input id="goisRegDivision" placeholder="e.g. IV" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"></div></div>' +
      '<button type="submit" class="gois-btn gois-btn-primary"><i class="fa-solid fa-plus"></i> Register to queue</button>' +
      '<p id="goisRegStatus" style="font-size:12px;color:#64748b;margin:0"></p></form></div>' +

      '<div class="gois-card"><h3><i class="fa-solid fa-clock"></i> Pending approval</h3>' +
      '<div id="goisPendingQueue"><div class="gois-empty">Loading…</div></div></div>' +

      '<div class="gois-card"><h3><i class="fa-solid fa-circle-check"></i> Active operators</h3>' +
      '<div id="goisActiveOperators"><div class="gois-empty">Loading…</div></div></div>';

    document.getElementById('goisRegisterForm').addEventListener('submit', async function (e) {
      e.preventDefault();
      var statusEl = document.getElementById('goisRegStatus');
      try {
        var code = await registerOperator(profile, {
          role: document.getElementById('goisRegRole').value,
          name: document.getElementById('goisRegName').value.trim(),
          email: document.getElementById('goisRegEmail').value.trim(),
          sectorId: document.getElementById('goisRegSector').value.trim(),
          divisionId: document.getElementById('goisRegDivision').value.trim(),
          parentCode: document.getElementById('goisRegParent').value.trim(),
          status: 'pending'
        });
        statusEl.textContent = 'Registered ' + code + ' — pending approval or approve below.';
        statusEl.style.color = '#15803d';
        e.target.reset();
        refreshQueues(profile);
        global.dispatchEvent(new CustomEvent('gois-registry-changed'));
      } catch (err) {
        statusEl.textContent = err.message || 'Registration failed';
        statusEl.style.color = '#991b1b';
      }
    });

    refreshQueues(profile);
  }

  function renderPendingQueue(items, profile) {
    var mount = document.getElementById('goisPendingQueue');
    if (!mount) return;
    if (!items.length) {
      mount.innerHTML = '<div class="gois-empty">No pending operator applications.</div>';
      return;
    }
    var rows = items.map(function (row) {
      var d = row.data;
      var emailCell = d.email
        ? esc(d.email)
        : '<span style="color:#991b1b;font-size:12px">Email required</span>';
      return '<tr data-op-id="' + esc(row.id) + '">' +
        '<td><span class="gois-badge gois-badge--arch">' + esc((d.role || '').toUpperCase()) + '</span></td>' +
        '<td><strong>' + esc(d.name || d.code) + '</strong><br><code style="font-size:11px">' + esc(d.code) + '</code><br>' + emailCell + '</td>' +
        '<td>' + esc(d.sectorId) + ' / ' + esc(d.divisionId) + '</td>' +
        '<td style="white-space:nowrap">' +
        '<button type="button" class="gois-btn gois-btn-primary gois-approve-btn" data-id="' + esc(row.id) + '" data-email="' + esc(d.email || '') + '">Approve &amp; login</button> ' +
        '<button type="button" class="gois-btn gois-reject-btn" data-id="' + esc(row.id) + '">Reject</button></td></tr>';
    }).join('');

    mount.innerHTML = '<div class="gois-table-wrap"><table class="gois-table">' +
      '<thead><tr><th>Role</th><th>Operator</th><th>Scope</th><th>Actions</th></tr></thead><tbody>' +
      rows + '</tbody></table></div>';

    mount.querySelectorAll('.gois-approve-btn').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        var opId = btn.getAttribute('data-id');
        var email = btn.getAttribute('data-email') || prompt('Operator email (required for login):');
        if (!email) return;
        var password = prompt('Set password (leave blank to auto-generate):') || '';
        btn.disabled = true;
        btn.textContent = 'Provisioning…';
        try {
          if (global.GOISProvision && global.GOISProvision.approveWithLogin) {
            var result = await global.GOISProvision.approveWithLogin(opId, email.trim(), password || null);
            var msg = 'Approved · ' + result.operatorCode;
            if (result.temporaryPassword) {
              msg += '\n\nTemporary password (share securely):\n' + result.temporaryPassword;
            }
            alert(msg);
          } else {
            await approveOperator(opId, profile);
            alert('Approved (Firestore only — deploy Cloud Functions for login provisioning).');
          }
          refreshQueues(profile);
          global.dispatchEvent(new CustomEvent('gois-registry-changed'));
        } catch (err) {
          alert(err.message || 'Approval failed');
          btn.disabled = false;
          btn.textContent = 'Approve & login';
        }
      });
    });

    mount.querySelectorAll('.gois-reject-btn').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        var reason = prompt('Rejection reason (optional):') || '';
        btn.disabled = true;
        try {
          await rejectOperator(btn.getAttribute('data-id'), profile, reason);
          refreshQueues(profile);
        } catch (err) {
          alert(err.message);
          btn.disabled = false;
        }
      });
    });
  }

    function renderActiveOperators(items, profile) {
    var mount = document.getElementById('goisActiveOperators');
    if (!mount) return;
    var filtered = items.filter(function (row) {
      return (row.data.role || '').toLowerCase() !== 'steward';
    });
    if (!filtered.length) {
      mount.innerHTML = '<div class="gois-empty">No active SWI · SWD-INV · WDS operators yet. Register and approve above.</div>';
      return;
    }
    var rows = filtered.map(function (row) {
      var d = row.data;
      var loginCell = d.loginProvisioned || d.uid
        ? '<span class="gois-badge gois-badge--live">Login OK</span>'
        : '<button type="button" class="gois-btn gois-provision-btn" data-id="' + esc(row.id) + '" data-email="' + esc(d.email || '') + '">Provision login</button>';
      return '<tr><td>' + esc((d.role || '').toUpperCase()) + '</td>' +
        '<td><strong>' + esc(d.name || d.code) + '</strong></td>' +
        '<td><code>' + esc(d.code) + '</code></td>' +
        '<td>' + esc(d.sectorId) + ' / ' + esc(d.divisionId) + '</td>' +
        '<td><span class="gois-badge gois-badge--live">Active</span></td>' +
        '<td>' + loginCell + '</td></tr>';
    }).join('');
    mount.innerHTML = '<div class="gois-table-wrap"><table class="gois-table">' +
      '<thead><tr><th>Role</th><th>Name</th><th>Code</th><th>Scope</th><th>Status</th><th>Login</th></tr></thead><tbody>' +
      rows + '</tbody></table></div>';

    mount.querySelectorAll('.gois-provision-btn').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        var opId = btn.getAttribute('data-id');
        var email = btn.getAttribute('data-email') || prompt('Operator email:');
        if (!email) return;
        var password = prompt('Set password (leave blank to auto-generate):') || '';
        btn.disabled = true;
        try {
          if (!global.GOISProvision || !global.GOISProvision.approveWithLogin) {
            throw new Error('Deploy Cloud Functions (Blaze plan) to provision operator login.');
          }
          var result = await global.GOISProvision.approveWithLogin(opId, email.trim(), password || null);
          var msg = 'Login provisioned · ' + result.operatorCode;
          if (result.temporaryPassword) msg += '\n\nTemporary password:\n' + result.temporaryPassword;
          alert(msg);
          refreshQueues(profile);
        } catch (err) {
          alert(err.message || 'Provisioning failed');
          btn.disabled = false;
        }
      });
    });
  }

  async function refreshQueues(profile) {
    var pending = await loadOperatorsByStatus('pending');
    var active = await loadActiveOperators();
    renderPendingQueue(pending, profile);
    renderActiveOperators(active, profile);
  }

  global.GOISRegistry = {
    renderRegistry: renderRegistry,
    refreshQueues: refreshQueues,
    approveOperator: approveOperator,
    rejectOperator: rejectOperator,
    registerOperator: registerOperator,
    loadActiveOperators: loadActiveOperators,
    loadOperatorsByStatus: loadOperatorsByStatus
  };
})(typeof window !== 'undefined' ? window : global);
