#!/usr/bin/env python3
"""
BTH Sector Automation - Master Script
Generates all 23 industry sector pages from IT template
"""

import json
import sys
from pathlib import Path

# Sector configurations with all metadata
SECTORS = [
    {
        "name": "Human Resources Technology",
        "slug": "hrtech",
        "icon": "👥",
        "subtitle": "HR Systems & People Ops",
        "description": "Workday, SAP SuccessFactors, Talent Management, HR Analytics",
        "description_long": "Master enterprise HRIS platforms, talent acquisition, workforce planning, and people operations with industry-leading certifications from Workday, SAP, Oracle, and more.",
        "hero_gradient": ["#667eea", "#764ba2"],
        "total_certifications": 40,
        "total_vendors": 15,
        "avg_salary": "$95,000",
        "categories": ["HRIS Systems", "Talent Management", "Payroll & Benefits", "HR Analytics"],
        "featured_vendors": ["Workday", "SAP SuccessFactors", "Oracle HCM", "ADP", "BambooHR"]
    },
    {
        "name": "Web Development & Software Engineering",
        "slug": "webdev",
        "icon": "💻",
        "subtitle": "Full-Stack & Cloud-Native",
        "description": "Front-End, Back-End, Full-Stack, DevOps, Cloud-Native Development",
        "description_long": "Build modern web applications with certifications in React, Node.js, Python, AWS, Docker, Kubernetes, and complete full-stack development frameworks.",
        "hero_gradient": ["#3b82f6", "#1d4ed8"],
        "total_certifications": 45,
        "total_vendors": 18,
        "avg_salary": "$110,000",
        "categories": ["Front-End", "Back-End", "Full-Stack", "DevOps", "Cloud-Native"],
        "featured_vendors": ["AWS", "Microsoft", "Google", "Docker", "Red Hat"]
    },
    {
        "name": "Legal Technology",
        "slug": "legaltech",
        "icon": "⚖️",
        "subtitle": "LegalTech & Compliance",
        "description": "Case Management, E-Discovery, Contract Lifecycle, Compliance Tech",
        "description_long": "Transform legal practice with certifications in case management systems, e-discovery platforms, contract automation, and legal compliance technology.",
        "hero_gradient": ["#059669", "#047857"],
        "total_certifications": 28,
        "total_vendors": 12,
        "avg_salary": "$88,000",
        "categories": ["Case Management", "E-Discovery", "Contract Lifecycle", "Legal Research"],
        "featured_vendors": ["Clio", "LexisNexis", "Thomson Reuters", "Relativity", "iManage"]
    },
    {
        "name": "Media & Entertainment Technology",
        "slug": "media",
        "icon": "🎬",
        "subtitle": "Broadcasting & Production",
        "description": "Broadcasting Systems, Streaming, Game Development, Audio/Video Production",
        "description_long": "Master entertainment technology from content creation to distribution with certifications in broadcasting, streaming platforms, game engines, and production tools.",
        "hero_gradient": ["#dc2626", "#991b1b"],
        "total_certifications": 38,
        "total_vendors": 16,
        "avg_salary": "$92,000",
        "categories": ["Broadcasting", "Streaming Platforms", "Game Development", "Audio/Video Production"],
        "featured_vendors": ["Avid", "Adobe", "Unity", "Unreal Engine", "Blackmagic"]
    },
    {
        "name": "Insurance Technology",
        "slug": "insurtech",
        "icon": "🛡️",
        "subtitle": "InsurTech & Risk Management",
        "description": "Insurance Systems, Claims Management, Underwriting, Risk Assessment",
        "description_long": "Advance insurance operations with certifications in policy administration, claims processing, underwriting platforms, and actuarial technology systems.",
        "hero_gradient": ["#7c3aed", "#5b21b6"],
        "total_certifications": 30,
        "total_vendors": 10,
        "avg_salary": "$85,000",
        "categories": ["Policy Administration", "Claims Management", "Underwriting", "Risk Assessment"],
        "featured_vendors": ["Guidewire", "Duck Creek", "Majesco", "Sapiens", "Insurity"]
    },
    {
        "name": "Retail & E-commerce",
        "slug": "retail",
        "icon": "🛍️",
        "subtitle": "Digital Commerce",
        "description": "Shopify, Magento, WooCommerce, POS Systems, Omnichannel",
        "description_long": "Build and manage digital commerce platforms with certifications in e-commerce systems, point-of-sale, inventory management, and omnichannel retail technology.",
        "hero_gradient": ["#ec4899", "#be185d"],
        "total_certifications": 35,
        "total_vendors": 14,
        "avg_salary": "$78,000",
        "categories": ["E-Commerce Platforms", "POS Systems", "Inventory Management", "Payment Processing"],
        "featured_vendors": ["Shopify", "Magento", "WooCommerce", "Square", "Salesforce Commerce"]
    },
    {
        "name": "Hospitality & Tourism Technology",
        "slug": "hospitality",
        "icon": "🏨",
        "subtitle": "Hotel & Travel Systems",
        "description": "Hotel Management (Opera, Mews), Restaurant POS, Tourism Tech",
        "description_long": "Optimize hospitality operations with certifications in property management systems, restaurant technology, booking platforms, and guest experience solutions.",
        "hero_gradient": ["#f59e0b", "#d97706"],
        "total_certifications": 32,
        "total_vendors": 13,
        "avg_salary": "$72,000",
        "categories": ["Property Management", "Restaurant POS", "Booking Systems", "Guest Experience"],
        "featured_vendors": ["Oracle Hospitality", "Mews", "Toast", "OpenTable", "Amadeus"]
    },
    {
        "name": "Public Safety & Emergency Services",
        "slug": "public-safety",
        "icon": "🚨",
        "subtitle": "Emergency Management & Safety Tech",
        "description": "Emergency Management, Fire Safety, Security Systems, Public Safety Tech",
        "description_long": "Protect communities with certifications in emergency management systems, fire safety technology, security operations, and public safety communications.",
        "hero_gradient": ["#dc2626", "#7f1d1d"],
        "total_certifications": 35,
        "total_vendors": 14,
        "avg_salary": "$82,000",
        "categories": ["Emergency Management", "Fire Safety", "Security Systems", "Public Safety Communications"],
        "featured_vendors": ["FEMA", "NFPA", "ASIS", "DHS", "Motorola Solutions"]
    },
    {
        "name": "Aerospace & Defense",
        "slug": "aerospace",
        "icon": "✈️",
        "subtitle": "Aviation & Defense Systems",
        "description": "Aerospace Systems, Avionics, Defense Cyber, Aviation Operations",
        "description_long": "Advance aerospace and defense technology with certifications in aviation systems, avionics, defense cybersecurity, and aerospace manufacturing.",
        "hero_gradient": ["#1e40af", "#1e3a8a"],
        "total_certifications": 28,
        "total_vendors": 11,
        "avg_salary": "$105,000",
        "categories": ["Aerospace Systems", "Avionics", "Defense Cybersecurity", "Aviation Operations"],
        "featured_vendors": ["FAA", "Boeing", "Lockheed Martin", "Northrop Grumman", "Raytheon"]
    },
    {
        "name": "Research & Development",
        "slug": "research",
        "icon": "🔬",
        "subtitle": "Laboratory & Innovation Tech",
        "description": "Laboratory Technology, Clinical Research, Innovation Management, Data Science",
        "description_long": "Drive innovation with certifications in laboratory information systems, clinical research management, R&D operations, and scientific data analysis.",
        "hero_gradient": ["#0891b2", "#0e7490"],
        "total_certifications": 30,
        "total_vendors": 12,
        "avg_salary": "$98,000",
        "categories": ["Laboratory Systems", "Clinical Research", "Innovation Management", "Scientific Data"],
        "featured_vendors": ["LabWare", "Thermo Fisher", "Waters", "Agilent", "PerkinElmer"]
    },
    {
        "name": "EdTech (Educational Technology)",
        "slug": "edtech",
        "icon": "📚",
        "subtitle": "Learning Management Systems",
        "description": "Instructional Design, LMS Platforms, eLearning, Educational Technology",
        "description_long": "Transform education with certifications in learning management systems, instructional design, e-learning development, and educational technology platforms.",
        "hero_gradient": ["#10b981", "#059669"],
        "total_certifications": 32,
        "total_vendors": 13,
        "avg_salary": "$76,000",
        "categories": ["Learning Management Systems", "Instructional Design", "E-Learning Development", "EdTech Platforms"],
        "featured_vendors": ["Canvas", "Blackboard", "Moodle", "Articulate", "Adobe Captivate"]
    },
    {
        "name": "Biotech & Life Sciences",
        "slug": "biotech",
        "icon": "🧬",
        "subtitle": "Biomedical & Pharmaceutical Tech",
        "description": "Biomedical Equipment, Clinical Research, Biotechnology, Pharma Tech",
        "description_long": "Advance life sciences with certifications in biomedical equipment, clinical trial management, biotechnology systems, and pharmaceutical technology.",
        "hero_gradient": ["#8b5cf6", "#6d28d9"],
        "total_certifications": 34,
        "total_vendors": 14,
        "avg_salary": "$102,000",
        "categories": ["Biomedical Equipment", "Clinical Trials", "Biotechnology Systems", "Pharmaceutical Tech"],
        "featured_vendors": ["Medtronic", "Philips Healthcare", "GE Healthcare", "Siemens Healthineers", "Abbott"]
    },
    {
        "name": "Government & Civic Technology",
        "slug": "government",
        "icon": "🏛️",
        "subtitle": "GovTech & Public Sector IT",
        "description": "GovTech Platforms, Digital Identity, Public Sector IT, Civic Engagement",
        "description_long": "Modernize government services with certifications in civic technology platforms, digital identity systems, public sector IT, and e-government solutions.",
        "hero_gradient": ["#475569", "#334155"],
        "total_certifications": 25,
        "total_vendors": 10,
        "avg_salary": "$84,000",
        "categories": ["GovTech Platforms", "Digital Identity", "Public Sector IT", "Civic Engagement"],
        "featured_vendors": ["Tyler Technologies", "NIC", "Granicus", "Accela", "CivicPlus"]
    },
    {
        "name": "Agriculture Technology",
        "slug": "agtech",
        "icon": "🌾",
        "subtitle": "Precision Agriculture",
        "description": "Smart Farming, Agricultural Drones, IoT Agriculture, Precision Ag",
        "description_long": "Transform farming with certifications in precision agriculture, drone systems, IoT sensors, smart irrigation, and agricultural data analytics.",
        "hero_gradient": ["#84cc16", "#65a30d"],
        "total_certifications": 27,
        "total_vendors": 11,
        "avg_salary": "$75,000",
        "categories": ["Precision Agriculture", "Agricultural Drones", "IoT Agriculture", "Smart Irrigation"],
        "featured_vendors": ["John Deere", "CNH Industrial", "Trimble", "DJI Agriculture", "Climate FieldView"]
    }
]

def save_sector_configs():
    """Save all sector configurations to JSON files"""
    config_dir = Path('configs/sectors')
    config_dir.mkdir(parents=True, exist_ok=True)
    
    for sector in SECTORS:
        config_file = config_dir / f"{sector['slug']}.json"
        with open(config_file, 'w') as f:
            json.dump(sector, f, indent=2)
        print(f"✅ Created config: {config_file}")
    
    print(f"\n✅ Generated {len(SECTORS)} sector configuration files")

def main():
    print("🚀 BTH Sector Automation - Configuration Generator")
    print("=" * 60)
    
    save_sector_configs()
    
    print("\n📋 Next Steps:")
    print("1. Review configs in configs/sectors/")
    print("2. Run: python3 scripts/generate-sector-certifications.py")
    print("3. Run: python3 scripts/build-sector-pages.py")

if __name__ == "__main__":
    main()
