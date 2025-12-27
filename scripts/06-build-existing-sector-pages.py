#!/usr/bin/env python3
"""
Build world-class HTML pages for 9 existing sectors from IT flagship template
"""

import json
import re
from pathlib import Path

def load_sector_config(slug):
    """Load sector configuration from JSON"""
    config_file = Path(f"configs/sectors/{slug}.json")
    with open(config_file, 'r') as f:
        return json.load(f)

def build_page_from_template(sector_config, template_path, output_path):
    """Build sector page by replacing template variables"""
    
    # Read IT template
    with open(template_path, 'r') as f:
        content = f.read()
    
    # Extract sector data
    name = sector_config['name']
    slug = sector_config['slug']
    icon = sector_config['icon']
    subtitle = sector_config['subtitle']
    description = sector_config['description']
    grad_start = sector_config['gradient_start']
    grad_end = sector_config['gradient_end']
    cert_count = sector_config['cert_count']
    vendor_count = sector_config['vendor_count']
    categories = sector_config['categories']
    vendors = sector_config['vendors']
    
    # === TITLE & META ===
    content = re.sub(
        r'<title>.*?</title>',
        f'<title>{name} Certifications | BTH Education Group - Professional Development & HEXAD Framework</title>',
        content
    )
    
    content = re.sub(
        r'<meta name="description" content=".*?">',
        f'<meta name="description" content="{description} across 15+ industry sectors. Professional development pathway or complete HEXAD framework.">',
        content
    )
    
    # === HERO SECTION ===
    # Hero badge
    content = re.sub(
        r'<div class="hero-badge">.*?</div>',
        f'<div class="hero-badge">\n                    <span class="badge-icon">{icon}</span>\n                    <span>{name} Certifications</span>\n                </div>',
        content,
        flags=re.DOTALL
    )
    
    # Hero title
    content = re.sub(
        r'(<div class="programs-hero"[^>]*>.*?<h1[^>]*>).*?(</h1>)',
        rf'\1{name}\2',
        content,
        flags=re.DOTALL
    )
    
    # Hero subtitle
    content = re.sub(
        r'(<p class="subtitle">).*?(</p>)',
        rf'\1{subtitle}\2',
        content,
        flags=re.DOTALL
    )
    
    # Hero gradient
    content = re.sub(
        r'background: linear-gradient\(135deg, #667eea 0%, #764ba2 100%\);',
        f'background: linear-gradient(135deg, {grad_start} 0%, {grad_end} 100%);',
        content
    )
    
    # === STATS SECTION ===
    content = re.sub(
        r'(<div class="stat-value">)\d+(\+</div>\s*<div class="stat-label">Certifications</div>)',
        rf'\g<1>{cert_count}\2',
        content
    )
    
    content = re.sub(
        r'(<div class="stat-value">)\d+(\+</div>\s*<div class="stat-label">Vendors</div>)',
        rf'\g<1>{vendor_count}\2',
        content
    )
    
    # === CERTIFICATION DATA FILE PATH ===
    content = re.sub(
        r"fetch\('../assets/data/[^']+certifications\.json'",
        f"fetch('../assets/data/{slug}-certifications.json'",
        content
    )
    
    # === CATEGORY FILTER BUTTONS ===
    category_html = '\n'.join([
        f'                        <button class="filter-btn" data-category="{cat["id"]}">\n'
        f'                            <span class="category-icon">{cat["icon"]}</span>\n'
        f'                            <span>{cat["name"]}</span>\n'
        f'                        </button>'
        for cat in categories
    ])
    
    content = re.sub(
        r'(<button class="filter-btn active" data-category="all">.*?</button>\s*)(<button class="filter-btn".*?</button>\s*)+',
        r'\1' + category_html + '\n',
        content,
        flags=re.DOTALL
    )
    
    # Save output
    with open(output_path, 'w') as f:
        f.write(content)
    
    return True

def main():
    # Load all sector configs
    sectors_to_rebuild = [
        "automotive",
        "renewable-energy", 
        "architecture",
        "communications",
        "creative",
        "finance",
        "business",
        "environmental-sustainability",
        "transportation-logistics"
    ]
    
    template_path = Path("programs/informationtechnology.html")
    output_dir = Path("programs")
    
    print("=" * 70)
    print("🏗️  BUILDING 9 SECTOR PAGES FROM IT FLAGSHIP TEMPLATE")
    print("=" * 70)
    print()
    
    success_count = 0
    
    for slug in sectors_to_rebuild:
        try:
            sector_config = load_sector_config(slug)
            output_file = output_dir / f"{slug}.html"
            
            print(f"🔨 Building {sector_config['name']}...")
            build_page_from_template(sector_config, template_path, output_file)
            print(f"   ✅ Created → {output_file}")
            success_count += 1
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print()
    print("=" * 70)
    print(f"✅ Successfully built {success_count}/{len(sectors_to_rebuild)} sector pages")
    print("=" * 70)
    print()
    print("⚠️  NOTE: Pages need additional customization:")
    print("   - Replace IT-specific PD modules with sector-relevant content")
    print("   - Update vendor filter lists")
    print("   - Customize example certifications")
    print()
    print("Next: Run script 07 to add sector-specific content enhancements")

if __name__ == "__main__":
    main()
