#!/usr/bin/env python3
"""
Remove category overview section from all 23 sectors
This section shows hardcoded IT categories and is misleading
"""

import re
from pathlib import Path

SECTORS = [
    "automotive", "renewable-energy", "architecture", "communications",
    "creative", "finance", "business", "environmental-sustainability",
    "transportation-logistics", "aerospace", "agtech", "biotech",
    "edtech", "government", "hospitality", "hrtech", "insurtech",
    "legaltech", "media", "public-safety", "research", "retail", "webdev"
]

def remove_category_overview(html_file):
    """Remove the hardcoded category overview section"""
    
    with open(html_file, 'r') as f:
        content = f.read()
    
    # Find and remove the entire category overview section
    # It starts with <!-- Category Overview --> and ends before the next major section
    pattern = r'<!-- Category Overview -->.*?</section>\s*(?=<!--|\n\s*<section)'
    
    new_content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    if len(new_content) != len(content):
        with open(html_file, 'w') as f:
            f.write(new_content)
        return True
    
    return False

def main():
    programs_dir = Path("programs")
    
    print("=" * 70)
    print("🗑️  REMOVING CATEGORY OVERVIEW SECTIONS (IT HARDCODED CONTENT)")
    print("=" * 70)
    print()
    
    removed_count = 0
    
    for slug in SECTORS:
        html_file = programs_dir / f"{slug}.html"
        
        if not html_file.exists():
            print(f"⚠️  {slug}.html not found, skipping...")
            continue
        
        print(f"🔨 Processing {slug}...")
        if remove_category_overview(html_file):
            print(f"   ✅ Removed category overview section")
            removed_count += 1
        else:
            print(f"   ℹ️  No category overview found")
    
    print()
    print("=" * 70)
    print(f"✅ Removed category sections from {removed_count}/{len(SECTORS)} pages")
    print("=" * 70)
    print()
    print("Result: Users now go straight to certification filtering")
    print("        (the important part that actually works!)")

if __name__ == "__main__":
    main()
