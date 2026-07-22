# Cohort leader and member dashboard design

## Purpose

The GWIX Operator Network already supports Steward, SWI, SWD-INV, and WDS dashboards. The missing operating participants are:

- Cohort leaders / team leaders
- Cohort members

These roles must become authenticated participants in the same Firebase/GWIX system, not a separate portal. They should use the existing Firebase Auth + Firestore `users/{uid}.role` routing model and inherit the same dashboard shell, reporting pattern, activity log, documents, and revenue-engine vocabulary used by current operator roles.

## Validated source context

Validated against:

- `operator/*/dashboard.html`
- `assets/js/gois/*`
- `firestore.rules`
- Firebase project `bth-gwix-operator-network`
- Firestore default database: Native mode, Standard edition, location `nam5`
- Workforce Infrastructure Demonstration Cohort Operations Manual
- Public program pages:
  - `/gwix`
  - `/workforce-deployment`
  - `/workforce-infrastructure`

## Cohort operating model

Per the operations manual:

- One demonstration cohort has 50 participants.
- One cohort has five operational teams.
- Each operational team has one team leader.
- Team member count must be configurable because the manual uses two phrasings:
  - 50 total participants can mean five leaders plus 45 members, or one leader plus nine members per team.
  - "10 members per team" / "recruit ten committed participants" can also be operated as one leader plus 10 recruited member seats.
- The leadership council is composed of five cohort/team leaders.
- Every team participates in four revenue engines:
  - Workforce Development
  - Workforce Deployment
  - Workforce Acquisition
  - Workforce Governance

The dashboard must make these relationships operational:

```text
BTH / Steward / WDS oversight
  -> Cohort
    -> 5 operational teams
      -> 1 cohort leader per team
      -> configurable member target, default 10 member seats unless BTH locks the 50-total interpretation
```

## Relationship to main infrastructure

The mainstream infrastructure remains:

```text
Steward
  -> SWI Partner
    -> SWD-INV
      -> WDS
        -> 2 production cohorts per WDS
```

Model/demonstration cohorts must not distort the live mainstream topology. They should be provisioned as separate cohort records under an assigned WDS with explicit mode fields:

```js
{
  infrastructureMode: "model", // model | production
  lifecycleState: "draft", // draft | recruiting | active | graduated | promoted | archived
  countsTowardMainstream: false,
  wdsCode: "WDS-EDTECH-IV-01"
}
```

Rules:

- `model` cohorts are used for demonstrations, pilots, learning, and operational proof.
- `production` cohorts count toward mainstream WDS capacity and network rollups.
- A model cohort can later be promoted only by Steward/BTH governance after validation.
- Dashboards may show model progress, but GWIX public/mainstream telemetry should not count model cohorts unless promoted.

## Account provisioning authority

Recommended authority split:

- Steward/BTH Administration creates or approves actual Firebase Auth accounts.
- WDS can prepare cohort/team/member records inside its assigned scope.
- Cohort leaders can nominate or invite members, but should not directly create authenticated accounts in the first production-grade workflow.
- Cohort leaders can maintain operational reports for their own team after accounts exist.
- Cohort members can update limited personal progress inputs only where explicitly allowed.

This protects account integrity, payment integrity, and role assignment. A later workflow can allow leaders to submit pending member applications into a review queue:

```text
leader creates pending_member_application
  -> WDS reviews scope
    -> Steward/BTH approves
      -> Cloud Function creates Firebase Auth + users/{uid}
```

## Provisioning the "5 leaders develop 10 cohorts" obligation

The "one team develops ten additional cohorts" obligation should not create all 10 child cohorts immediately as full production cohorts. It should be represented as an assignment portfolio.

Suggested structure:

```js
team_targets/{teamId} {
  cohortId,
  teamId,
  leaderCode,
  assignedCohortsTarget: 10,
  assignedCohortsCompleted: 0,
  developmentValueTargetFcfa: 4380000000,
  deploymentAnnualTargetFcfa: 4380000000,
  acquisitionValueTargetFcfa: 4380000000,
  governanceAnnualTargetFcfa: 438000000
}
```

Then, as the leader/team actually develops pipeline cohorts:

```js
cohort_assignments/{assignmentId} {
  parentCohortId,
  sourceTeamId,
  leaderCode,
  assignedCohortCode,
  status: "planned", // planned | recruiting | active | validated | acquired
  mode: "model",
  valueFcfa: 438000000
}
```

Rollup:

- One parent demonstration cohort has five teams.
- Each team has a target of 10 assigned cohorts.
- Full parent cohort development target can therefore be 50 assigned cohorts, but each team dashboard should track its own 10-cohort obligation first.

## Registration and signups

Recommended registration channels:

1. Public interest capture from `/workforce-engage.html?intent=cohort`.
2. Steward/WDS internal cohort creation from the dashboard.
3. Bulk upload/import for approved model cohort participants.
4. Leader-submitted member nominations, routed to approval.

Suggested application collections:

```js
cohort_applications/{applicationId} {
  mode: "model",
  cohortId,
  teamId,
  applicantType: "leader", // leader | member
  name,
  email,
  phone,
  requestedWorkforceLevel,
  status: "submitted", // submitted | under_review | approved | rejected | provisioned
  submittedAt
}
```

Applications should not grant access. Access starts only after approval and provisioning.

## Fees, yearly billing, and payments

For three-year programs, fees should be modeled as annual obligations with optional installment records.

Suggested collections:

```js
cohort_fee_plans/{planId} {
  programYears: 3,
  currency: "FCFA",
  annualFees: {
    year1: 0,
    year2: 0,
    year3: 0
  },
  appliesTo: "member", // leader | member | sponsor | cohort
  notes
}
```

```js
cohort_invoices/{invoiceId} {
  cohortId,
  teamId,
  memberId,
  operatorCode,
  programYear: 1,
  dueDate,
  amountFcfa,
  status: "due", // due | partially_paid | paid | overdue | waived
  paymentProvider: "manual" // manual | stripe | bank | mobile_money
}
```

```js
cohort_payments/{paymentId} {
  invoiceId,
  cohortId,
  teamId,
  memberId,
  operatorCode,
  payerRole,
  engine: "development",
  amountFcfa,
  status: "pending", // pending | paid | failed | refunded
  paidAt,
  createdAt
}
```

Important distinction:

- Fees paid by members/sponsors are not the same as revenue participation earned by leaders/members.
- The dashboard should show both separately:
  - Program fee status: what the participant owes/has paid.
  - Participation economics: modeled/earned value from Development, Deployment, Acquisition, Governance.

## LMS inside the dashboard

The dashboard should not rebuild a full LMS from scratch immediately. It should start as an LMS integration and progress tracker.

Recommended LMS model:

```js
cohort_learning_paths/{pathId} {
  cohortId,
  teamId,
  workforceLevel,
  modules: [
    {
      id,
      title,
      provider,
      url,
      certificationCode,
      required: true
    }
  ]
}
```

```js
member_learning_progress/{progressId} {
  memberId,
  moduleId,
  status: "not_started", // not_started | in_progress | complete | certified
  score,
  evidenceUrl,
  completedAt
}
```

Dashboard LMS sections:

- My learning path
- Required certification modules
- Lab/practical assignments
- Evidence uploads/links
- Certification readiness
- Leader view of team learning progress

This allows BTH to connect to existing learning systems, certification partners, PDFs, or external course portals without delaying the operator-network infrastructure.

## Base econometric values

The dashboard should not show abstract progress. Progress should be anchored to base values from the approved cohort model.

| Metric                                       |         Base value |
| -------------------------------------------- | -----------------: |
| Demonstration cohort value                   |   438,000,000 FCFA |
| Team development assignment                  |         10 cohorts |
| Team development value generated             | 4,380,000,000 FCFA |
| Annual deployment contract target per team   | 4,380,000,000 FCFA |
| Deployment revenue participation target      |   438,000,000 FCFA |
| Team leader annual development participation |    46,000,000 FCFA |
| Member annual development revenue pool       |   100,000,000 FCFA |
| Acquisition value per cohort                 |   438,000,000 FCFA |
| Annual governance revenue per cohort         |    43,800,000 FCFA |

Member pool allocation by workforce level:

| Workforce level | Share | Annual allocation |
| --------------- | ----: | ----------------: |
| Level 5         |   25% |   25,000,000 FCFA |
| Level 4         |   22% |   22,000,000 FCFA |
| Level 3         |   20% |   20,000,000 FCFA |
| Level 2         |   18% |   18,000,000 FCFA |
| Level 1         |   15% |   15,000,000 FCFA |

## Roles

### `cohort_leader`

The leader dashboard should show:

- Team formation status: target 10 participants.
- Member list and member-level progress.
- Attendance, certification, project, and practical assignment indicators.
- Deployment readiness checklist.
- Four revenue-engine target progress:
  - Development: progress toward developing 10 assigned cohorts / 4.38B FCFA value.
  - Deployment: progress toward 4.38B FCFA annual contract execution target.
  - Acquisition: progress toward 10 cohort acquisition value / 4.38B FCFA.
  - Governance: progress toward 438M FCFA annual governance capacity.
- Payment/participation dashboard:
  - 46M FCFA leader annual development participation baseline.
  - Deployment participation target and actuals.
  - Monthly target burn-up / gap-to-target.
- Operational reports:
  - Attendance
  - Certification progress
  - Project status
  - Deployment readiness
  - Operational challenges

### `cohort_member`

The member dashboard should show:

- Assigned cohort, team, leader, workforce level.
- Personal certification/progression status.
- Attendance and assignment status.
- Personal deployment readiness checklist.
- Four revenue-engine participation view:
  - Development participation based on workforce level.
  - Deployment participation as team execution begins.
  - Acquisition/governance eligibility as the team reaches later stages.
- Payment/participation dashboard:
  - Level-based annual allocation baseline.
  - Monthly target equivalent.
  - Paid, pending, and gap-to-target values when payment records exist.

## Firestore data model

The first implementation slice should support these collections:

### `cohorts/{cohortId}`

```js
{
  code,
  name,
  status,
  wdsCode,
  sectorId,
  divisionId,
  startDate,
  year,
  targets: {
    cohortValueFcfa,
    developmentValueFcfa,
    deploymentAnnualTargetFcfa,
    acquisitionValueFcfa,
    governanceAnnualTargetFcfa
  },
  actuals: {
    developmentValueFcfa,
    deploymentValueFcfa,
    acquisitionValueFcfa,
    governanceValueFcfa
  }
}
```

### `cohort_teams/{teamId}`

```js
{
  cohortId,
  code,
  name,
  leaderCode,
  leaderUid,
  status,
  memberTarget,
  memberCount,
  workforceLevelMix,
  targets: {
    assignedCohorts,
    developmentValueFcfa,
    deploymentAnnualTargetFcfa,
    deploymentParticipationFcfa,
    leaderDevelopmentParticipationFcfa,
    memberDevelopmentPoolFcfa,
    acquisitionValueFcfa,
    governanceAnnualTargetFcfa
  },
  actuals: {
    assignedCohortsCompleted,
    developmentValueFcfa,
    deploymentValueFcfa,
    deploymentParticipationFcfa,
    acquisitionValueFcfa,
    governanceValueFcfa
  },
  readiness: {
    trainingComplete,
    certificationComplete,
    practicalCompetency,
    teamwork,
    compliance,
    developmentAssignments,
    bthAssessment
  }
}
```

### `cohort_members/{memberId}`

```js
{
  uid,
  cohortId,
  teamId,
  leaderCode,
  memberCode,
  name,
  email,
  workforceLevel,
  status,
  progress: {
    attendancePct,
    certificationPct,
    practicalPct,
    projectPct,
    deploymentReadinessPct
  },
  participation: {
    developmentAnnualTargetFcfa,
    deploymentTargetFcfa,
    acquisitionTargetFcfa,
    governanceTargetFcfa
  }
}
```

### `cohort_payments/{paymentId}`

```text
cohortId
teamId
memberId
leaderCode
operatorCode
role
engine
period
amountFcfa
status
paidAt
createdAt
```

### `cohort_reports/{reportId}`

```text
cohortId
teamId
leaderCode
type
period
summary
metrics
createdAt
createdBy
```

## Security model

Access should follow least privilege:

- Steward/admin can read and manage cohort operational data.
- WDS can read cohort/team/member/payment/report data under its WDS scope.
- Cohort leader can read their cohort, team, team members, team payments, and reports.
- Cohort leader can create reports for their own team.
- Cohort member can read their own member record, their team/cohort summary, and their own payments.
- Members should not be able to read other members' payment records.
- Members should not write financial actuals.

## Implementation slices

### Slice 1: authenticated dashboards and read model

- Add routes for `cohort_leader` and `cohort_member`.
- Add dashboard pages under:
  - `operator/cohort-leader/dashboard.html`
  - `operator/cohort-member/dashboard.html`
- Add matching preview pages.
- Extend login page role links.
- Add role labels/nav/duties.
- Add cohort operations rendering module.
- Add Firestore read helpers for cohort scope, members, and payments.
- Extend security rules for cohort collections.
- Extend Cloud Function provisioning to route new roles.

### Slice 2: steward provisioning enhancements

- Add `cohort_leader` and `cohort_member` to steward operator registration.
- Add cohort/team/member fields in the registration form.
- Add validation for 5 leaders and 10 participants per team.
- Add bulk upload/import option for members.

### Slice 3: operational reporting

- Team leader report submission.
- Attendance, certification, project, deployment readiness reports.
- Steward/WDS review queue.
- Exportable monthly performance dashboard.

### Slice 4: financial actuals and payment reconciliation

- Payment record entry/import.
- Paid/pending/gap calculations.
- Monthly target comparisons.
- Engine-by-engine actuals.
- Audit trail for financial updates.

## First coding target

The first coding target is Slice 1. It makes the two roles real in the app without yet implementing the full write/admin workflow.
