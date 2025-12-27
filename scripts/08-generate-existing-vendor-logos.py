#!/usr/bin/env python3
"""
Generate SVG logos for vendors in 9 existing sectors
"""

import json
from pathlib import Path
import hashlib

def generate_svg_logo(vendor_name, output_path):
    """Generate a simple SVG logo with vendor initials"""
    
    # Get initials
    words = vendor_name.split()
    if len(words) >= 2:
        initials = words[0][0] + words[1][0]
    else:
        initials = vendor_name[:2]
    initials = initials.upper()
    
    # Generate color from name hash
    hash_val = int(hashlib.md5(vendor_name.encode()).hexdigest(), 16)
    hue = hash_val % 360
    
    # Create SVG
    svg = f'''<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="hsl({hue}, 65%, 50%)" rx="20"/>
  <text x="100" y="120" font-family="Arial, sans-serif" font-size="80" font-weight="bold" 
        fill="white" text-anchor="middle">{initials}</text>
</svg>'''
    
    with open(output_path, 'w') as f:
        f.write(svg)

def main():
    logos_dir = Path("assets/images/vendor-logos")
    logos_dir.mkdir(parents=True, exist_ok=True)
    
    # Load all sector configs
    sectors_dir = Path("configs/sectors")
    
    all_vendors = set()
    
    print("=" * 70)
    print("🎨 GENERATING VENDOR LOGOS FOR 9 EXISTING SECTORS")
    print("=" * 70)
    print()
    
    # Collect all unique vendors
    for config_file in sectors_dir.glob("*.json"):
        slug = config_file.stem
        if slug in ["automotive", "renewable-energy", "architecture", "communications",
                    "creative", "finance", "business", "environmental-sustainability",
                    "transportation-logistics"]:
            with open(config_file, 'r') as f:
                config = json.load(f)
                all_vendors.update(config.get('vendors', []))
    
    print(f"📊 Found {len(all_vendors)} unique vendors")
    print()
    
    created_count = 0
    skipped_count = 0
    
    for vendor in sorted(all_vendors):
        # Create filename
        filename = vendor.lower().replace(' ', '-').replace('&', '').replace('/', '') + '.svg'
        logo_path = logos_dir / filename
        
        if logo_path.exists():
            print(f"   ⏭️  {vendor} (already exists)")
            skipped_count += 1
        else:
            generate_svg_logo(vendor, logo_path)
            print(f"   ✅ {vendor} → {filename}")
            created_count += 1
    
    print()
    print("=" * 70)
    print(f"✅ Created {created_count} new logos, skipped {skipped_count} existing")
    print("=" * 70)
    print()

if __name__ == "__main__":
    main()
