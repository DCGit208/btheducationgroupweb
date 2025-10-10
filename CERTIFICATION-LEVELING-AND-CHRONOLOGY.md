# Certification Leveling and Chronology Framework

Author: BTH Education Group — October 10, 2025

This framework governs how certifications are presented and selected across Level 1–5 to ensure a chronological, gap-free progression from foundation to mastery. It applies to Information Technology and can be reused across other sectors with vendor/credential-specific mappings.

## Core Intent

Deliver a chronological, vendor-aware experience: start with broad foundations, add associate depth only when appropriate, and advance through professional/expert tiers without creating knowledge gaps.

## Levels and Allowed Stages

- Level 1
  - Show Foundational items only, plus a very small curated list of vendor-specific "starter associates" that are safe to begin with.
  - Security never precedes networking at Level 1.
  - Cap L1 associates at 0–2; vendor-anchored.
- Level 2
  - Add Associate certifications that deepen a chosen path (security, dev, cloud, etc.).
  - Still exclude Professional and Specialty.
- Level 3
  - Introduce Professional tier; continue allowing Foundational/Associate.
- Level 4–5
  - Introduce Expert and Specialty tiers; maintain eligibility of earlier tiers as needed to complete progression.

## Global Rules

- Stage-to-level mapping (canonical):
  - L1: Foundational only + vendor-specific L1 Associate whitelist
  - L2: Foundational + Associate
  - L3: + Professional
  - L4–L5: + Expert/Specialty
- Chronology prerequisites:
  - Security tracks require a prior networking foundation (e.g., Network+, CCNA, or equivalent).
  - Cloud associate/architect requires cloud fundamentals first (e.g., CLF-C01, AZ-900, GCP Digital Leader).
- Vendor anchoring: When a vendor is selected, prioritize that ecosystem and restrict L1 associates to the curated whitelist for that vendor.
- L1 Associates visibility:
  - Show curated L1 associates for the selected vendor (0–2), ranked by safe chronology and value.
  - If no vendor is selected, do not inject associates at L1; show only Foundational across vendors.
- Ranking and pinning:
  - Pin curated L1 vendor sets to the top (e.g., CompTIA, Cisco, AWS), then apply relevance sorting.

## Vendor Applications (IT)

These mappings are authoritative for Level 1/L2 gating and ranking. They do not change exam scope; they define how we surface and gate choices.

### CompTIA
- L1 (Foundational): Tech+/ITF+, A+, Network+
- L1 (Associates): none
- L2 (Associates): Security+ (after Network+), Linux+, Server+, Cloud+
- Rationale: Security and Linux belong after baseline support/networking; prevent gaps.

### Cisco
- L1 (Foundational): CCST Cybersecurity, CCST IT Support, CCST Networking, CCT Field Technician, Cisco Certificate in Ethical Hacking (entry-level)
- L1 (Starter Associates): CCNA (200-301), DEVASC (200-901) — CBROPS is security-focused and should follow a networking baseline, so treat as L2 in default chronology (may be visible but de-prioritized/locked until baseline is present)
- L2 (Associates): CCNA (if not selected at L1), CyberOps Associate (200-201 CBROPS), DEVASC (if not selected at L1), other Associate variants aligned to the chosen track.

### AWS
- Tiers: Foundational → Associate → Professional → Specialty
- L1: Cloud Practitioner (CLF-C01) + Starter Associates { SAA-C03, DVA-C02, SOA-C02 }
- L2: Remaining Associate(s) that complement L1 anchor path; no Professional/Specialty yet
- L3+: Add Professional; L4–L5 add Specialty and Expert depth
- Exclusions at L1: Any Professional/Specialty (e.g., Alexa Skill Builder — Specialty)

## Data Normalization (Enrichment)

- Normalize vendor stages and areas:
  - CompTIA: Tech+/ITF+, A+, Network+ → Foundational; Security+/Linux+ → Associate
  - AWS: CLF → Foundational; SAA/DVA/SOA → Associate; SAP/DOP → Professional; Specialty as marked
  - Cisco: CCST/CCT → Foundational; CCNA/DEVASC (Associate); CyberOps Associate (Associate/Security)
  - Others: infer from vendor taxonomies and exam codes (already implemented in enrichment function)
- Tracks and tags:
  - Add tags: 'foundation-it', 'foundation-network', 'vendor-cloud-fund' as appropriate
  - Tracks include 'security', 'network', 'cloud', 'devops', etc. to help chronology and ranking

## L1 Associate Starter Whitelists (IT)

Only these associates are allowed at L1, vendor-anchored (0–2 max) and still subject to security-before-networking logic.

- CompTIA: []
- Cisco: [ CCNA (200-301), DEVASC (200-901) ]
- AWS: [ SAA-C03, DVA-C02, SOA-C02 ]
- Microsoft: [] (unless otherwise defined later)
- All other vendors: []

Notes:
- Security-centric associates (e.g., Cisco CBROPS, 'Security+' etc.) are excluded from L1 allowance; they belong in L2 after networking foundations.
- If business requirements add more vendors/starters, expand this whitelist.

## Pre-req Enforcement

- Security associates require 'foundation-network' tag selected at prior levels (or explicitly within L1 after a networking pick in the same session if intra-level dependency tracking is enabled).
- Cloud associate/architect requires 'vendor-cloud-fund' (CLF/AZ-900/GCDL) selected previously.

## Ranking/Pins at L1

- CompTIA: Pin [ Tech+ → A+ → Network+ ] in that order
- Cisco: Pin [ CCST/CCT set ] then CCNA, then DEVASC
- AWS: Pin [ CLF ] then [ SAA, DVA, SOA ]

## Applying to Other Sectors

- Define analogous stage tiers (Foundational, Associate/Practitioner, Professional, Expert/Specialty) for each accreditation body.
- Create L1 starter associate whitelists per vendor/accreditor where safe.
- Encode pre-req tags (e.g., 'foundation-ops', 'foundation-clinical', etc.) and enforce chronology similarly.

## Implementation Contract (for the Filtering Engine)

Inputs:
- Selected Level (1–5), Vendor (optional), Category/Focus/Tracks (optional), Toggles (strict chronology, vendor anchor, eligible only, recommended first)
- Dataset with vendor_stage, vendor_area, tracks, tags, level_range, popularity/salary indices, and exam codes

Outputs:
- A list of certifications that:
  - Obey stage-per-level gating
  - Apply L1 whitelist logic for associates (0–2 vendor-anchored)
  - Enforce pre-req chronology
  - Rank with curated pins first, then recommendations

Error modes and guardrails:
- If not enough candidates to meet min picks at a level, relax anchoring but never violate stage gating
- Never surface Professional/Specialty at L1
- Never surface security associates at L1

Success criteria:
- Users always see a sensible foundation-first set at L1
- L2+ unlocks deepening choices without gaps
- Vendor selections feel coherent, pinned sets appear first, and ranking remains useful after pins

---

## CompTIA Level Mapping (Authoritative Bundles)

This section documents the exact CompTIA bundles by Level and Focus that we will validate against the filtering UI. Level N shows the full scope of Levels 1..N; chronology is guidance (no eligibility-based hiding).

### Level 1 — Core Foundations bundle
- Tech+ (ITF+)
- A+
- Network+
- Rules:
  - No security-before-networking at L1 (Security+ not part of L1 bundle).
  - Optional curated beginner associates at L1 (if enabled): Linux+, Cloud+ (max 2; vendor-anchored).

### Level 2 — Associate bundle
- Tech+ (ITF+)
- A+
- Network+
- Security+

### Level 3 — Specialist bundles (two focus options)
- Focus: Cybersecurity (L3 Cyber)
  - Tech+ (ITF+), A+, Network+, Security+, PenTest+
- Focus: Infrastructure (L3 Infra)
  - Tech+ (ITF+), A+, Network+, Security+, Linux+

### Level 4 — Senior Practitioner bundles (two focus options)
- Focus: Infrastructure (L4 Infra)
  - Tech+ (ITF+), A+, Network+, Security+, Linux+, Server+
- Focus: Cybersecurity (L4 Cyber)
  - Tech+ (ITF+), A+, Network+, Security+, PenTest+, CySA+

### Level 5 — Capstone/Leadership bundles (two focus options)
- Focus: Infrastructure (L5 Infra)
  - Tech+ (ITF+), A+, Network+, Security+, Linux+, Server+, Cloud+
  - Plus pick 1 vendor cloud associate:
    - AWS Certified Solutions Architect – Associate
    - Microsoft Certified: Azure Administrator Associate
    - Google Associate Cloud Engineer
  - Plus pick 1 vendor-neutral cloud specialty:
    - CCSP (ISC²)
    - CCSK (CSA)
- Focus: Cybersecurity (L5 Cyber)
  - Tech+ (ITF+), A+, Network+, Security+, PenTest+, CySA+, CASP+ (SecurityX)
  - Directional guidance:
    - Management track: CISM (ISACA)
    - Advanced technical track: CISSP (ISC²) or CEH (EC‑Council)

### CompTIA Focus/Domain labels (for mapping)
- AI
- Cloud
- Cyber
- Data
- Digital Skills
- Network
- Tech Support

Notes:
- Digital Skills → Tech+; Tech Support → A+; Network → Network+; Cyber → Security+/PenTest+/CySA+/CASP+; Cloud → Cloud+ (+ vendor cloud); Data → Data+/DataSys+ (if in catalog).
- These bundles are vendor-strict (CompTIA); at L5 Infra, we explicitly allow one vendor-specific cloud associate from AWS/Azure/GCP and one vendor-neutral cloud specialty (CCSP/CCSK) as part of the capstone mix.
