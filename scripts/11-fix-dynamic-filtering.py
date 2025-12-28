#!/usr/bin/env python3
"""
Script to fix dynamic filtering for all 23 sector pages:
1. Update fetch URLs to load sector-specific JSON files
2. Remove hardcoded vendor dropdowns (let them populate dynamically from JSON)
3. Remove hardcoded IT-specific focus areas
"""

import re
from pathlib import Path

# Define all sectors with their JSON file names
SECTORS = {
    'it': 'certifications',  # Flagship keeps its name
    'automotive': 'automotive-certifications',
    'aerospace': 'aerospace-certifications',
    'agtech': 'agtech-certifications',
    'architecture': 'architecture-certifications',
    'biotech': 'biotech-certifications',
    'business': 'business-certifications',
    'communications': 'communications-certifications',
    'creative': 'creative-certifications',
    'edtech': 'edtech-certifications',
    'environmental-sustainability': 'environmental-sustainability-certifications',
    'finance': 'finance-certifications',
    'government': 'government-certifications',
    'hospitality': 'hospitality-certifications',
    'hrtech': 'hrtech-certifications',
    'insurtech': 'insurtech-certifications',
    'legaltech': 'legaltech-certifications',
    'manufacturing': 'manufacturing-certifications',
    'marketing': 'marketing-certifications',
    'public-safety': 'public-safety-certifications',
    'renewable-energy': 'renewable-energy-certifications',
    'transportation-logistics': 'transportation-logistics-certifications',
    'webdev': 'webdev-certifications'
}

def fix_sector_filtering(sector_slug, json_filename):
    """Fix filtering for a single sector page"""
    html_file = Path(f'programs/{sector_slug}.html')
    
    if not html_file.exists():
        print(f"⚠️  Skipping {sector_slug}: File not found")
        return
    
    content = html_file.read_text(encoding='utf-8')
    original_content = content
    
    # 1. Fix the certifications JSON fetch URL
    old_fetch = "fetch('../assets/data/certifications.json', { cache: 'no-store' })"
    new_fetch = f"fetch('../assets/data/{json_filename}.json', {{ cache: 'no-store' }})"
    content = content.replace(old_fetch, new_fetch)
    
    # 2. Remove hardcoded vendor dropdown options (keep only "All Vendors")
    # Find the vendor dropdown section and replace it
    vendor_pattern = re.compile(
        r'(<select id="vendorFilter">.*?<option value="">All Vendors</option>)(.*?)(</select>)',
        re.DOTALL
    )
    
    def replace_vendor_dropdown(match):
        opening = match.group(1)
        closing = match.group(3)
        # Keep opening and closing, remove all hardcoded options between them
        return f"{opening}\n                        <!-- options populated dynamically from dataset -->\n                    {closing}"
    
    content = vendor_pattern.sub(replace_vendor_dropdown, content)
    
    # 3. Remove hardcoded IT-specific focus areas (keep only "All Focus Areas")
    focus_pattern = re.compile(
        r'(<select id="focusFilter">.*?<option value="">All Focus Areas</option>)(.*?)(</select>)',
        re.DOTALL
    )
    
    def replace_focus_dropdown(match):
        opening = match.group(1)
        closing = match.group(3)
        return f"{opening}\n                        <!-- options populated dynamically from dataset -->\n                    {closing}"
    
    content = focus_pattern.sub(replace_focus_dropdown, content)
    
    # Check if changes were made
    if content != original_content:
        html_file.write_text(content, encoding='utf-8')
        print(f"✅ Fixed filtering for {sector_slug}")
        return True
    else:
        print(f"ℹ️  No changes needed for {sector_slug}")
        return False

def main():
    print("🔧 Fixing dynamic filtering for all sector pages...")
    print("=" * 70)
    
    fixed_count = 0
    for sector_slug, json_filename in SECTORS.items():
        if fix_sector_filtering(sector_slug, json_filename):
            fixed_count += 1
    
    print("=" * 70)
    print(f"✅ Complete! Fixed filtering for {fixed_count} sector pages")
    print()
    print("Changes made:")
    print("  1. Updated fetch URLs to load sector-specific JSON files")
    print("  2. Removed hardcoded vendor dropdowns (now populated dynamically)")
    print("  3. Removed hardcoded IT focus areas (now populated dynamically)")

if __name__ == '__main__':
    main()
