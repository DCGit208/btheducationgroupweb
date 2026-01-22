# ASE Certification User Experience Design

## How Users Will Experience Focus Areas & Filtering

---

## SCENARIO: User Selects "P SERIES - Parts Specialist"

### What the User Sees:

#### 1. **Vendor Dropdown Selection**
```
Vendor: [ASE ▼]
```
When user selects **ASE**, they see all ASE certifications.

---

#### 2. **Focus Area Dropdown (Dynamically Populated)**
```
Focus Area: [All Focus Areas ▼]
```

When dropdown opens, user sees:
```
All Focus Areas
─────────────────
Passenger Vehicles & Light Trucks (9)
Commercial Trucks & Heavy-Duty (8)
Body Repair & Paint (5)
School Bus Systems (7)
Transit & Coach Bus (8)
Equipment Installation (3)
✓ Parts Counter & Inventory (4)        ← USER SELECTS THIS
Advanced Diagnostics (4)
Military Vehicles (6)
Service Consulting (1)
Alternative Fuels (1)
General Maintenance (1)
Exhaust Systems (1)
```

---

#### 3. **Filter Results Display**

After selecting "Parts Counter & Inventory", the page shows:

```
╔══════════════════════════════════════════════════════════════════╗
║  🔧 PARTS COUNTER & INVENTORY MANAGEMENT                         ║
║  4 certifications found                                          ║
╚══════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────┐
│ 🏆 P2 - Automobile Parts Specialist                              │
│ ASE • Level 1 • Foundation                                       │
│ ────────────────────────────────────────────────────────────────│
│ Focus: Parts Counter & Inventory Management                      │
│ Sub-Focus: Automotive Parts                                      │
│                                                                  │
│ Master the identification, cataloging, and sales of automobile  │
│ parts. Learn parts interchange, pricing, inventory control,     │
│ and customer service for automotive parts departments.          │
│                                                                  │
│ 📚 Exam: P2 | 💰 Price: $46 | ⏱️ Time: 2 months                 │
│ 📊 Salary Index: +18% | 🎯 Demand: High                         │
│                                                                  │
│ [View Details] [Add to Learning Path]                           │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ 🏆 P1 - Medium/Heavy Duty Truck Parts Specialist                │
│ ASE • Level 2 • Associate                                        │
│ ────────────────────────────────────────────────────────────────│
│ Focus: Parts Counter & Inventory Management                      │
│ Sub-Focus: Commercial Parts                                      │
│                                                                  │
│ Specialize in commercial truck parts including heavy-duty       │
│ components, fleet inventory systems, and commercial parts       │
│ catalogs. Master Class 4-8 truck parts identification.          │
│                                                                  │
│ 📚 Exam: P1 | 💰 Price: $46 | ⏱️ Time: 3 months                 │
│ 📊 Salary Index: +22% | 🎯 Demand: Very High                    │
│                                                                  │
│ [View Details] [Add to Learning Path]                           │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ 🏆 P4 - Collision Repair & Refinishing Parts                    │
│ ASE • Level 2 • Associate                                        │
│ ────────────────────────────────────────────────────────────────│
│ Focus: Parts Counter & Inventory Management                      │
│ Sub-Focus: Body Shop Parts                                       │
│                                                                  │
│ Expertise in body shop parts, paint materials, repair panels,   │
│ adhesives, and refinishing supplies. Manage collision repair    │
│ inventory and vendor relationships.                              │
│                                                                  │
│ 📚 Exam: P4 | 💰 Price: $46 | ⏱️ Time: 3 months                 │
│ 📊 Salary Index: +20% | 🎯 Demand: High                         │
│                                                                  │
│ [View Details] [Add to Learning Path]                           │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ 🏆 P3 - Advanced Engine Performance Parts                       │
│ ASE • Level 4 • Expert                                           │
│ ────────────────────────────────────────────────────────────────│
│ Focus: Parts Counter & Inventory Management                      │
│ Sub-Focus: Performance Parts                                     │
│                                                                  │
│ Advanced knowledge of engine performance parts, aftermarket     │
│ modifications, tuning components, and diagnostic tools.         │
│ Requires L1 prerequisite knowledge.                             │
│                                                                  │
│ 📚 Exam: P3 | 💰 Price: $54 | ⏱️ Time: 4 months                 │
│ 📊 Salary Index: +28% | 🎯 Demand: Moderate-High                │
│ 🔒 Prerequisites: P2 or A8 recommended                          │
│                                                                  │
│ [View Details] [Add to Learning Path]                           │
└──────────────────────────────────────────────────────────────────┘
```

---

## JSON DATA STRUCTURE FOR P SERIES

### Example: P2 - Automobile Parts Specialist

```json
{
  "name": "ASE P2 - Automobile Parts Specialist",
  "vendor": "ASE",
  "level": 1,
  "level_range": [1, 5],
  "category": "parts-specialist",
  "focus": "Parts Counter & Inventory Management",
  "sub_focus": "Automotive Parts",
  "exam": "P2",
  "tags": [
    "parts-specialist",
    "parts-counter",
    "inventory-management",
    "automotive-parts",
    "customer-service",
    "level-1",
    "ase"
  ],
  "vendor_stage": "Foundation",
  "price": 46,
  "retired": false,
  "logo": "../assets/images/vendor-logos/ase.svg",
  "description": "Master the identification, cataloging, and sales of automobile parts. Learn parts interchange, pricing, inventory control, and customer service for automotive parts departments.",
  "skills": [
    "Parts identification and cross-referencing",
    "Catalog navigation and lookup systems",
    "Inventory management and ordering",
    "Customer service and sales techniques",
    "Return and warranty processing",
    "Parts pricing and markup strategies"
  ],
  "prerequisites": [],
  "work_experience_years": 2,
  "recertification_years": 5,
  "salary_index": 0.18,
  "demand": "high",
  "time_estimate_months": 2,
  "popularity": 0.72,
  "test_questions": 50,
  "passing_score": 70,
  "exam_duration_minutes": 60,
  "related_certs": ["P1", "P4", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"],
  "career_paths": [
    "Parts Counter Associate → Senior Parts Specialist → Parts Manager",
    "Dealership Parts Department → Independent Parts Store → Fleet Parts Coordinator"
  ]
}
```

---

## FILTERING SYSTEM ARCHITECTURE

### 1. **Primary Focus Area Field**
```json
"focus": "Parts Counter & Inventory Management"
```
This is the **main category** displayed prominently in the card.

### 2. **Sub-Focus Field**
```json
"sub_focus": "Automotive Parts"
```
This provides **specific specialization** within the focus area.

### 3. **Category Field**
```json
"category": "parts-specialist"
```
This is the **technical category** used for grouping and advanced filtering.

---

## FOCUS AREA DROPDOWN POPULATION LOGIC

### JavaScript Implementation:
```javascript
// Extract unique focus areas from the dataset with counts
const focusAreas = {};
certifications.forEach(cert => {
  if (cert.focus) {
    if (!focusAreas[cert.focus]) {
      focusAreas[cert.focus] = {
        name: cert.focus,
        count: 0,
        icon: getFocusIcon(cert.focus)
      };
    }
    focusAreas[cert.focus].count++;
  }
});

// Populate the dropdown
const focusFilter = document.getElementById('focusFilter');
focusFilter.innerHTML = '<option value="">All Focus Areas</option>';

Object.values(focusAreas)
  .sort((a, b) => b.count - a.count)
  .forEach(area => {
    const option = document.createElement('option');
    option.value = area.name;
    option.textContent = `${area.icon} ${area.name} (${area.count})`;
    focusFilter.appendChild(option);
  });
```

---

## CERTIFICATION CARD DISPLAY

### Key Elements Shown:
1. **Badge**: Series code (P2) and certification name
2. **Vendor**: ASE logo and name
3. **Level**: Visual level indicator (1-5 stars/badges)
4. **Focus Area**: Prominently displayed with icon
5. **Sub-Focus**: Secondary specialization
6. **Description**: 2-3 sentence overview
7. **Skills List**: Bullet points of what you'll learn
8. **Stats Bar**:
   - Exam code
   - Price
   - Study time estimate
   - Salary boost percentage
   - Job demand indicator
9. **Prerequisites**: Warning if user doesn't have required certs
10. **Action Buttons**: View details, add to learning path

---

## ENHANCED SEARCH EXPERIENCE

### Smart Search Features:

#### When user types "parts":
```
Showing 4 results in "Parts Counter & Inventory Management"

• P2 - Automobile Parts Specialist
• P1 - Medium/Heavy Duty Truck Parts Specialist
• P4 - Collision Repair & Refinishing Parts
• P3 - Advanced Engine Performance Parts
```

#### When user types "inventory":
Same 4 P-Series certifications appear (searches in focus area text)

#### When user types "P2":
Direct match to specific certification

---

## MOBILE RESPONSIVE DESIGN

### On Mobile:
- Focus area shows as compact chips
- Sub-focus appears on tap/expand
- Cards stack vertically
- Sticky filter bar at top
- "Focus: Parts Counter & Inventory Management" appears in card header

---

## ACCESSIBILITY FEATURES

1. **Screen Readers**: 
   - "Focus area: Parts Counter & Inventory Management"
   - "Sub-focus: Automotive Parts"
   - "Level 1 Foundation certification"

2. **Keyboard Navigation**:
   - Tab through focus areas
   - Enter to select
   - Arrow keys to navigate results

3. **Visual Indicators**:
   - Icons for each focus area
   - Color coding by level
   - Bold focus area text

---

## SUMMARY: USER EXPERIENCE FLOW

1. **User arrives** at automotive.html
2. **Sees vendor filter** with ASE as option
3. **Selects ASE vendor** (or leaves as "All Vendors")
4. **Opens Focus Area dropdown** → Sees "Parts Counter & Inventory Management (4)"
5. **Selects that focus** → Page filters to show only P1, P2, P3, P4
6. **Each card prominently displays**:
   - "Focus: Parts Counter & Inventory Management"
   - Sub-focus for each (Automotive Parts, Commercial Parts, etc.)
7. **User clicks "View Details"** → Full certification page with:
   - Complete job description
   - Detailed curriculum
   - Career outcomes
   - Salary data
   - Employer demand stats
8. **User adds to learning path** → System creates personalized certification roadmap

---

## WHY THIS DESIGN WORKS

✅ **Clear Information Hierarchy**: Focus → Sub-Focus → Details  
✅ **Scannable**: Users quickly see "Parts Counter & Inventory Management"  
✅ **Filterable**: Dynamic dropdowns adapt to dataset  
✅ **Contextual**: Focus area explains what the certification is for  
✅ **Actionable**: Clear next steps (view details, add to path)  
✅ **Discoverable**: Search, browse, or filter - all work  
✅ **Educational**: Users learn career pathways, not just cert names  

---

## IMPLEMENTATION STATUS

- [x] Markdown structure created
- [ ] JSON data file with all 58 ASE certs
- [ ] Focus area icons/emojis defined
- [ ] Enhanced card templates with focus display
- [ ] Smart filtering logic in automotive.html
- [ ] Career pathway visualization
- [ ] Prerequisite checking logic
- [ ] Learning path builder integration
