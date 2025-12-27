#!/usr/bin/env python3
"""
Fix hero section errors in all 23 rebuilt/automated sectors:
1. Fix broken hero badge HTML structure
2. Replace "IT Professional Certification Pathways" with sector name
3. Update stats to be sector-specific
"""

import json
import re
from pathlib import Path

# Sector configurations
SECTOR_FIXES = {
    "automotive": {"title": "Automotive Technology Certifications", "stats": {"certs": "35+", "sectors": "8", "vendors": "8", "frameworks": "2"}},
    "renewable-energy": {"title": "Energy & Renewable Systems Certifications", "stats": {"certs": "32+", "sectors": "7", "vendors": "7", "frameworks": "2"}},
    "architecture": {"title": "Construction & Infrastructure Certifications", "stats": {"certs": "38+", "sectors": "9", "vendors": "9", "frameworks": "2"}},
    "communications": {"title": "Communications & Telecommunications Certifications", "stats": {"certs": "33+", "sectors": "8", "vendors": "8", "frameworks": "2"}},
    "creative": {"title": "Creative Arts & Digital Design Certifications", "stats": {"certs": "36+", "sectors": "10", "vendors": "10", "frameworks": "2"}},
    "finance": {"title": "Finance & Accounting Certifications", "stats": {"certs": "34+", "sectors": "9", "vendors": "9", "frameworks": "2"}},
    "business": {"title": "Business & Management Certifications", "stats": {"certs": "31+", "sectors": "8", "vendors": "8", "frameworks": "2"}},
    "environmental-sustainability": {"title": "Environmental & Sustainability Certifications", "stats": {"certs": "29+", "sectors": "7", "vendors": "7", "frameworks": "2"}},
    "transportation-logistics": {"title": "Transportation & Logistics Certifications", "stats": {"certs": "30+", "sectors": "8", "vendors": "8", "frameworks": "2"}},
    "aerospace": {"title": "Aerospace & Defense Certifications", "stats": {"certs": "27+", "sectors": "6", "vendors": "6", "frameworks": "2"}},
    "agtech": {"title": "Agriculture Technology Certifications", "stats": {"certs": "25+", "sectors": "5", "vendors": "5", "frameworks": "2"}},
    "biotech": {"title": "Biotech & Life Sciences Certifications", "stats": {"certs": "32+", "sectors": "7", "vendors": "7", "frameworks": "2"}},
    "edtech": {"title": "Educational Technology Certifications", "stats": {"certs": "30+", "sectors": "6", "vendors": "6", "frameworks": "2"}},
    "government": {"title": "Government & Civic Technology Certifications", "stats": {"certs": "23+", "sectors": "5", "vendors": "5", "frameworks": "2"}},
    "hospitality": {"title": "Hospitality & Tourism Certifications", "stats": {"certs": "30+", "sectors": "6", "vendors": "6", "frameworks": "2"}},
    "hrtech": {"title": "Human Resources Technology Certifications", "stats": {"certs": "40+", "sectors": "8", "vendors": "8", "frameworks": "2"}},
    "insurtech": {"title": "Insurance Technology Certifications", "stats": {"certs": "28+", "sectors": "6", "vendors": "6", "frameworks": "2"}},
    "legaltech": {"title": "Legal Technology Certifications", "stats": {"certs": "27+", "sectors": "6", "vendors": "6", "frameworks": "2"}},
    "media": {"title": "Media & Entertainment Certifications", "stats": {"certs": "35+", "sectors": "7", "vendors": "7", "frameworks": "2"}},
    "public-safety": {"title": "Public Safety & Emergency Services Certifications", "stats": {"certs": "32+", "sectors": "7", "vendors": "7", "frameworks": "2"}},
    "research": {"title": "Research & Development Certifications", "stats": {"certs": "28+", "sectors": "6", "vendors": "6", "frameworks": "2"}},
    "retail": {"title": "Retail & E-commerce Certifications", "stats": {"certs": "32+", "sectors": "7", "vendors": "7", "frameworks": "2"}},
    "webdev": {"title": "Web Development & Software Engineering Certifications", "stats": {"certs": "43+", "sectors": "9", "vendors": "9", "frameworks": "2"}}
}

def fix_hero_section(html_file, sector_slug):
    """Fix hero section issues"""
    
    with open(html_file, 'r') as f:
        content = f.read()
    
    if sector_slug not in SECTOR_FIXES:
        return False
    
    config = SECTOR_FIXES[sector_slug]
    changed = False
    
    # Fix 1: Fix broken hero badge HTML structure
    # Find the broken structure and fix it
    old_badge_pattern = r'(<div class="hero-badge">.*?</div>)\s*Information Technology Excellence\s*</div>'
    if re.search(old_badge_pattern, content, re.DOTALL):
        content = re.sub(
            old_badge_pattern,
            r'\1',
            content,
            flags=re.DOTALL
        )
        changed = True
    
    # Fix 2: Replace wrong h1 title
    content = re.sub(
        r'<h1>IT Professional Certification Pathways</h1>',
        f'<h1>{config["title"]}</h1>',
        content
    )
    
    # Fix 3: Update stats - certifications
    content = re.sub(
        r'<div class="stat-number">500\+</div>\s*<div class="stat-label">Certifications</div>',
        f'<div class="stat-number">{config["stats"]["certs"]}</div>\n                    <div class="stat-label">Certifications</div>',
        content
    )
    
    # Fix stats - vendors
    content = re.sub(
        r'<div class="stat-number">39</div>\s*<div class="stat-label">Vendor Partners</div>',
        f'<div class="stat-number">{config["stats"]["vendors"]}</div>\n                    <div class="stat-label">Vendor Partners</div>',
        content
    )
    
    # Fix stats - industry sectors (change to "Categories")
    content = re.sub(
        r'<div class="stat-number">15\+</div>\s*<div class="stat-label">Industry Sectors</div>',
        f'<div class="stat-number">{config["stats"]["sectors"]}</div>\n                    <div class="stat-label">Categories</div>',
        content
    )
    
    # Save if changes were made
    with open(html_file, 'w') as f:
        f.write(content)
    
    return True

def main():
    programs_dir = Path("programs")
    
    print("=" * 70)
    print("🔧 FIXING HERO SECTION ERRORS IN ALL 23 SECTORS")
    print("=" * 70)
    print()
    
    fixed_count = 0
    
    for slug in SECTOR_FIXES.keys():
        html_file = programs_dir / f"{slug}.html"
        
        if not html_file.exists():
            print(f"⚠️  {slug}.html not found, skipping...")
            continue
        
        print(f"🔨 Fixing {slug}...")
        if fix_hero_section(html_file, slug):
            print(f"   ✅ Fixed hero badge, title, and stats")
            fixed_count += 1
        else:
            print(f"   ℹ️  No fixes needed")
    
    print()
    print("=" * 70)
    print(f"✅ Fixed {fixed_count}/{len(SECTOR_FIXES)} sector pages")
    print("=" * 70)
    print()

if __name__ == "__main__":
    main()
