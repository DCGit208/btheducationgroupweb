#!/usr/bin/env python3
"""
Generate placeholder SVG logos for all vendors
"""

import json
from pathlib import Path
import re

def generate_svg_logo(vendor_name):
    """Generate a simple SVG logo with vendor initials"""
    
    # Get initials (first letter of first 2 words)
    words = vendor_name.split()
    if len(words) >= 2:
        initials = f"{words[0][0]}{words[1][0]}".upper()
    else:
        initials = vendor_name[:2].upper()
    
    # Color palette (professional colors)
    colors = [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#14b8a6'
    ]
    
    # Pick color based on vendor name hash
    color = colors[abs(hash(vendor_name)) % len(colors)]
    
    svg = f'''<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="{color}" rx="20"/>
  <text x="100" y="125" font-family="Arial, sans-serif" font-size="70" 
        fill="white" text-anchor="middle" font-weight="bold">{initials}</text>
</svg>'''
    
    return svg

def extract_all_vendors():
    """Extract unique vendors from all certification JSON files"""
    
    vendors = set()
    data_dir = Path('assets/data')
    
    for cert_file in data_dir.glob('*-certifications.json'):
        with open(cert_file, 'r') as f:
            certifications = json.load(f)
            for cert in certifications:
                vendors.add(cert['vendor'])
    
    return sorted(vendors)

def create_vendor_logo(vendor_name, logo_dir):
    """Create a vendor logo file"""
    
    # Sanitize filename
    safe_name = re.sub(r'[^a-z0-9]+', '', vendor_name.lower())
    logo_path = logo_dir / f"{safe_name}.svg"
    
    if logo_path.exists():
        return False  # Already exists
    
    # Generate SVG
    svg_content = generate_svg_logo(vendor_name)
    
    with open(logo_path, 'w') as f:
        f.write(svg_content)
    
    return True

def main():
    print("🎨 Generating vendor logos...")
    print("=" * 60)
    
    # Create logo directory
    logo_dir = Path('assets/images/vendor-logos')
    logo_dir.mkdir(parents=True, exist_ok=True)
    
    # Extract all unique vendors
    vendors = extract_all_vendors()
    print(f"\n📊 Found {len(vendors)} unique vendors")
    
    # Generate logos
    created = 0
    skipped = 0
    
    for vendor in vendors:
        if create_vendor_logo(vendor, logo_dir):
            print(f"   ✅ Created: {vendor}")
            created += 1
        else:
            print(f"   ⏭️  Skipped: {vendor} (already exists)")
            skipped += 1
    
    print(f"\n✅ Logo generation complete!")
    print(f"   Created: {created} logos")
    print(f"   Skipped: {skipped} logos (already existed)")
    print(f"\n📋 Next: Run python3 scripts/04-update-program-links.py")

if __name__ == "__main__":
    main()
