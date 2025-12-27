#!/usr/bin/env python3
"""
Build sector pages from IT template
"""

import json
import re
from pathlib import Path
from shutil import copy2

def load_it_template():
    """Load IT page as master template"""
    with open('programs/informationtechnology.html', 'r') as f:
        return f.read()

def replace_sector_variables(template, sector_config):
    """Replace sector-specific variables in template"""
    
    page = template
    
    # Title and metadata replacements
    replacements = [
        # Page title
        ('Information Technology Certifications', f"{sector_config['name']} Certifications"),
        ('Information Technology', sector_config['name']),
        ('informationtechnology', sector_config['slug']),
        
        # Hero section
        ('🖥️', sector_config['icon']),
        ('Core Infrastructure & Development', sector_config['subtitle']),
        ('Choose from 500+ technology certifications', sector_config['description_long']),
        
        # Data file reference
        ('certifications.json', f"{sector_config['slug']}-certifications.json"),
        
        # Breadcrumb and navigation
        ('IT', sector_config['name'][:15]),  # Abbreviated name
    ]
    
    for old, new in replacements:
        page = page.replace(old, new)
    
    return page

def build_sector_page(sector_slug):
    """Generate a complete sector page"""
    
    # Load sector config
    config_file = Path(f'configs/sectors/{sector_slug}.json')
    with open(config_file, 'r') as f:
        sector_config = json.load(f)
    
    print(f"\n🏗️  Building {sector_config['name']} page...")
    
    # Load IT template
    template = load_it_template()
    
    # Replace variables
    page_content = replace_sector_variables(template, sector_config)
    
    # Write output file
    output_file = Path(f"programs/{sector_slug}.html")
    with open(output_file, 'w') as f:
        f.write(page_content)
    
    print(f"   ✅ Created: {output_file}")
    return output_file

def main():
    print("🚀 Building all sector pages from IT template...")
    print("=" * 60)
    
    config_dir = Path('configs/sectors')
    built_pages = []
    
    for config_file in sorted(config_dir.glob('*.json')):
        sector_slug = config_file.stem
        output_file = build_sector_page(sector_slug)
        built_pages.append(output_file)
    
    print(f"\n✅ Successfully built {len(built_pages)} sector pages!")
    print("\n📋 Next: Run python3 scripts/03-generate-vendor-logos.py")

if __name__ == "__main__":
    main()
