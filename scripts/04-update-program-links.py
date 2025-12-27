#!/usr/bin/env python3
"""
Update program.html to link to newly created sector pages
"""

import re
from pathlib import Path

def update_program_links():
    """Update sector card links in program.html"""
    
    # Mapping of sector keywords to slugs
    sector_mappings = {
        'Public Safety & Emergency Services': 'public-safety',
        'Aerospace & Defense': 'aerospace',
        'Research & Development': 'research',
        'EdTech (Educational Technology)': 'edtech',
        'Biotech & Life Sciences': 'biotech',
        'Web Development & Software Engineering': 'webdev',
        'Government & Civic Technology': 'government',
        'Agriculture Technology': 'agtech',
        'Legal Technology': 'legaltech',
        'Human Resources Technology': 'hrtech',
        'Media & Entertainment Technology': 'media',
        'Insurance Technology': 'insurtech',
        'Hospitality & Tourism Technology': 'hospitality',
        'Retail & E-commerce': 'retail',
    }
    
    with open('program.html', 'r') as f:
        content = f.read()
    
    updates = 0
    for sector_name, slug in sector_mappings.items():
        # Find href="#anything" patterns after this sector name and replace
        pattern = f'({re.escape(sector_name)}.*?href=")#[^"]*(")'
        replacement = f'\\1programs/{slug}.html\\2'
        
        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        if new_content != content:
            updates += 1
            content = new_content
            print(f"   ✅ Updated: {sector_name} -> programs/{slug}.html")
    
    with open('program.html', 'w') as f:
        f.write(content)
    
    return updates

def main():
    print("🔗 Updating program.html sector links...")
    print("=" * 60)
    
    updates = update_program_links()
    
    print(f"\n✅ Updated {updates} sector links in program.html")
    print("\n📋 All automation steps complete!")
    print("\n🚀 Next: Commit and push changes:")
    print("   git add -A")
    print('   git commit -m "Add 14 new sector pages via automation"')
    print("   git push")

if __name__ == "__main__":
    main()
