#!/usr/bin/env python3
"""
Generate certification databases for all sectors using AI
"""

import json
import os
from pathlib import Path

# Mock certifications for now (will use AI later)
def generate_mock_certifications(sector_config):
    """Generate mock certification data for a sector"""
    
    certifications = []
    target_certs = sector_config['total_certifications']
    vendors = sector_config['featured_vendors']
    categories = sector_config['categories']
    
    # Level distribution
    level_distribution = {
        1: int(target_certs * 0.25),  # 25% Foundation
        2: int(target_certs * 0.30),  # 30% Intermediate
        3: int(target_certs * 0.25),  # 25% Advanced
        4: int(target_certs * 0.15),  # 15% Expert
        5: int(target_certs * 0.05),  # 5% Master
    }
    
    cert_id = 1
    for level, count in level_distribution.items():
        for i in range(count):
            vendor = vendors[i % len(vendors)]
            category = categories[i % len(categories)]
            
            # Determine level_range based on level
            if level == 1:
                level_range = [1, 5]
            elif level == 2:
                level_range = [2, 5]
            elif level == 3:
                level_range = [3, 5]
            elif level == 4:
                level_range = [4, 5]
            else:
                level_range = [5, 5]
            
            stage_map = {1: "Foundation", 2: "Associate", 3: "Professional", 4: "Expert", 5: "Master"}
            
            cert = {
                "name": f"{vendor} {category} - Level {level}",
                "vendor": vendor,
                "level": level,
                "level_range": level_range,
                "category": category,
                "focus": f"{category} expertise",
                "exam": f"{vendor.upper()}-{level}{str(cert_id).zfill(3)}",
                "tags": [category.lower().replace(' ', '-'), f"level-{level}", vendor.lower().replace(' ', '-')],
                "vendor_stage": stage_map[level],
                "price": 200 + (level * 50),
                "retired": False,
                "logo": f"../assets/images/vendor-logos/{vendor.lower().replace(' ', '')}.svg"
            }
            
            certifications.append(cert)
            cert_id += 1
    
    return certifications

def main():
    print("🚀 Generating certification databases for all sectors...")
    print("=" * 60)
    
    config_dir = Path('configs/sectors')
    data_dir = Path('assets/data')
    data_dir.mkdir(parents=True, exist_ok=True)
    
    for config_file in sorted(config_dir.glob('*.json')):
        with open(config_file, 'r') as f:
            sector_config = json.load(f)
        
        print(f"\n📊 Generating certifications for {sector_config['name']}...")
        certifications = generate_mock_certifications(sector_config)
        
        output_file = data_dir / f"{sector_config['slug']}-certifications.json"
        with open(output_file, 'w') as f:
            json.dump(certifications, f, indent=2)
        
        print(f"   ✅ Generated {len(certifications)} certifications")
        print(f"   💾 Saved to: {output_file}")
    
    print(f"\n✅ All certification databases generated!")
    print("\n📋 Next: Run python3 scripts/02-build-sector-pages.py")

if __name__ == "__main__":
    main()
