# Manufacturing & Industrial Sector Upgrade Blueprint (Approval Draft)

## 1. Objectives
- Elevate `programs/manufacturing.html` to a world-class, comprehensive workforce development hub.
- Integrate real certification program matrices across domains/solution areas with dual progression frameworks (Standard vs HEXAD).
- Provide clear, navigable structure from exploration (hero + domains) to action (filters, certification detail, application CTA).
- Maintain performance and accessibility while increasing depth.

## 2. Structural Layout (High-Level)
1. Sticky Global Sector Nav (Home, Programs, Domains, Certifications, Apply)
2. Immersive Hero (badge, headline, strategic subtitle, dynamic stats auto-bound to dataset)
3. Framework Selection (Standard vs HEXAD) – card pair with feature lists and activation buttons.
4. Workforce Pipeline Overview (Training → Certification → Work Network) – 3 feature-rich cards.
5. Domain / Solution Area Grid (10–12 domain cards with related top certifications and vendor set chips)
6. Dynamic Filter Bar (Framework toggle, Levels 1–5, Vendor multi-select, Solution Area search, Optional: Domain quick-select)
7. Certification Results Grid (Standard layout; modal detail expansion for certification metadata)
8. HEXAD Elevation Track Section (appears when HEXAD selected: shows leadership/meta competencies)
9. LMS Integration Panel (short form; optional deep link to dedicated LMS page)
10. Call-to-Action Footer (Apply path + cross-linking to other sectors)

## 3. Domains & Solution Areas
| Domain | Core Focus | Sample Solution Areas | Representative Vendors | Notes |
|--------|------------|-----------------------|------------------------|-------|
| Automation & Control | PLC, SCADA, Robotics | PLC Programming, HMI, Motion, Industrial Networks | Siemens, Rockwell, Schneider, ABB | Foundational for smart factory |
| Quality & Process | QA/QC, SPC, Auditing | ISO 9001, Six Sigma, Audits, Metrology | ASQ, ISO, AIAG | Data-driven continuous improvement |
| Lean & Operational Excellence | Efficiency & Waste Reduction | Kaizen, 5S, Value Stream Mapping | Various frameworks | Cross‑role optimization |
| Safety & Compliance | Workplace & Environmental Safety | OSHA, Machine Guarding, ISO 45001, HazMat | OSHA, ISO | Mandatory compliance standards |
| Maintenance & Reliability | Asset Lifecycle | Predictive Maint., CMMS, Reliability Eng. | SMRP, Fluke, SKF | Prevent downtime / OEE impact |
| Welding & Fabrication | Metal Joining Specializations | AWS D1.1, TIG/MIG, CWI, Pipe Welding | AWS, ASME | Skills & standards blend |
| Industry 4.0 / Digital Factory | Connected & Data Layer | IoT Sensors, Edge, Digital Twin, MES | PTC, GE Digital, Microsoft | Smart tech integration |
| Supply Chain & Logistics | Flow & Material Movement | ERP, WMS, Inventory, SCOR | SAP, Oracle, Infor | Links plant → distribution |
| Sustainability & ESG | Responsible Operations | Energy Efficiency, Waste Reduction, ESG Reporting | ISO 14001, GRI | Emerging strategic priority |
| Emerging Tech & Analytics | Data Intelligence | AI/ML in Ops, Predictive Analytics | AWS, Azure, IBM | Optional depth; attaches to others |

## 4. Certification Program Matrix (Sample Draft)
Each row will be a certification record in `certifications.json` with fields: `sector`, `framework`, `level`, `domain`, `solutionArea`, `vendor`, `title`, `shortDescription`, `durationHours`, `format` (exam, project, blended), `price`, `link`, `tags`, `prerequisites`.

| Level | Domain | Standard Track Certification (Example) | HEXAD Augmented Track (Adds Leadership/Strategy) | Vendor | Solution Area Tags |
|-------|--------|-----------------------------------------|-----------------------------------------------|--------|--------------------|
| 1 | Automation & Control | Intro to Industrial PLC Systems | PLC Systems + Team Safety Fundamentals | Siemens | PLC, Safety |
| 1 | Quality & Process | Foundations of Quality Metrics | Quality Metrics + Collaborative Problem Solving | ASQ | Quality, Metrics |
| 2 | Lean & Operational Excellence | Practical 5S & Waste Identification | 5S + Change Adoption Skills | — | Lean, 5S |
| 2 | Maintenance & Reliability | Preventive Maintenance Fundamentals | Preventive + Reliability Culture Enablement | SMRP | Maintenance, Reliability |
| 3 | Welding & Fabrication | AWS Structural Welding Certification | Structural Welding + Mentorship Skills | AWS | Welding, Structural |
| 3 | Industry 4.0 / Digital Factory | Implementing Industrial IoT Gateways | IoT Gateways + Data Ethics & Governance | Schneider | IoT, Edge |
| 4 | Supply Chain & Logistics | ERP Production Module Integration | ERP Integration + Cross-Functional Leadership | SAP | ERP, Integration |
| 4 | Automation & Control | Advanced SCADA Systems Optimization | SCADA Optimization + Operational Strategy | Rockwell | SCADA, Optimization |
| 5 | Lean & Operational Excellence | Lean Six Sigma Black Belt | Lean Six Sigma BB + Strategic Transformation | ASQ | Lean, SixSigma |
| 5 | Sustainability & ESG | Industrial Sustainability & ESG Reporting | Sustainability + Corporate Stewardship Leadership | ISO | ESG, Sustainability |

Notes:
- HEXAD track retains core technical exam but appends leadership / strategy / cross‑domain modules.
- Price / duration placeholders to be filled once vendor exam data is finalized.

## 5. Framework Differentiation Model
- Standard: Technical + role progression; minimal soft-skill components; focus exam readiness & operational impact.
- HEXAD: Standard components plus added dimensions (Leadership, Strategic Alignment, Innovation, Cross-Functional Collaboration, Professional Ethics, Performance Optimization).
- Implementation: `framework` field; HEXAD entries can reuse base certification with additional `tags` and `prerequisites` linking to soft-skill modules.

## 6. Data & Rendering Enhancements
- Add `domain` property to each manufacturing certification for domain filtering.
- Extend filter bar: Domain dropdown (optional), multi-select vendor (chips UI), search across `title + solutionArea + tags`.
- Dynamic stats calculation: `certCount` = count filtered by sector & active framework; `vendors` = unique vendor set; `levels` constant 5.
- Modal detail: show domain, vendor, prerequisites, value proposition (HEXAD only extra block).

## 7. Analytics Instrumentation (Planned)
Event schema pushed to `dataLayer`:
- `event: 'sector_framework_select'` → { sector:'manufacturing', framework:'standard|hexad' }
- `event: 'cert_view'` → { sector:'manufacturing', certId, level, framework }
- `event: 'filter_change'` → { sector, filterType:'level|vendor|domain|search', value }
- `event: 'apply_click'` → { sector, framework, source:'hero|framework-card|footer' }

## 8. Accessibility Targets
- All interactive chips/buttons: visible focus outline; ARIA role="button" when not native buttons.
- Modal: `aria-modal="true"`, focus trap, ESC close, restore focus to trigger.
- Live region: results count updates via `aria-live="polite"` (already modeled in IT page → replicate).
- Color contrast ≥ WCAG AA — ensure red palette meets ratio on dark backgrounds.

## 9. SEO & JSON-LD
Meta tags (unique title & description, Open Graph, Twitter). JSON-LD type: `EducationalOccupationalProgram` with additional `occupationalCategory` array referencing domains; use `programType` arrays: ["Standard", "HEXAD"].

## 10. Implementation Phases
1. Approve blueprint (this document).
2. Extend `certifications.json` with manufacturing entries (10 sample + additional to reach min set per level).
3. Refactor `sector-framework.js` to support domain filter and HEXAD augmentation block.
4. Replace hero in `manufacturing.html` with final modular layout sections + dynamic stats binding.
5. Inject certification grid + modal logic; remove legacy static domain cards (rebuild via data-driven approach).
6. Add analytics, accessibility validation, SEO/JSON-LD.
7. QA + performance review.

## 11. Open Questions (Need Your Input)
1. Domain count: Keep 10 core domains or expand to 12 (add e.g., "Additive Manufacturing", "Packaging Systems")?
2. Do we need separate pricing tiers for HEXAD vs Standard per certification or a flat overlay fee?
3. Should Supply Chain & Logistics remain within manufacturing or become its own sector page later?
4. Include VR/Simulation labels as separate certification category or just tags under Training?
5. LMS deep link target: `manufacturing-lms.html` (needs creation) or external system?

## 12. Approval Checklist
- Domains set & confirmed
- Certification matrix structure accepted
- Framework differentiation wording approved
- Analytics event keys accepted
- JSON-LD approach approved

---
**Next Action After Approval:** Begin data seeding + modify `manufacturing.html` to the world-class, dynamic version described here.

Please review and list any adjustments (add/remove domains, change wording, framework feature tweaks) before we implement.
