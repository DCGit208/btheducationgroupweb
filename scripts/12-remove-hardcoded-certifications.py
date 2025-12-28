#!/usr/bin/env python3
"""
Script to remove hardcoded IT certification arrays from all sector pages.
The pages should load certifications ONLY from their sector-specific JSON files,
not from hardcoded inline arrays.
"""

import re
from pathlib import Path

# All sector HTML files
SECTORS = [
    'it', 'automotive', 'aerospace', 'agtech', 'architecture', 'biotech',
    'business', 'communications', 'creative', 'edtech', 'environmental-sustainability',
    'finance', 'government', 'hospitality', 'hrtech', 'insurtech', 'legaltech',
    'manufacturing', 'public-safety', 'renewable-energy', 'transportation-logistics', 'webdev'
]

def remove_hardcoded_certifications(sector_slug):
    """Remove hardcoded certification array from a sector page"""
    html_file = Path(f'programs/{sector_slug}.html')
    
    if not html_file.exists():
        print(f"⚠️  Skipping {sector_slug}: File not found")
        return False
    
    content = html_file.read_text(encoding='utf-8')
    original_content = content
    
    # Find the hardcoded certifications array and replace it with an empty array
    # Pattern: let certifications = [ ... big array with CompTIA, AWS, etc ... ];
    pattern = re.compile(
        r'(let certifications = \[)\s*\{[^}]*CompTIA[^}]*\}.*?(\];)',
        re.DOTALL
    )
    
    # Replace with empty array (JSON will populate it)
    replacement = r'\1\n                        // Certifications loaded from JSON file\n                    \2'
    
    content = pattern.sub(replacement, content)
    
    if content != original_content:
        html_file.write_text(content, encoding='utf-8')
        print(f"✅ Removed hardcoded certifications from {sector_slug}")
        return True
    else:
        print(f"ℹ️  No hardcoded certifications found in {sector_slug}")
        return False

def main():
    print("🔧 Removing hardcoded certification arrays from sector pages...")
    print("=" * 70)
    
    fixed_count = 0
    for sector_slug in SECTORS:
        if remove_hardcoded_certifications(sector_slug):
            fixed_count += 1
    
    print("=" * 70)
    print(f"✅ Complete! Removed hardcoded certifications from {fixed_count} sector pages")
    print()
    print("Now all sectors will load their certifications ONLY from their")
    print("sector-specific JSON files (e.g., automotive-certifications.json)")

if __name__ == '__main__':
    main()
