/**
 * GOIS operator registry — approve, reject, register operators (steward).
 */
(function (global) {
  "use strict";

  function db() {
    return global.db || null;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function generateCode(role) {
    var prefix =
      role === "swi"
        ? "SWI"
        : role === "swd_inv"
          ? "SWD"
          : role === "cohort_leader"
            ? "CL"
            : role === "cohort_member"
              ? "CM"
              : "WDS";
    return prefix + "-" + Date.now().toString(36).toUpperCase().slice(-6);
  }

  async function logActivity(profile, type, summary) {
    if (!global.GOISActivity || !global.GOISActivity.logActivity) return;
    await global.GOISActivity.logActivity(profile, type, summary);
  }

  async function approveOperator(docId, profile) {
    var firestore = db();
    if (!firestore) throw new Error("Firestore not configured");
    var ref = firestore.collection("operators").doc(docId);
    var snap = await ref.get();
    if (!snap.exists) throw new Error("Operator not found");
    var data = snap.data();
    await ref.update({
      status: "active",
      approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
      approvedBy: profile.operatorCode || profile.email,
    });
    await logActivity(
      profile,
      "OPERATOR_APPROVED",
      (data.role || "operator") +
        " · " +
        (data.name || data.code) +
        " activated",
    );
    return data;
  }

  async function rejectOperator(docId, profile, reason) {
    var firestore = db();
    if (!firestore) throw new Error("Firestore not configured");
    var ref = firestore.collection("operators").doc(docId);
    var snap = await ref.get();
    if (!snap.exists) throw new Error("Operator not found");
    var data = snap.data();
    await ref.update({
      status: "rejected",
      rejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
      rejectedBy: profile.operatorCode || profile.email,
      rejectReason: reason || "",
    });
    await logActivity(
      profile,
      "OPERATOR_REJECTED",
      (data.name || data.code) + " rejected",
    );
  }

  async function registerOperator(profile, form) {
    var firestore = db();
    if (!firestore) throw new Error("Firestore not configured");
    var role = form.role;
    var code = form.code || generateCode(role);
    var docId = code;

    await firestore
      .collection("operators")
      .doc(docId)
      .set(
        {
          code: code,
          role: role,
          name: form.name,
          email: form.email || "",
          sectorId: form.sectorId || "",
          divisionId: form.divisionId || "",
          parentCode: form.parentCode || "",
          cohortId: form.cohortId || "",
          teamId: form.teamId || "",
          memberId: form.memberId || "",
          leaderCode: form.leaderCode || "",
          workforceLevel: form.workforceLevel || "",
          status: form.status || "pending",
          network: {
            swdInv: role === "swi" ? 0 : undefined,
            wds: role === "swi" || role === "swd_inv" ? 0 : undefined,
            cohorts: role === "wds" ? 0 : undefined,
            capacity: role === "wds" ? 0 : undefined,
          },
          engines: {
            develop: 0,
            deploy: 0,
            acquire: 0,
            govern: 0,
          },
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          createdBy: profile.operatorCode || profile.email,
        },
        { merge: true },
      );

    await logActivity(
      profile,
      "OPERATOR_REGISTERED",
      role.toUpperCase() + " · " + form.name + " · " + code,
    );
    return code;
  }

  async function loadOperatorsByStatus(status) {
    var firestore = db();
    if (!firestore) return [];
    try {
      var snap = await firestore
        .collection("operators")
        .where("status", "==", status)
        .limit(50)
        .get();
      return snap.docs.map(function (d) {
        return { id: d.id, data: d.data() };
      });
    } catch (e) {
      console.warn("[GOIS] loadOperatorsByStatus", e);
      return [];
    }
  }

  async function loadActiveOperators() {
    return loadOperatorsByStatus("active");
  }

  function generateCohortId(form) {
    var sector = (form.sectorId || "SECTOR")
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-");
    var division = (form.divisionId || "DIV")
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-");
    var slot = form.slotNumber || "1";
    return (
      "COHORT-" +
      sector +
      "-" +
      division +
      "-" +
      (form.wdsCode || "WDS") +
      "-" +
      slot
    );
  }

  async function provisionCohortSlot(profile, form) {
    var firestore = db();
    if (!firestore) throw new Error("Firestore not configured");
    var cohortId = form.cohortId || generateCohortId(form);
    var signupUrl =
      "/operator/cohort-signup.html?cohortId=" +
      encodeURIComponent(cohortId) +
      "&wdsCode=" +
      encodeURIComponent(form.wdsCode) +
      "&sectorId=" +
      encodeURIComponent(form.sectorId || "") +
      "&divisionId=" +
      encodeURIComponent(form.divisionId || "");

    await firestore
      .collection("cohorts")
      .doc(cohortId)
      .set(
        {
          code: cohortId,
          name: form.name || cohortId,
          status: "recruiting",
          lifecycleState: "recruiting",
          infrastructureMode: form.infrastructureMode || "model",
          countsTowardMainstream: form.countsTowardMainstream === true,
          signupOpen: true,
          signupUrl: signupUrl,
          sectorId: form.sectorId || "",
          divisionId: form.divisionId || "",
          swiCode: form.swiCode || "",
          swdInvCode: form.swdInvCode || "",
          wdsCode: form.wdsCode || "",
          slotNumber: Number(form.slotNumber || 1),
          targetParticipants: 50,
          leaderTarget: 5,
          teamMemberTarget: 10,
          targets: {
            cohortValueFcfa: 438000000,
            developmentValueFcfa: 438000000,
            deploymentAnnualTargetFcfa: 4380000000,
            acquisitionValueFcfa: 438000000,
            governanceAnnualTargetFcfa: 43800000,
          },
          actuals: {
            developmentValueFcfa: 0,
            deploymentValueFcfa: 0,
            acquisitionValueFcfa: 0,
            governanceValueFcfa: 0,
          },
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          createdBy: profile.operatorCode || profile.email,
        },
        { merge: true },
      );

    await firestore
      .collection("wds_cohort_slots")
      .doc(cohortId)
      .set(
        {
          cohortId: cohortId,
          sectorId: form.sectorId || "",
          divisionId: form.divisionId || "",
          swiCode: form.swiCode || "",
          swdInvCode: form.swdInvCode || "",
          wdsCode: form.wdsCode || "",
          slotNumber: Number(form.slotNumber || 1),
          infrastructureMode: form.infrastructureMode || "model",
          countsTowardMainstream: form.countsTowardMainstream === true,
          signupOpen: true,
          signupUrl: signupUrl,
          status: "recruiting",
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedBy: profile.operatorCode || profile.email,
        },
        { merge: true },
      );

    await logActivity(
      profile,
      "COHORT_SLOT_PROVISIONED",
      cohortId + " · " + (form.wdsCode || "WDS") + " · signup opened",
    );
    return { cohortId: cohortId, signupUrl: signupUrl };
  }

  async function loadCohortApplications(status) {
    var firestore = db();
    if (!firestore) return [];
    try {
      var snap = await firestore
        .collection("cohort_applications")
        .where("status", "==", status || "submitted")
        .limit(100)
        .get();
      return snap.docs.map(function (d) {
        return { id: d.id, data: d.data() };
      });
    } catch (e) {
      console.warn("[GOIS] loadCohortApplications", e);
      return [];
    }
  }

  function renderRegistry(mountEl, profile) {
    if (!mountEl) return;

    mountEl.innerHTML =
      '<div class="gois-card">' +
      '<h3><i class="fa-solid fa-user-plus"></i> Register operator</h3>' +
      '<form id="goisRegisterForm" style="display:grid;gap:12px;max-width:520px">' +
      '<div class="gois-form-group"><label>Role</label>' +
      '<select id="goisRegRole" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px">' +
      '<option value="swi">SWI Partner</option><option value="swd_inv">SWD-INV Participant</option><option value="wds">WDS</option>' +
      '<option value="cohort_leader">Cohort Team Leader</option><option value="cohort_member">Cohort Member</option></select></div>' +
      '<div class="gois-form-group"><label>Name</label><input id="goisRegName" required placeholder="Operator name" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"></div>' +
      '<div class="gois-form-group"><label>Email</label><input id="goisRegEmail" type="email" required placeholder="Required for login on approval" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"></div>' +
      '<div class="gois-form-group"><label>Upline code (optional)</label><input id="goisRegParent" placeholder="SWI code for SWD-INV / WDS" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="gois-form-group"><label>Sector</label><input id="goisRegSector" placeholder="e.g. EdTech" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"></div>' +
      '<div class="gois-form-group"><label>Division</label><input id="goisRegDivision" placeholder="e.g. IV" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"></div></div>' +
      '<div class="gois-form-group"><label>Cohort ID (cohort roles)</label><input id="goisRegCohort" placeholder="e.g. COHORT-001" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="gois-form-group"><label>Team ID</label><input id="goisRegTeam" placeholder="e.g. TEAM-001-A" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"></div>' +
      '<div class="gois-form-group"><label>Member ID</label><input id="goisRegMember" placeholder="For cohort members" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="gois-form-group"><label>Leader code</label><input id="goisRegLeader" placeholder="For cohort members" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"></div>' +
      '<div class="gois-form-group"><label>Workforce level</label><select id="goisRegLevel" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px"><option value="">—</option><option value="1">Level 1</option><option value="2">Level 2</option><option value="3">Level 3</option><option value="4">Level 4</option><option value="5">Level 5</option></select></div></div>' +
      '<button type="submit" class="gois-btn gois-btn-primary"><i class="fa-solid fa-plus"></i> Register to queue</button>' +
      '<p id="goisRegStatus" style="font-size:12px;color:#64748b;margin:0"></p></form></div>' +
      '<div class="gois-card"><h3><i class="fa-solid fa-diagram-project"></i> Provision WDS cohort slot</h3>' +
      '<form id="goisCohortSlotForm" style="display:grid;gap:12px;max-width:720px">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="gois-form-group"><label>Sector</label><input id="goisSlotSector" required placeholder="e.g. EdTech"></div>' +
      '<div class="gois-form-group"><label>Division</label><input id="goisSlotDivision" required placeholder="e.g. IV"></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="gois-form-group"><label>SWI code</label><input id="goisSlotSwi" placeholder="SWI-..."></div>' +
      '<div class="gois-form-group"><label>SWD-INV code</label><input id="goisSlotSwd" placeholder="SWD-..."></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="gois-form-group"><label>WDS code</label><input id="goisSlotWds" required placeholder="WDS-..."></div>' +
      '<div class="gois-form-group"><label>Slot #</label><select id="goisSlotNumber"><option value="1">Slot 1</option><option value="2">Slot 2</option></select></div></div>' +
      '<div class="gois-form-group"><label>Cohort ID override (optional)</label><input id="goisSlotCohort" placeholder="Auto-generated if blank"></div>' +
      '<div class="gois-form-group"><label>Cohort display name</label><input id="goisSlotName" placeholder="e.g. EdTech IV Model Cohort 01"></div>' +
      '<button type="submit" class="gois-btn gois-btn-primary"><i class="fa-solid fa-link"></i> Provision cohort slot & signup link</button>' +
      '<p id="goisSlotStatus" style="font-size:12px;color:#64748b;margin:0"></p></form></div>' +
      '<div class="gois-card"><h3><i class="fa-solid fa-inbox"></i> Cohort application review</h3>' +
      '<div id="goisCohortApplications"><div class="gois-empty">Loading…</div></div></div>' +
      '<div class="gois-card"><h3><i class="fa-solid fa-clock"></i> Pending approval</h3>' +
      '<div id="goisPendingQueue"><div class="gois-empty">Loading…</div></div></div>' +
      '<div class="gois-card"><h3><i class="fa-solid fa-circle-check"></i> Active operators</h3>' +
      '<div id="goisActiveOperators"><div class="gois-empty">Loading…</div></div></div>';

    document
      .getElementById("goisRegisterForm")
      .addEventListener("submit", async function (e) {
        e.preventDefault();
        var statusEl = document.getElementById("goisRegStatus");
        try {
          var code = await registerOperator(profile, {
            role: document.getElementById("goisRegRole").value,
            name: document.getElementById("goisRegName").value.trim(),
            email: document.getElementById("goisRegEmail").value.trim(),
            sectorId: document.getElementById("goisRegSector").value.trim(),
            divisionId: document.getElementById("goisRegDivision").value.trim(),
            parentCode: document.getElementById("goisRegParent").value.trim(),
            cohortId: document.getElementById("goisRegCohort").value.trim(),
            teamId: document.getElementById("goisRegTeam").value.trim(),
            memberId: document.getElementById("goisRegMember").value.trim(),
            leaderCode: document.getElementById("goisRegLeader").value.trim(),
            workforceLevel: document.getElementById("goisRegLevel").value,
            status: "pending",
          });
          statusEl.textContent =
            "Registered " + code + " — pending approval or approve below.";
          statusEl.style.color = "#15803d";
          e.target.reset();
          refreshQueues(profile);
          global.dispatchEvent(new CustomEvent("gois-registry-changed"));
        } catch (err) {
          statusEl.textContent = err.message || "Registration failed";
          statusEl.style.color = "#991b1b";
        }
      });

    document
      .getElementById("goisCohortSlotForm")
      .addEventListener("submit", async function (e) {
        e.preventDefault();
        var statusEl = document.getElementById("goisSlotStatus");
        statusEl.textContent = "Provisioning cohort slot…";
        statusEl.style.color = "#64748b";
        try {
          var result = await provisionCohortSlot(profile, {
            sectorId: document.getElementById("goisSlotSector").value.trim(),
            divisionId: document
              .getElementById("goisSlotDivision")
              .value.trim(),
            swiCode: document.getElementById("goisSlotSwi").value.trim(),
            swdInvCode: document.getElementById("goisSlotSwd").value.trim(),
            wdsCode: document.getElementById("goisSlotWds").value.trim(),
            slotNumber: document.getElementById("goisSlotNumber").value,
            cohortId: document.getElementById("goisSlotCohort").value.trim(),
            name: document.getElementById("goisSlotName").value.trim(),
            infrastructureMode: "model",
          });
          statusEl.innerHTML =
            "Provisioned <code>" +
            esc(result.cohortId) +
            '</code> · <a href="' +
            esc(result.signupUrl) +
            '" target="_blank" rel="noopener">Open signup link</a>';
          statusEl.style.color = "#15803d";
          e.target.reset();
          global.dispatchEvent(new CustomEvent("gois-registry-changed"));
        } catch (err) {
          statusEl.textContent =
            err.message || "Cohort slot provisioning failed";
          statusEl.style.color = "#991b1b";
        }
      });

    refreshQueues(profile);
    refreshCohortApplications(profile);
  }

  function renderPendingQueue(items, profile) {
    var mount = document.getElementById("goisPendingQueue");
    if (!mount) return;
    if (!items.length) {
      mount.innerHTML =
        '<div class="gois-empty">No pending operator applications.</div>';
      return;
    }
    var rows = items
      .map(function (row) {
        var d = row.data;
        var emailCell = d.email
          ? esc(d.email)
          : '<span style="color:#991b1b;font-size:12px">Email required</span>';
        return (
          '<tr data-op-id="' +
          esc(row.id) +
          '">' +
          '<td><span class="gois-badge gois-badge--arch">' +
          esc((d.role || "").toUpperCase()) +
          "</span></td>" +
          "<td><strong>" +
          esc(d.name || d.code) +
          '</strong><br><code style="font-size:11px">' +
          esc(d.code) +
          "</code><br>" +
          emailCell +
          "</td>" +
          "<td>" +
          esc(d.sectorId) +
          " / " +
          esc(d.divisionId) +
          "</td>" +
          '<td style="white-space:nowrap">' +
          '<button type="button" class="gois-btn gois-btn-primary gois-approve-btn" data-id="' +
          esc(row.id) +
          '" data-email="' +
          esc(d.email || "") +
          '">Approve &amp; login</button> ' +
          '<button type="button" class="gois-btn gois-reject-btn" data-id="' +
          esc(row.id) +
          '">Reject</button></td></tr>'
        );
      })
      .join("");

    mount.innerHTML =
      '<div class="gois-table-wrap"><table class="gois-table">' +
      "<thead><tr><th>Role</th><th>Operator</th><th>Scope</th><th>Actions</th></tr></thead><tbody>" +
      rows +
      "</tbody></table></div>";

    mount.querySelectorAll(".gois-approve-btn").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var opId = btn.getAttribute("data-id");
        var email =
          btn.getAttribute("data-email") ||
          prompt("Operator email (required for login):");
        if (!email) return;
        var password =
          prompt("Set password (leave blank to auto-generate):") || "";
        btn.disabled = true;
        btn.textContent = "Provisioning…";
        try {
          if (global.GOISProvision && global.GOISProvision.approveWithLogin) {
            var result = await global.GOISProvision.approveWithLogin(
              opId,
              email.trim(),
              password || null,
            );
            var msg = "Approved · " + result.operatorCode;
            if (result.temporaryPassword) {
              msg +=
                "\n\nTemporary password (share securely):\n" +
                result.temporaryPassword;
            }
            alert(msg);
          } else {
            await approveOperator(opId, profile);
            alert(
              "Approved (Firestore only — deploy Cloud Functions for login provisioning).",
            );
          }
          refreshQueues(profile);
          global.dispatchEvent(new CustomEvent("gois-registry-changed"));
        } catch (err) {
          alert(err.message || "Approval failed");
          btn.disabled = false;
          btn.textContent = "Approve & login";
        }
      });
    });

    mount.querySelectorAll(".gois-reject-btn").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var reason = prompt("Rejection reason (optional):") || "";
        btn.disabled = true;
        try {
          await rejectOperator(btn.getAttribute("data-id"), profile, reason);
          refreshQueues(profile);
        } catch (err) {
          alert(err.message);
          btn.disabled = false;
        }
      });
    });
  }

  function renderActiveOperators(items, profile) {
    var mount = document.getElementById("goisActiveOperators");
    if (!mount) return;
    var filtered = items.filter(function (row) {
      return (row.data.role || "").toLowerCase() !== "steward";
    });
    if (!filtered.length) {
      mount.innerHTML =
        '<div class="gois-empty">No active SWI · SWD-INV · WDS operators yet. Register and approve above.</div>';
      return;
    }
    var rows = filtered
      .map(function (row) {
        var d = row.data;
        var loginCell =
          d.loginProvisioned || d.uid
            ? '<span class="gois-badge gois-badge--live">Login OK</span>'
            : '<button type="button" class="gois-btn gois-provision-btn" data-id="' +
              esc(row.id) +
              '" data-email="' +
              esc(d.email || "") +
              '">Provision login</button>';
        return (
          "<tr><td>" +
          esc((d.role || "").toUpperCase()) +
          "</td>" +
          "<td><strong>" +
          esc(d.name || d.code) +
          "</strong></td>" +
          "<td><code>" +
          esc(d.code) +
          "</code></td>" +
          "<td>" +
          esc(d.sectorId) +
          " / " +
          esc(d.divisionId) +
          "</td>" +
          '<td><span class="gois-badge gois-badge--live">Active</span></td>' +
          "<td>" +
          loginCell +
          "</td></tr>"
        );
      })
      .join("");
    mount.innerHTML =
      '<div class="gois-table-wrap"><table class="gois-table">' +
      "<thead><tr><th>Role</th><th>Name</th><th>Code</th><th>Scope</th><th>Status</th><th>Login</th></tr></thead><tbody>" +
      rows +
      "</tbody></table></div>";

    mount.querySelectorAll(".gois-provision-btn").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var opId = btn.getAttribute("data-id");
        var email = btn.getAttribute("data-email") || prompt("Operator email:");
        if (!email) return;
        var password =
          prompt("Set password (leave blank to auto-generate):") || "";
        btn.disabled = true;
        try {
          if (!global.GOISProvision || !global.GOISProvision.approveWithLogin) {
            throw new Error(
              "Deploy Cloud Functions (Blaze plan) to provision operator login.",
            );
          }
          var result = await global.GOISProvision.approveWithLogin(
            opId,
            email.trim(),
            password || null,
          );
          var msg = "Login provisioned · " + result.operatorCode;
          if (result.temporaryPassword)
            msg += "\n\nTemporary password:\n" + result.temporaryPassword;
          alert(msg);
          refreshQueues(profile);
        } catch (err) {
          alert(err.message || "Provisioning failed");
          btn.disabled = false;
        }
      });
    });
  }

  function renderCohortApplications(items, profile) {
    var mount = document.getElementById("goisCohortApplications");
    if (!mount) return;
    if (!items.length) {
      mount.innerHTML =
        '<div class="gois-empty">No submitted cohort applications.</div>';
      return;
    }
    var rows = items
      .map(function (row) {
        var d = row.data;
        return (
          '<tr data-app-id="' +
          esc(row.id) +
          '"><td><strong>' +
          esc(d.name || "Applicant") +
          "</strong><br>" +
          esc(d.email || "") +
          "</td><td>" +
          esc(d.applicantType || "member") +
          "</td><td><code>" +
          esc(d.cohortId || "") +
          "</code><br>" +
          esc(d.wdsCode || "") +
          "</td><td>" +
          esc(d.requestedWorkforceLevel || "—") +
          '</td><td style="white-space:nowrap">' +
          '<button type="button" class="gois-btn gois-btn-primary gois-app-approve" data-id="' +
          esc(row.id) +
          '" data-type="' +
          esc(d.applicantType || "member") +
          '">Approve &amp; login</button> ' +
          '<button type="button" class="gois-btn gois-app-reject" data-id="' +
          esc(row.id) +
          '">Reject</button></td></tr>'
        );
      })
      .join("");

    mount.innerHTML =
      '<div class="gois-table-wrap"><table class="gois-table">' +
      "<thead><tr><th>Applicant</th><th>Type</th><th>Cohort / WDS</th><th>Level</th><th>Actions</th></tr></thead><tbody>" +
      rows +
      "</tbody></table></div>";

    mount.querySelectorAll(".gois-app-approve").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var applicationId = btn.getAttribute("data-id");
        var type = btn.getAttribute("data-type") || "member";
        var role = type === "leader" ? "cohort_leader" : "cohort_member";
        var teamId =
          prompt(
            "Team ID (required for members; blank auto-generates for leaders):",
          ) || "";
        var leaderCode =
          role === "cohort_member"
            ? prompt("Leader code for member (optional):") || ""
            : "";
        var password =
          prompt("Set password (leave blank to auto-generate):") || "";
        btn.disabled = true;
        btn.textContent = "Provisioning…";
        try {
          if (
            !global.GOISProvision ||
            !global.GOISProvision.approveCohortApplication
          ) {
            throw new Error(
              "Deploy Cloud Functions to approve cohort applications.",
            );
          }
          var result = await global.GOISProvision.approveCohortApplication({
            applicationId: applicationId,
            role: role,
            teamId: teamId.trim(),
            leaderCode: leaderCode.trim(),
            password: password || null,
          });
          var msg = "Provisioned · " + result.operatorCode;
          if (result.temporaryPassword) {
            msg += "\n\nTemporary password:\n" + result.temporaryPassword;
          }
          alert(msg);
          refreshCohortApplications(profile);
          refreshQueues(profile);
        } catch (err) {
          alert(err.message || "Application approval failed");
          btn.disabled = false;
          btn.textContent = "Approve & login";
        }
      });
    });

    mount.querySelectorAll(".gois-app-reject").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var reason = prompt("Rejection reason (optional):") || "";
        btn.disabled = true;
        try {
          var firestore = db();
          await firestore
            .collection("cohort_applications")
            .doc(btn.getAttribute("data-id"))
            .update({
              status: "rejected",
              rejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
              rejectedBy: profile.operatorCode || profile.email,
              rejectReason: reason,
            });
          refreshCohortApplications(profile);
        } catch (err) {
          alert(err.message || "Application rejection failed");
          btn.disabled = false;
        }
      });
    });
  }

  async function refreshCohortApplications(profile) {
    var submitted = await loadCohortApplications("submitted");
    renderCohortApplications(submitted, profile);
  }

  async function refreshQueues(profile) {
    var pending = await loadOperatorsByStatus("pending");
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
    provisionCohortSlot: provisionCohortSlot,
    loadActiveOperators: loadActiveOperators,
    loadOperatorsByStatus: loadOperatorsByStatus,
    loadCohortApplications: loadCohortApplications,
  };
})(typeof window !== "undefined" ? window : global);
