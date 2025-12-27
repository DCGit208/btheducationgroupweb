#!/usr/bin/env python3
"""
Rebuild 9 existing sectors using IT flagship model
Generates configs, certifications, and pages for:
- Automotive Technology
- Energy & Renewable Systems  
- Construction & Infrastructure
- Communications & Telecommunications
- Creative Arts & Digital Design
- Finance & Accounting
- Business & Management
- Environmental & Sustainability
- Transportation & Logistics
"""

import json
import os
from pathlib import Path

# Configuration for 9 existing sectors
EXISTING_SECTORS = [
    {
        "name": "Automotive Technology",
        "slug": "automotive",
        "icon": "🚗",
        "subtitle": "Master vehicle systems, EV technology, autonomous driving, and automotive manufacturing",
        "description": "Build expertise in automotive engineering, electric vehicles, ADAS, diagnostics, and connected car systems with certifications from ASE, SAE, Tesla, and leading OEMs.",
        "gradient_start": "#dc2626",
        "gradient_end": "#991b1b",
        "cert_count": 35,
        "vendor_count": 8,
        "categories": [
            {"id": "vehicle-diagnostics", "name": "Vehicle Diagnostics", "icon": "🔧"},
            {"id": "ev-systems", "name": "Electric Vehicles", "icon": "⚡"},
            {"id": "adas-autonomous", "name": "ADAS & Autonomous", "icon": "🤖"},
            {"id": "manufacturing", "name": "Manufacturing", "icon": "🏭"},
            {"id": "connected-car", "name": "Connected Car", "icon": "📡"}
        ],
        "vendors": ["ASE", "SAE International", "Tesla", "GM", "Ford", "BMW", "Bosch", "Continental"]
    },
    {
        "name": "Energy & Renewable Systems",
        "slug": "renewable-energy",
        "icon": "🌞",
        "subtitle": "Lead the clean energy transition with solar, wind, battery storage, and smart grid expertise",
        "description": "Develop skills in renewable energy systems, grid integration, energy storage, and sustainability with certifications from NABCEP, IREC, IEEE, and industry leaders.",
        "gradient_start": "#059669",
        "gradient_end": "#047857",
        "cert_count": 32,
        "vendor_count": 7,
        "categories": [
            {"id": "solar-pv", "name": "Solar PV Systems", "icon": "☀️"},
            {"id": "wind-energy", "name": "Wind Energy", "icon": "💨"},
            {"id": "energy-storage", "name": "Energy Storage", "icon": "🔋"},
            {"id": "smart-grid", "name": "Smart Grid", "icon": "⚡"},
            {"id": "sustainability", "name": "Sustainability", "icon": "🌱"}
        ],
        "vendors": ["NABCEP", "IREC", "IEEE", "Siemens Energy", "GE Renewable", "Tesla Energy", "Schneider Electric"]
    },
    {
        "name": "Construction & Infrastructure",
        "slug": "architecture",
        "icon": "🏗️",
        "subtitle": "Build the future with BIM, project management, structural design, and sustainable construction",
        "description": "Master construction technology, building information modeling, project delivery, and infrastructure engineering with certifications from Autodesk, PMI, LEED, and industry bodies.",
        "gradient_start": "#f59e0b",
        "gradient_end": "#d97706",
        "cert_count": 38,
        "vendor_count": 9,
        "categories": [
            {"id": "bim-modeling", "name": "BIM & Modeling", "icon": "🏛️"},
            {"id": "project-mgmt", "name": "Project Management", "icon": "📋"},
            {"id": "structural", "name": "Structural Design", "icon": "🏗️"},
            {"id": "green-building", "name": "Green Building", "icon": "🌿"},
            {"id": "infrastructure", "name": "Infrastructure", "icon": "🚧"}
        ],
        "vendors": ["Autodesk", "PMI", "USGBC LEED", "Bentley", "Trimble", "RICS", "PCI", "ACI", "AISC"]
    },
    {
        "name": "Communications & Telecommunications",
        "slug": "communications",
        "icon": "📡",
        "subtitle": "Master 5G networks, fiber optics, satellite systems, and next-generation wireless technologies",
        "description": "Develop expertise in telecommunications infrastructure, network operations, wireless technologies, and broadcasting with certifications from Cisco, Nokia, Ericsson, and telecom leaders.",
        "gradient_start": "#3b82f6",
        "gradient_end": "#1d4ed8",
        "cert_count": 33,
        "vendor_count": 8,
        "categories": [
            {"id": "5g-wireless", "name": "5G & Wireless", "icon": "📶"},
            {"id": "fiber-optics", "name": "Fiber Optics", "icon": "🌐"},
            {"id": "satellite", "name": "Satellite Systems", "icon": "🛰️"},
            {"id": "telecom-ops", "name": "Telecom Operations", "icon": "📡"},
            {"id": "broadcasting", "name": "Broadcasting", "icon": "📺"}
        ],
        "vendors": ["Cisco", "Nokia", "Ericsson", "Huawei", "Juniper", "Aruba", "SMPTE", "SBE"]
    },
    {
        "name": "Creative Arts & Digital Design",
        "slug": "creative",
        "icon": "🎨",
        "subtitle": "Master digital content creation, motion graphics, 3D modeling, and immersive experiences",
        "description": "Build creative technology skills in design, video production, animation, VFX, and interactive media with certifications from Adobe, Autodesk, Unity, and creative industry leaders.",
        "gradient_start": "#8b5cf6",
        "gradient_end": "#6d28d9",
        "cert_count": 36,
        "vendor_count": 10,
        "categories": [
            {"id": "graphic-design", "name": "Graphic Design", "icon": "🎨"},
            {"id": "video-production", "name": "Video Production", "icon": "🎬"},
            {"id": "3d-animation", "name": "3D & Animation", "icon": "🎭"},
            {"id": "ui-ux", "name": "UI/UX Design", "icon": "📱"},
            {"id": "digital-media", "name": "Digital Media", "icon": "💻"}
        ],
        "vendors": ["Adobe", "Autodesk", "Unity", "Maxon", "Foundry", "Avid", "Blackmagic", "Apple", "Figma", "Sketch"]
    },
    {
        "name": "Finance & Accounting",
        "slug": "finance",
        "icon": "💰",
        "subtitle": "Excel in financial analysis, accounting systems, tax, audit, and regulatory compliance",
        "description": "Master financial technology, accounting platforms, analytics, and compliance with certifications from CPA, CFA, Intuit, SAP, Oracle, and financial services leaders.",
        "gradient_start": "#10b981",
        "gradient_end": "#059669",
        "cert_count": 34,
        "vendor_count": 9,
        "categories": [
            {"id": "accounting-systems", "name": "Accounting Systems", "icon": "📊"},
            {"id": "financial-analysis", "name": "Financial Analysis", "icon": "📈"},
            {"id": "tax-compliance", "name": "Tax & Compliance", "icon": "📋"},
            {"id": "audit-controls", "name": "Audit & Controls", "icon": "🔍"},
            {"id": "fintech", "name": "FinTech", "icon": "💳"}
        ],
        "vendors": ["AICPA", "CFA Institute", "Intuit", "SAP", "Oracle", "Microsoft", "Bloomberg", "Thomson Reuters", "Workday"]
    },
    {
        "name": "Business & Management",
        "slug": "business",
        "icon": "💼",
        "subtitle": "Lead organizations with strategic planning, operations management, and business analytics",
        "description": "Develop leadership and business technology skills in strategy, operations, analytics, and transformation with certifications from PMI, Salesforce, Microsoft, and management bodies.",
        "gradient_start": "#6366f1",
        "gradient_end": "#4f46e5",
        "cert_count": 31,
        "vendor_count": 8,
        "categories": [
            {"id": "project-management", "name": "Project Management", "icon": "📋"},
            {"id": "business-analytics", "name": "Business Analytics", "icon": "📊"},
            {"id": "crm-systems", "name": "CRM Systems", "icon": "👥"},
            {"id": "operations-mgmt", "name": "Operations Management", "icon": "⚙️"},
            {"id": "strategy", "name": "Strategy & Planning", "icon": "🎯"}
        ],
        "vendors": ["PMI", "Salesforce", "Microsoft", "SAP", "Oracle", "Tableau", "APICS", "Six Sigma"]
    },
    {
        "name": "Environmental & Sustainability",
        "slug": "environmental-sustainability",
        "icon": "🌍",
        "subtitle": "Drive environmental stewardship with sustainability, conservation, and climate technology",
        "description": "Build expertise in environmental management, climate science, conservation technology, and sustainable practices with certifications from LEED, ISSP, EPA, and environmental organizations.",
        "gradient_start": "#22c55e",
        "gradient_end": "#16a34a",
        "cert_count": 29,
        "vendor_count": 7,
        "categories": [
            {"id": "sustainability-mgmt", "name": "Sustainability Management", "icon": "♻️"},
            {"id": "climate-science", "name": "Climate Science", "icon": "🌡️"},
            {"id": "conservation", "name": "Conservation", "icon": "🌳"},
            {"id": "environmental-compliance", "name": "Environmental Compliance", "icon": "📋"},
            {"id": "green-tech", "name": "Green Technology", "icon": "🔬"}
        ],
        "vendors": ["USGBC LEED", "ISSP", "EPA", "ISO", "GRI", "CDP", "GBCI"]
    },
    {
        "name": "Transportation & Logistics",
        "slug": "transportation-logistics",
        "icon": "🚚",
        "subtitle": "Optimize supply chains, fleet management, warehouse automation, and logistics technology",
        "description": "Master transportation systems, supply chain technology, logistics operations, and fleet management with certifications from APICS, ISM, SAP, Oracle, and logistics leaders.",
        "gradient_start": "#f97316",
        "gradient_end": "#ea580c",
        "cert_count": 30,
        "vendor_count": 8,
        "categories": [
            {"id": "supply-chain", "name": "Supply Chain Management", "icon": "📦"},
            {"id": "fleet-mgmt", "name": "Fleet Management", "icon": "🚛"},
            {"id": "warehouse-automation", "name": "Warehouse Automation", "icon": "🏭"},
            {"id": "logistics-ops", "name": "Logistics Operations", "icon": "🚚"},
            {"id": "transportation-tech", "name": "Transportation Tech", "icon": "🚅"}
        ],
        "vendors": ["APICS", "ISM", "SAP", "Oracle", "Manhattan Associates", "JDA", "Blue Yonder", "Trimble"]
    }
]

def generate_configs():
    """Generate JSON configuration files for 9 existing sectors"""
    config_dir = Path("configs/sectors")
    config_dir.mkdir(parents=True, exist_ok=True)
    
    print("🔧 Generating sector configurations...")
    for sector in EXISTING_SECTORS:
        config_file = config_dir / f"{sector['slug']}.json"
        with open(config_file, 'w') as f:
            json.dump(sector, f, indent=2)
        print(f"   ✅ {sector['name']} → {config_file}")
    
    print(f"\n✨ Created {len(EXISTING_SECTORS)} sector configuration files\n")

def generate_certifications():
    """Generate certification databases for 9 existing sectors"""
    data_dir = Path("assets/data")
    data_dir.mkdir(parents=True, exist_ok=True)
    
    print("📜 Generating certification databases...")
    
    for sector in EXISTING_SECTORS:
        certifications = []
        cert_id = 1
        
        # Generate certifications for each vendor
        for vendor in sector['vendors']:
            # Level 1 (25% of total) - 2-3 per vendor
            for i in range(2):
                cert = {
                    "name": f"{vendor} {sector['categories'][i % len(sector['categories'])]['name']} - Level 1",
                    "vendor": vendor,
                    "level": 1,
                    "level_range": [1, 5],
                    "category": sector['categories'][i % len(sector['categories'])]['id'],
                    "focus": f"{sector['categories'][i % len(sector['categories'])]['name']} expertise",
                    "exam": f"{vendor.upper().replace(' ', '').replace('&', '')[:8]}-{1000 + cert_id}",
                    "tags": [sector['categories'][i % len(sector['categories'])]['id'], "level-1", vendor.lower().replace(' ', '-')],
                    "vendor_stage": "Foundation",
                    "price": 250,
                    "retired": False,
                    "logo": f"../assets/images/vendor-logos/{vendor.lower().replace(' ', '-').replace('&', '').replace('/', '')}.svg"
                }
                certifications.append(cert)
                cert_id += 1
            
            # Level 2 (30% of total) - 3-4 per vendor
            for i in range(3):
                cert = {
                    "name": f"{vendor} {sector['categories'][(i+1) % len(sector['categories'])]['name']} - Level 2",
                    "vendor": vendor,
                    "level": 2,
                    "level_range": [2, 5],
                    "category": sector['categories'][(i+1) % len(sector['categories'])]['id'],
                    "focus": f"Advanced {sector['categories'][(i+1) % len(sector['categories'])]['name']}",
                    "exam": f"{vendor.upper().replace(' ', '').replace('&', '')[:8]}-{2000 + cert_id}",
                    "tags": [sector['categories'][(i+1) % len(sector['categories'])]['id'], "level-2", vendor.lower().replace(' ', '-')],
                    "vendor_stage": "Professional",
                    "price": 350,
                    "retired": False,
                    "logo": f"../assets/images/vendor-logos/{vendor.lower().replace(' ', '-').replace('&', '').replace('/', '')}.svg"
                }
                certifications.append(cert)
                cert_id += 1
        
        # Trim to target count
        certifications = certifications[:sector['cert_count']]
        
        # Save to JSON file
        cert_file = data_dir / f"{sector['slug']}-certifications.json"
        with open(cert_file, 'w') as f:
            json.dump(certifications, f, indent=2)
        
        print(f"   ✅ {sector['name']}: {len(certifications)} certifications → {cert_file}")
    
    print(f"\n✨ Generated certification databases for {len(EXISTING_SECTORS)} sectors\n")

if __name__ == "__main__":
    print("=" * 70)
    print("🔄 REBUILDING 9 EXISTING SECTORS WITH IT FLAGSHIP MODEL")
    print("=" * 70)
    print()
    
    generate_configs()
    generate_certifications()
    
    print("=" * 70)
    print("✅ Phase 1 Complete: Configs & Certifications Generated")
    print("=" * 70)
    print()
    print("Next step: Run script 02 to build HTML pages from IT template")
