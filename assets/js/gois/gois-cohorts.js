/**
 * Cohort leader/member dashboards — operational targets, payments, and revenue-engine progress.
 */
(function (global) {
  "use strict";

  var BASE = {
    cohortValueFcfa: 438000000,
    teamAssignedCohorts: 10,
    teamDevelopmentValueFcfa: 4380000000,
    deploymentAnnualTargetFcfa: 4380000000,
    deploymentParticipationFcfa: 438000000,
    leaderDevelopmentParticipationFcfa: 46000000,
    memberDevelopmentPoolFcfa: 100000000,
    acquisitionValueFcfa: 4380000000,
    governanceAnnualTargetFcfa: 438000000,
    governancePerCohortFcfa: 43800000,
    memberTarget: 10,
  };

  var LEVEL_ALLOCATIONS = {
    5: { share: 25, annualFcfa: 25000000 },
    4: { share: 22, annualFcfa: 22000000 },
    3: { share: 20, annualFcfa: 20000000 },
    2: { share: 18, annualFcfa: 18000000 },
    1: { share: 15, annualFcfa: 15000000 },
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fmtFcfa(n) {
    n = Number(n || 0);
    if (n >= 1000000000)
      return (n / 1000000000).toFixed(n % 1000000000 ? 2 : 0) + "B FCFA";
    if (n >= 1000000)
      return (n / 1000000).toFixed(n % 1000000 ? 1 : 0) + "M FCFA";
    return n.toLocaleString() + " FCFA";
  }

  function pct(actual, target) {
    target = Number(target || 0);
    if (!target) return 0;
    return Math.max(
      0,
      Math.min(999, Math.round((Number(actual || 0) / target) * 100)),
    );
  }

  function progress(label, actual, target, note) {
    var value = pct(actual, target);
    var capped = Math.min(value, 100);
    return (
      '<div class="gois-progress-row">' +
      '<div class="gois-progress-head"><strong>' +
      esc(label) +
      "</strong><span>" +
      value +
      "%</span></div>" +
      '<div class="gois-progress"><span style="width:' +
      capped +
      '%"></span></div>' +
      '<div class="gois-progress-sub">' +
      fmtFcfa(actual) +
      " / " +
      fmtFcfa(target) +
      (note ? " · " + esc(note) : "") +
      "</div>" +
      "</div>"
    );
  }

  function kpi(label, value, sub) {
    return (
      '<div class="gois-kpi"><div class="gois-kpi-label">' +
      esc(label) +
      "</div>" +
      '<div class="gois-kpi-value">' +
      value +
      "</div>" +
      (sub ? '<div class="gois-kpi-sub">' + esc(sub) + "</div>" : "") +
      "</div>"
    );
  }

  function targets(scope) {
    var team = (scope && scope.team) || {};
    return Object.assign({}, BASE, team.targets || {});
  }

  function actuals(scope) {
    var team = (scope && scope.team) || {};
    return Object.assign(
      {
        assignedCohortsCompleted: 0,
        developmentValueFcfa: 0,
        deploymentValueFcfa: 0,
        deploymentParticipationFcfa: 0,
        acquisitionValueFcfa: 0,
        governanceValueFcfa: 0,
      },
      team.actuals || {},
    );
  }

  function memberLevel(profile, scope) {
    var member = (scope && scope.member) || {};
    var level = member.workforceLevel || profile.workforceLevel || 1;
    level = parseInt(level, 10);
    return LEVEL_ALLOCATIONS[level] ? level : 1;
  }

  function paymentTotals(scope) {
    var totals = {
      paid: 0,
      pending: 0,
      development: 0,
      deployment: 0,
      acquisition: 0,
      governance: 0,
    };
    ((scope && scope.payments) || []).forEach(function (p) {
      var amount = Number(p.amountFcfa || 0);
      var status = String(p.status || "").toLowerCase();
      var engine = String(p.engine || "").toLowerCase();
      if (status === "paid") totals.paid += amount;
      else totals.pending += amount;
      if (engine.indexOf("develop") !== -1) totals.development += amount;
      if (engine.indexOf("deploy") !== -1) totals.deployment += amount;
      if (engine.indexOf("acqui") !== -1) totals.acquisition += amount;
      if (engine.indexOf("govern") !== -1) totals.governance += amount;
    });
    return totals;
  }

  function renderOverviewKpis(mountEl, rank, profile, scope) {
    if (!mountEl) return;
    var t = targets(scope);
    var a = actuals(scope);
    var totals = paymentTotals(scope);
    var members = scope && scope.members ? scope.members.length : 0;
    var team = (scope && scope.team) || {};

    if (rank === "cohort_leader") {
      mountEl.innerHTML =
        kpi(
          "Team formation",
          members + " / " + (team.memberTarget || t.memberTarget),
          "Members registered",
        ) +
        kpi(
          "Deployment target",
          pct(a.deploymentValueFcfa, t.deploymentAnnualTargetFcfa) + "%",
          fmtFcfa(t.deploymentAnnualTargetFcfa) + " annual",
        ) +
        kpi(
          "Leader baseline",
          fmtFcfa(t.leaderDevelopmentParticipationFcfa),
          "Annual development participation",
        ) +
        kpi(
          "Paid / pending",
          fmtFcfa(totals.paid),
          fmtFcfa(totals.pending) + " pending",
        );
      return;
    }

    var level = memberLevel(profile || {}, scope);
    var allocation = LEVEL_ALLOCATIONS[level];
    var progressData = (scope && scope.member && scope.member.progress) || {};
    mountEl.innerHTML =
      kpi(
        "Workforce level",
        "L" + level,
        allocation.share + "% member pool share",
      ) +
      kpi(
        "Annual baseline",
        fmtFcfa(allocation.annualFcfa),
        "Development participation",
      ) +
      kpi(
        "Certification",
        (progressData.certificationPct || 0) + "%",
        "Personal progress",
      ) +
      kpi(
        "Paid / pending",
        fmtFcfa(totals.paid),
        fmtFcfa(totals.pending) + " pending",
      );
  }

  function renderEnginePerformance(
    mountEl,
    rank,
    profile,
    operatorData,
    scope,
  ) {
    if (!mountEl) return;
    var t = targets(scope);
    var a = actuals(scope);
    var intro =
      rank === "cohort_leader"
        ? "Team progress is measured against approved annualized cohort/team base values."
        : "Member participation is shown against workforce-level baseline values and team engine progress.";
    var level = memberLevel(profile || {}, scope);
    var allocation = LEVEL_ALLOCATIONS[level];

    mountEl.innerHTML =
      '<div class="gois-card">' +
      '<h3><i class="fa-solid fa-chart-pie"></i> Four revenue engines — cohort scope</h3>' +
      '<p style="font-size:13px;color:#64748b;margin:0 0 16px">' +
      esc(intro) +
      "</p>" +
      '<div class="gois-engine-grid">' +
      '<div class="gois-engine-card"><h4><i class="fa-solid fa-seedling"></i> Development</h4>' +
      '<div class="gois-engine-val">' +
      fmtFcfa(
        rank === "cohort_member"
          ? allocation.annualFcfa
          : t.teamDevelopmentValueFcfa,
      ) +
      "</div>" +
      '<div class="gois-engine-sub">' +
      (rank === "cohort_member"
        ? "Your level-based annual participation baseline."
        : "10 assigned cohorts × 438M FCFA.") +
      "</div></div>" +
      '<div class="gois-engine-card"><h4><i class="fa-solid fa-truck-fast"></i> Deployment</h4>' +
      '<div class="gois-engine-val">' +
      fmtFcfa(t.deploymentAnnualTargetFcfa) +
      "</div>" +
      '<div class="gois-engine-sub">Annual contract execution target for the certified team.</div></div>' +
      '<div class="gois-engine-card"><h4><i class="fa-solid fa-building-columns"></i> Acquisition</h4>' +
      '<div class="gois-engine-val">' +
      fmtFcfa(t.acquisitionValueFcfa) +
      "</div>" +
      '<div class="gois-engine-sub">10 acquired cohorts × canonical cohort value.</div></div>' +
      '<div class="gois-engine-card"><h4><i class="fa-solid fa-scale-balanced"></i> Governance</h4>' +
      '<div class="gois-engine-val">' +
      fmtFcfa(t.governanceAnnualTargetFcfa) +
      "</div>" +
      '<div class="gois-engine-sub">10% annual governance on 10 acquired cohorts.</div></div>' +
      "</div></div>" +
      '<div class="gois-card"><h3><i class="fa-solid fa-gauge-high"></i> Actuals vs targets</h3>' +
      progress(
        "Development value generated",
        a.developmentValueFcfa,
        t.teamDevelopmentValueFcfa,
        "continuous cohort production",
      ) +
      progress(
        "Deployment contract value executed",
        a.deploymentValueFcfa,
        t.deploymentAnnualTargetFcfa,
        "annualized target",
      ) +
      progress(
        "Acquisition value activated",
        a.acquisitionValueFcfa,
        t.acquisitionValueFcfa,
        "institutional acquisition",
      ) +
      progress(
        "Governance value activated",
        a.governanceValueFcfa,
        t.governanceAnnualTargetFcfa,
        "annual recurring capacity",
      ) +
      "</div>";
  }

  function renderLeaderOperations(mountEl, profile, scope) {
    if (!mountEl) return;
    var team = (scope && scope.team) || {};
    var cohort = (scope && scope.cohort) || {};
    var members = (scope && scope.members) || [];
    var rows = members.length
      ? members
          .map(function (m) {
            var p = m.progress || {};
            return (
              "<tr><td><strong>" +
              esc(m.name || m.memberCode || m.id) +
              "</strong><br><code>" +
              esc(m.memberCode || m.id) +
              "</code></td>" +
              "<td>L" +
              esc(m.workforceLevel || "—") +
              "</td>" +
              "<td>" +
              esc(m.status || "active") +
              "</td>" +
              "<td>" +
              esc(p.attendancePct || 0) +
              "%</td>" +
              "<td>" +
              esc(p.certificationPct || 0) +
              "%</td>" +
              "<td>" +
              esc(p.deploymentReadinessPct || 0) +
              "%</td></tr>"
            );
          })
          .join("")
      : '<tr><td colspan="6" style="color:#64748b">No member records loaded yet. Add `cohort_members` documents with this teamId to populate the live roster.</td></tr>';

    mountEl.innerHTML =
      '<div class="gois-card"><h3><i class="fa-solid fa-users-viewfinder"></i> Team operations</h3>' +
      '<p style="font-size:13px;color:#64748b;margin:0 0 12px">Cohort: <strong>' +
      esc(cohort.name || profile.cohortId || "Not assigned") +
      "</strong> · Team: <strong>" +
      esc(team.name || profile.teamId || "Not assigned") +
      "</strong></p>" +
      '<div class="gois-table-wrap"><table class="gois-table">' +
      "<thead><tr><th>Member</th><th>Level</th><th>Status</th><th>Attendance</th><th>Certification</th><th>Readiness</th></tr></thead><tbody>" +
      rows +
      "</tbody></table></div></div>" +
      '<div class="gois-card"><h3><i class="fa-solid fa-list-check"></i> Deployment readiness checklist</h3>' +
      readinessList(team.readiness || {}) +
      "</div>";
  }

  function renderMemberOperations(mountEl, profile, scope) {
    if (!mountEl) return;
    var member = (scope && scope.member) || {};
    var progressData = member.progress || {};
    var leader = member.leaderCode || profile.leaderCode || "—";
    mountEl.innerHTML =
      '<div class="gois-card"><h3><i class="fa-solid fa-user-check"></i> My cohort operations</h3>' +
      '<div class="gois-kpi-grid">' +
      kpi(
        "Cohort",
        member.cohortId || profile.cohortId || "—",
        "Assigned unit",
      ) +
      kpi("Team", member.teamId || profile.teamId || "—", "Operational team") +
      kpi("Leader", leader, "Team leader code") +
      kpi("Status", member.status || "active", "Participant record") +
      "</div>" +
      progress(
        "Attendance",
        progressData.attendancePct || 0,
        100,
        "required reporting",
      ) +
      progress(
        "Certification",
        progressData.certificationPct || 0,
        100,
        "pathway completion",
      ) +
      progress(
        "Practical competency",
        progressData.practicalPct || 0,
        100,
        "lab/project evidence",
      ) +
      progress(
        "Deployment readiness",
        progressData.deploymentReadinessPct || 0,
        100,
        "BTH approval path",
      ) +
      "</div>";
  }

  function readinessList(readiness) {
    var items = [
      ["trainingComplete", "Training complete"],
      ["certificationComplete", "Certification objectives"],
      ["practicalCompetency", "Practical competency"],
      ["teamwork", "Operational teamwork"],
      ["compliance", "Programme compliance"],
      ["developmentAssignments", "Development assignments"],
      ["bthAssessment", "BTH operational assessment"],
    ];
    return (
      '<ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.8;color:#334155">' +
      items
        .map(function (item) {
          var done = !!readiness[item[0]];
          return "<li>" + (done ? "✓ " : "○ ") + esc(item[1]) + "</li>";
        })
        .join("") +
      "</ul>"
    );
  }

  function renderPayments(mountEl, rank, profile, scope) {
    if (!mountEl) return;
    var t = targets(scope);
    var totals = paymentTotals(scope);
    var level = memberLevel(profile || {}, scope);
    var allocation = LEVEL_ALLOCATIONS[level];
    var annualBaseline =
      rank === "cohort_leader"
        ? t.leaderDevelopmentParticipationFcfa
        : allocation.annualFcfa;
    var monthlyBaseline = Math.round(annualBaseline / 12);
    var rows =
      ((scope && scope.payments) || [])
        .slice(0, 12)
        .map(function (p) {
          return (
            "<tr><td>" +
            esc(p.period || "—") +
            "</td><td>" +
            esc(p.engine || "—") +
            "</td><td>" +
            fmtFcfa(p.amountFcfa) +
            "</td><td>" +
            esc(p.status || "pending") +
            "</td></tr>"
          );
        })
        .join("") ||
      '<tr><td colspan="4" style="color:#64748b">No payment records loaded yet.</td></tr>';

    mountEl.innerHTML =
      '<div class="gois-card"><h3><i class="fa-solid fa-money-check-dollar"></i> Payment and participation</h3>' +
      '<div class="gois-kpi-grid">' +
      kpi(
        "Annual baseline",
        fmtFcfa(annualBaseline),
        rank === "cohort_leader"
          ? "Leader development participation"
          : "Level " + level + " member allocation",
      ) +
      kpi(
        "Monthly baseline",
        fmtFcfa(monthlyBaseline),
        "Annual baseline / 12",
      ) +
      kpi("Paid", fmtFcfa(totals.paid), "Recorded paid") +
      kpi("Pending", fmtFcfa(totals.pending), "Recorded pending") +
      "</div>" +
      '<div class="gois-table-wrap"><table class="gois-table"><thead><tr><th>Period</th><th>Engine</th><th>Amount</th><th>Status</th></tr></thead><tbody>' +
      rows +
      "</tbody></table></div></div>";
  }

  function renderDeploymentTargets(mountEl, rank, profile, scope) {
    if (!mountEl) return;
    var t = targets(scope);
    var a = actuals(scope);
    var monthlyDeploymentTarget = Math.round(t.deploymentAnnualTargetFcfa / 12);
    mountEl.innerHTML =
      '<div class="gois-card"><h3><i class="fa-solid fa-bullseye"></i> Annualized deployment target</h3>' +
      '<p style="font-size:13px;color:#64748b;margin:0 0 16px">Required deployment target is tied to the approved annual team contract capacity.</p>' +
      '<div class="gois-kpi-grid">' +
      kpi(
        "Annual target",
        fmtFcfa(t.deploymentAnnualTargetFcfa),
        "Team contract capacity",
      ) +
      kpi("Monthly target", fmtFcfa(monthlyDeploymentTarget), "Annual / 12") +
      kpi(
        "Actual executed",
        fmtFcfa(a.deploymentValueFcfa),
        "Recorded actual",
      ) +
      kpi(
        "Gap",
        fmtFcfa(
          Math.max(0, t.deploymentAnnualTargetFcfa - a.deploymentValueFcfa),
        ),
        "Remaining annual target",
      ) +
      "</div>" +
      progress(
        "Deployment execution",
        a.deploymentValueFcfa,
        t.deploymentAnnualTargetFcfa,
        "annualized ROI/target tracking",
      ) +
      progress(
        "Deployment participation",
        a.deploymentParticipationFcfa,
        t.deploymentParticipationFcfa,
        "10% participation target",
      ) +
      "</div>";
  }

  function renderLearning(mountEl, rank, profile, scope) {
    if (!mountEl) return;
    var member = (scope && scope.member) || {};
    var level = memberLevel(profile || {}, scope);
    var teamLabel =
      (scope && scope.team && (scope.team.name || scope.team.code)) ||
      profile.teamId ||
      "Assigned team";
    var modules = [
      ["Orientation", "Workforce Infrastructure doctrine", "Required"],
      [
        "Certification",
        "Level " + level + " certification pathway",
        "Required",
      ],
      ["Practical", "Lab/project evidence and assignments", "Required"],
      [
        "Deployment",
        "Deployment readiness and professional conduct",
        "Required",
      ],
      [
        "Governance",
        "Reporting, continuity, and quality standards",
        "Required",
      ],
    ];
    var rows = modules
      .map(function (m) {
        return (
          "<tr><td><strong>" +
          esc(m[0]) +
          "</strong></td><td>" +
          esc(m[1]) +
          "</td><td>" +
          esc(m[2]) +
          '</td><td><span class="gois-badge gois-badge--arch">Configured externally</span></td></tr>'
        );
      })
      .join("");

    mountEl.innerHTML =
      '<div class="gois-card"><h3><i class="fa-solid fa-graduation-cap"></i> Learning management</h3>' +
      '<p style="font-size:13px;color:#64748b;margin:0 0 12px">LMS is represented here as a governed learning-path layer. It can link to external course portals, certification partners, practical assignments, and evidence records without rebuilding a full LMS inside GWIX.</p>' +
      '<div class="gois-kpi-grid">' +
      kpi(
        "Scope",
        rank === "cohort_leader" ? teamLabel : "My pathway",
        "Cohort learning path",
      ) +
      kpi("Workforce level", "L" + level, "Pathway level") +
      kpi("Modules", modules.length, "Baseline pathway") +
      "</div>" +
      '<div class="gois-table-wrap"><table class="gois-table">' +
      "<thead><tr><th>Stage</th><th>Learning item</th><th>Requirement</th><th>Status</th></tr></thead><tbody>" +
      rows +
      "</tbody></table></div></div>";
  }

  function sum(items, fieldPath) {
    return (items || []).reduce(function (total, item) {
      var value = item;
      fieldPath.split(".").forEach(function (part) {
        value = value && value[part];
      });
      return total + Number(value || 0);
    }, 0);
  }

  function avg(items, fieldPath) {
    if (!items || !items.length) return 0;
    return Math.round(sum(items, fieldPath) / items.length);
  }

  function renderWdsPortfolio(mountEl, profile, portfolio) {
    if (!mountEl) return;
    portfolio = portfolio || {};
    var cohorts = portfolio.cohorts || [];
    var teams = portfolio.teams || [];
    var members = portfolio.members || [];
    var payments = portfolio.payments || [];
    var applications = portfolio.applications || [];
    var leaderCount = teams.filter(function (team) {
      return !!(team.leaderCode || team.leaderUid);
    }).length;
    var paid = payments
      .filter(function (p) {
        return String(p.status || "").toLowerCase() === "paid";
      })
      .reduce(function (total, p) {
        return total + Number(p.amountFcfa || 0);
      }, 0);
    var pending = payments
      .filter(function (p) {
        return String(p.status || "").toLowerCase() !== "paid";
      })
      .reduce(function (total, p) {
        return total + Number(p.amountFcfa || 0);
      }, 0);

    var targetParticipants =
      sum(cohorts, "targetParticipants") || cohorts.length * 50;
    var targetLeaders = sum(cohorts, "leaderTarget") || cohorts.length * 5;
    var deploymentTarget =
      sum(teams, "targets.deploymentAnnualTargetFcfa") ||
      teams.length * BASE.deploymentAnnualTargetFcfa;
    var deploymentActual = sum(teams, "actuals.deploymentValueFcfa");

    var teamRows = teams.length
      ? teams
          .map(function (team) {
            var teamMembers = members.filter(function (member) {
              return member.teamId === team.id || member.teamId === team.code;
            });
            var target = Number(
              team.memberTarget || team.teamMemberTarget || 10,
            );
            var p = {
              attendance: avg(teamMembers, "progress.attendancePct"),
              certification: avg(teamMembers, "progress.certificationPct"),
              readiness: avg(teamMembers, "progress.deploymentReadinessPct"),
            };
            return (
              "<tr><td><strong>" +
              esc(team.name || team.code || team.id) +
              "</strong><br><code>" +
              esc(team.leaderCode || "Leader pending") +
              "</code></td><td>" +
              teamMembers.length +
              " / " +
              target +
              "</td><td>" +
              p.attendance +
              "%</td><td>" +
              p.certification +
              "%</td><td>" +
              p.readiness +
              "%</td><td>" +
              fmtFcfa((team.actuals && team.actuals.deploymentValueFcfa) || 0) +
              "</td></tr>"
            );
          })
          .join("")
      : '<tr><td colspan="6" style="color:#64748b">No cohort teams registered under this WDS yet. Use WDS/steward provisioning to create five leader teams for each model cohort.</td></tr>';

    var cohortRows = cohorts.length
      ? cohorts
          .map(function (cohort) {
            var cohortTeams = teams.filter(function (team) {
              return (
                team.cohortId === cohort.id || team.cohortId === cohort.code
              );
            });
            var signupUrl =
              "/operator/cohort-signup.html?cohortId=" +
              encodeURIComponent(cohort.id || cohort.code || "") +
              "&wdsCode=" +
              encodeURIComponent(portfolio.wdsCode || cohort.wdsCode || "") +
              "&sectorId=" +
              encodeURIComponent(cohort.sectorId || "") +
              "&divisionId=" +
              encodeURIComponent(cohort.divisionId || "");
            return (
              "<tr><td><strong>" +
              esc(cohort.name || cohort.code || cohort.id) +
              "</strong><br><code>" +
              esc(cohort.infrastructureMode || "model") +
              "</code></td><td>" +
              esc(cohort.lifecycleState || cohort.status || "draft") +
              "</td><td>" +
              cohortTeams.length +
              " / " +
              (cohort.leaderTarget || 5) +
              "</td><td>" +
              esc(cohort.countsTowardMainstream ? "Production" : "Model") +
              '</td><td><a class="gois-btn" href="' +
              esc(signupUrl) +
              '" target="_blank" rel="noopener"><i class="fa-solid fa-user-plus"></i> Signup link</a>' +
              "</td></tr>"
            );
          })
          .join("")
      : '<tr><td colspan="5" style="color:#64748b">No model or production cohorts assigned to this WDS yet.</td></tr>';

    var applicationRows = applications.length
      ? applications
          .slice(0, 25)
          .map(function (app) {
            return (
              "<tr><td><strong>" +
              esc(app.name || "Applicant") +
              "</strong><br>" +
              esc(app.email || "") +
              "</td><td>" +
              esc(app.applicantType || "member") +
              "</td><td>" +
              esc(app.cohortId || "—") +
              "</td><td>" +
              esc(app.requestedWorkforceLevel || "—") +
              "</td><td>" +
              esc(app.status || "submitted") +
              "</td></tr>"
            );
          })
          .join("")
      : '<tr><td colspan="5" style="color:#64748b">No applications submitted through this WDS cohort signup link yet.</td></tr>';

    mountEl.innerHTML =
      '<div class="gois-card"><h3><i class="fa-solid fa-people-group"></i> WDS cohort portfolio — 5:10 strategy</h3>' +
      '<p style="font-size:13px;color:#64748b;margin:0 0 12px">WDS recruits the cohort by appointing five leaders first, then working with those leaders to complete the full 50-person model or production cohort.</p>' +
      '<div class="gois-kpi-grid">' +
      kpi("Cohorts", cohorts.length, "Model/production under this WDS") +
      kpi(
        "Leaders",
        leaderCount + " / " + targetLeaders,
        "Five leader slots per cohort",
      ) +
      kpi(
        "Members",
        members.length + " / " + targetParticipants,
        "Full cohort target",
      ) +
      kpi(
        "Applications",
        applications.length,
        "Submitted, pending BTH review",
      ) +
      kpi(
        "Deployment",
        pct(deploymentActual, deploymentTarget) + "%",
        fmtFcfa(deploymentTarget) + " target",
      ) +
      kpi("Paid", fmtFcfa(paid), fmtFcfa(pending) + " pending") +
      "</div></div>" +
      '<div class="gois-card"><h3><i class="fa-solid fa-layer-group"></i> Assigned cohorts</h3><div class="gois-table-wrap"><table class="gois-table">' +
      "<thead><tr><th>Cohort</th><th>Lifecycle</th><th>Leader teams</th><th>Mainstream count</th><th>Signup</th></tr></thead><tbody>" +
      cohortRows +
      "</tbody></table></div></div>" +
      '<div class="gois-card"><h3><i class="fa-solid fa-inbox"></i> Cohort applications</h3>' +
      '<p style="font-size:13px;color:#64748b;margin:0 0 12px">WDS can monitor applications submitted through assigned cohort links. Approval and account provisioning remain with Steward/BTH.</p>' +
      '<div class="gois-table-wrap"><table class="gois-table">' +
      "<thead><tr><th>Applicant</th><th>Type</th><th>Cohort</th><th>Level</th><th>Status</th></tr></thead><tbody>" +
      applicationRows +
      "</tbody></table></div></div>" +
      '<div class="gois-card"><h3><i class="fa-solid fa-users-viewfinder"></i> Leaders, teams, KPIs, and direct econometrics</h3><div class="gois-table-wrap"><table class="gois-table">' +
      "<thead><tr><th>Leader / team</th><th>Members</th><th>Attendance</th><th>Certification</th><th>Readiness</th><th>Deployment actual</th></tr></thead><tbody>" +
      teamRows +
      "</tbody></table></div></div>" +
      '<div class="gois-card"><h3><i class="fa-solid fa-chart-pie"></i> WDS revenue-engine rollup</h3>' +
      progress(
        "Development value",
        sum(teams, "actuals.developmentValueFcfa"),
        sum(teams, "targets.developmentValueFcfa") ||
          teams.length * BASE.teamDevelopmentValueFcfa,
        "leader/team production",
      ) +
      progress(
        "Deployment value",
        deploymentActual,
        deploymentTarget,
        "annualized WDS direct target",
      ) +
      progress(
        "Acquisition value",
        sum(teams, "actuals.acquisitionValueFcfa"),
        sum(teams, "targets.acquisitionValueFcfa") ||
          teams.length * BASE.acquisitionValueFcfa,
        "model-to-institution pathway",
      ) +
      progress(
        "Governance value",
        sum(teams, "actuals.governanceValueFcfa"),
        sum(teams, "targets.governanceAnnualTargetFcfa") ||
          teams.length * BASE.governanceAnnualTargetFcfa,
        "annual governance capacity",
      ) +
      "</div>";
  }

  global.GOISCohorts = {
    BASE: BASE,
    LEVEL_ALLOCATIONS: LEVEL_ALLOCATIONS,
    fmtFcfa: fmtFcfa,
    renderOverviewKpis: renderOverviewKpis,
    renderEnginePerformance: renderEnginePerformance,
    renderLeaderOperations: renderLeaderOperations,
    renderMemberOperations: renderMemberOperations,
    renderPayments: renderPayments,
    renderDeploymentTargets: renderDeploymentTargets,
    renderLearning: renderLearning,
    renderWdsPortfolio: renderWdsPortfolio,
  };
})(typeof window !== "undefined" ? window : global);
