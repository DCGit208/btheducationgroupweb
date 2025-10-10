# Per-Level Filtering UX Model (Reusable Spec)

This document defines the value-driven, per-level filtering model you can apply across sectors/program pages to deliver a consistent, revenue-aligned user experience.

## Objectives

- Align user experience to level-based pricing and selection rules.
- Ensure every selected level has enough progressive, eligible certifications to meet min/max counts.
- Prioritize high-value options (salary, demand, track/focus) while respecting chronology and prerequisites.

## Level Rules (Selection Counts)

Selections are cumulative: lower-level picks count toward higher levels.

- Level 1: min=3, max=3
- Level 2: min=4, max=4
- Level 3: min=5, max=6
- Level 4: min=7, max=7
- Level 5: min=8, max=10

Checkout should only enable when the cumulative selection count meets the current level’s minimum.

## Stage Mapping and Exceptions

When a Level is selected, apply these mappings to control what appears:

- Level 1: Foundational/Fundamental only; allow explicit “L1 associate starters” (e.g., Cisco CCNA/CBROPS/DEVASC) by exception.
- Level 2: Foundational + Associate.
- Level 3: Foundational + Associate + Advanced (Professional/Expert/Specialty/Architect).
- Level 4–5: All tiers (Foundational/Associate/Advanced) so users can always meet minimums at any chosen level.

Level 1 Associate allowance:
- Allow up to 2 Associate items overall at L1 (cap=2).
- Order these by value (see Value Ordering) so higher-value associates surface first when needed to meet L1 counts and price.
- Cisco L1 starters remain allowed regardless of stage.

## Data Contract and Inference

Recommended fields per certification object:

- Required: `id`, `name`, `vendor`, `category`, `focus`, `retired`, `premium`
- Level logic: `level_range` [minL,maxL], `vendor_stage`, `tracks[]`, `solution_area`, `tags[]`, `prereqTags[]`
- Value/Why: `salary_index` (0..1), `popularity` (0..1), `time_estimate_months` (number)

Do not embed external `url` or `logo` in merged data (policy). Pages may render logos via a known mapping outside the dataset.

Inference helpers (use when fields are missing):

- Infer `vendor_stage` from `name`:
  - “Cloud Practitioner”/“AI Practitioner”/“Foundation” → Foundational
  - “Associate”/“Administrator”/“Developer” → Associate
  - “Professional” → Professional
  - “Specialty”/“Specialist” → Specialty
  - “Architect”/“Expert” → Expert
- `vendor_area` fallback: if `vendor==='Microsoft'` and `solution_area` exists, treat `solution_area` as `vendor_area`.

## Filter Pipeline (Algorithm)

1) Gather inputs
   - Level (1..5), filters (vendor, vendorArea, category, focus, tracks[], partnership), toggles (strictChronology, eligibleOnly, vendorAnchored, recommendedFirst), search string.

2) Build context
   - Selection state: maintain `selectedByLevel` Sets per level.
   - Locked previous: `getCumulativeSelection(level)` = union of selections from levels ≤ current.
   - Anchor vendor (if vendorAnchored): vendor with most locked previous selections, or explicitly chosen vendor.

3) Eligibility checks (in order)
   - Exclude retired.
   - If `strictChronology` and a level is selected:
     - `inLevelWindow(cert)`: if `level_range` exists, ensure level ∈ [minL, maxL].
     - `prereqsMet(cert)`: each `prereqTags` must be present among tags of previously selected certs (Cisco L1 starters exempt).
     - `stageFitsLevel(level, cert)`: use Stage Mapping (allow Cisco L1 starters).
   - Apply facet filters (vendor, vendorArea, category, focus, tracks, partnership, search).

4) Level 1 Associate allowance
   - Split filtered into Foundational and Associate.
   - Keep all Foundational + Cisco L1 starters.
   - Keep up to 2 Associate items ordered by Value Ordering (below).

5) Eligible-only anchoring (with safety fallback)
   - If `eligibleOnly` and `anchorVendor` are active, filter to anchor vendor.
   - If that leaves fewer candidates than required to meet the current level’s minimum (considering cumulative selections), relax anchoring to the pre-eligible list and show a helper notice (see UX Notice).

6) Preserve locked previous selections
   - Always include the user’s locked prior selections in results to avoid disappearing choices.

7) Optional ranking (Recommended First)
   - Compute a composite score and sort by it (see Optional Ranking). Also surface “Why” reasons for transparency.

## Value Ordering for L1 Associates

When selecting the up-to-two L1 associates, sort by:

1) `salary_index` (desc)
2) `popularity` (desc)
3) Track/Focus fit (desc):
   - Points for overlap with selected tracks; default preferred tracks if none chosen: `['Security','Data','Cloud','DevOps']`
   - Small bonus if `focus` matches selected focus
4) `name` (asc)

## UX Notice When Relaxing Anchoring

If anchoring would prevent meeting level minimums:

- Temporarily relax anchoring and show a short banner:
  > “Showing more vendors to help you meet Level X minimum selections. You can re-apply vendor anchoring after meeting requirements.”
- Auto-dismiss after a few seconds or provide a close “×”.

## Progression and Selection State

- Maintain `selectedByLevel` (1..5) as Sets of certification IDs.
- `getCumulativeSelection(level)`: union of `selectedByLevel[1..level]`.
- Checkout state:
  - Enable only when `cumulativeCount ≥ levelRules[level].min`.
  - Show hint text until the minimum is met: “Select at least {min} to proceed.”

## Optional Ranking (Recommended First)

Combine weighted factors (weights can vary by level):

- Vendor anchor match
- Level fit
- Neutral boost at L1
- Track overlap (selected tracks and prior tracks)
- Prereqs satisfied
- Synergy with prior selections (same vendor/track)
- Vendor area fit
- Time estimate (faster is better)
- Salary (`salary_index`)
- Demand (`popularity`)
- Search hit
- Vendor stage alignment

Reason thresholds (example):

- “Strong salary outlook” if `salary_index ≥ 0.68`
- “Strong market demand” if `popularity ≥ 0.62`

Fine-grained boosts (optional):

- Microsoft Security (Defender) boost: if `solution_area` or `tracks` include “Security”.
- Fortinet Security boost: if name/tracks/category indicate ZTNA/SASE/Secure Email/Secure Web/Security.

## Config Summary (Copy/Paste)

- Level rules: `{1:{min:3,max:3}, 2:{min:4,max:4}, 3:{min:5,max:6}, 4:{min:7,max:7}, 5:{min:8,max:10}}`
- L1 associate cap: `2`
- Preferred track defaults (L1 tie-break): `['Security','Data','Cloud','DevOps']`
- Salary/Demand thresholds: `salary_index ≥ 0.68`, `popularity ≥ 0.62`

## Pseudocode Snippets

Infer stage:

```js
function inferVendorStage(cert) {
  const n = (cert.name || '');
  if (/Found(ation|ational)|Cloud Practitioner|AI Practitioner/i.test(n)) return 'Foundational';
  if (/Associate|Administrator|Developer/i.test(n)) return 'Associate';
  if (/Professional/i.test(n)) return 'Professional';
  if (/Specialty|Specialist/i.test(n)) return 'Specialty';
  if (/Expert|Architect/i.test(n)) return 'Expert';
  return null;
}
```

Stage mapping:

```js
function stageFitsLevel(level, cert) {
  const stage = cert.vendor_stage || inferVendorStage(cert);
  if (!stage) return true;
  if (level === 1) return /Foundational|Fundamental/i.test(stage);
  if (level === 2) return /Foundational|Fundamental|Associate|Administrator|Developer/i.test(stage);
  if (level === 3) return /Foundational|Fundamental|Associate|Administrator|Developer|Professional|Expert|Specialty|Architect/i.test(stage);
  if (level >= 4) return /Foundational|Fundamental|Associate|Administrator|Developer|Professional|Expert|Specialty|Architect/i.test(stage);
  return true;
}
```

Cisco L1 exception:

```js
function isCiscoL1AssociateStarter(level, cert) {
  if (level !== 1) return false;
  if (cert.vendor !== 'Cisco') return false;
  const nm = (cert.name || '').toUpperCase();
  const ex = (cert.exam || '').toUpperCase();
  return /\bCCNA\b/.test(nm) || /CYBEROPS|CBROPS/.test(nm) || /DEVASC/.test(nm) || /(200-301|200-201|200-901)/.test(ex);
}
```

L1 associate capping and ordering:

```js
function orderAssociatesL1(associates, trackSelections=[], focus=null) {
  const prefTracks = new Set(trackSelections.length ? trackSelections : ['Security','Data','Cloud','DevOps']);
  const focusPref = focus ? String(focus) : null;
  const trackScore = (c) => {
    let s = 0;
    (Array.isArray(c.tracks) ? c.tracks : []).forEach(t => { if (prefTracks.has(String(t))) s += 1; });
    if (focusPref && String(c.focus||'') === focusPref) s += 0.5;
    return s;
  };
  return associates.sort((a,b) =>
    (Number(b.salary_index)||0) - (Number(a.salary_index)||0) ||
    (Number(b.popularity)||0) - (Number(a.popularity)||0) ||
    trackScore(b) - trackScore(a) ||
    String(a.name).localeCompare(b.name)
  );
}
```

Anchoring relaxation with notice:

```js
function maybeRelaxAnchoring(filtered, preEligible, level, levelRules, selectedIds, anchorVendor, eligibleOnly) {
  if (!eligibleOnly || !anchorVendor) return filtered;
  let scoped = filtered.filter(c => c.vendor === anchorVendor);
  const { min } = levelRules[level] || { min: 0 };
  const cumulativeCount = selectedIds.size;
  const remainingNeeded = Math.max(0, min - cumulativeCount);
  const candidates = scoped.filter(c => !selectedIds.has(c.id)).length;
  if (remainingNeeded > 0 && candidates < remainingNeeded) {
    showTemporaryBanner(`Showing more vendors to help you meet Level ${level} minimum selections. You can re-apply vendor anchoring after meeting requirements.`);
    return preEligible;
  }
  return scoped;
}

function showTemporaryBanner(msg) {
  const id = 'filterRelaxedNotice';
  let banner = document.getElementById(id);
  if (!banner) {
    banner = document.createElement('div');
    banner.id = id;
    banner.style.cssText = 'margin:10px 0;padding:10px;border:1px solid #fde68a;background:#fffbeb;color:#92400e;border-radius:8px;';
    const container = document.querySelector('.filter-section .container') || document.body;
    container.insertBefore(banner, container.firstChild);
  }
  banner.textContent = msg;
  setTimeout(()=> banner?.remove(), 6000);
}
```

## Integration Checklist (for other pages)

- [ ] Copy or import the following helpers: `inferVendorStage`, `stageFitsLevel`, `isCiscoL1AssociateStarter`, `orderAssociatesL1`, `maybeRelaxAnchoring`, `showTemporaryBanner`.
- [ ] Define `levelRules` as shown above and wire your checkout button to `levelRules[level].min`.
- [ ] Maintain `selectedByLevel` (Sets, 1..5) and implement `getCumulativeSelection(level)`.
- [ ] Apply the Filter Pipeline, including L1 associate allowance and anchoring fallback.
- [ ] If using Recommended First, implement the composite score and Why reasons (optional weights per level).
- [ ] Test: ensure each level shows enough progressive options to meet minimums and that prior selections remain visible.

## QA Scenarios

- L1 shows Foundational items first; at most two Associates (value-ordered) appear; Cisco L1 starters visible.
- With vendor anchoring on, if options are insufficient to meet min, anchoring is relaxed with a visible banner.
- Changing tracks/focus reshuffles L1 associate ordering by value/fit.
- Prior selections remain visible as levels increase (cumulative selection).
- Checkout enables only after meeting the current level’s minimum.

---

This spec mirrors the behavior implemented in `programs/informationtechnology.html` and can be applied to other sectors to deliver the same value-aligned experience.
