#!/usr/bin/env python3
"""
Quick fix: Remove IT-specific hardcoded content from all 23 sector pages
This script will strip out AWS, CompTIA, Cisco references and other IT-specific content
"""

import re
from pathlib import Path

# All 23 sector slugs that need fixing
ALL_SECTORS = [
    # 9 existing rebuilt
    "automotive", "renewable-energy", "architecture", "communications",
    "creative", "finance", "business", "environmental-sustainability",
    "transportation-logistics",
    # 14 automated
    "aerospace", "agtech", "biotech", "edtech", "government",
    "hospitality", "hrtech", "insurtech", "legaltech", "media",
    "public-safety", "research", "retail", "webdev"
]

def remove_it_hardcoded_content(html_file):
    """Remove IT-specific hardcoded lists and references"""
    
    with open(html_file, 'r') as f:
        content = f.read()
    
    original_length = len(content)
    
    # Remove IT-specific industry certifications list from features
    content = re.sub(
        r'<li><i class="fas fa-check"></i> Industry Certifications \(CompTIA.*?\)</li>',
        '<li><i class="fas fa-check"></i> Industry-Leading Certifications</li>',
        content,
        flags=re.DOTALL
    )
    
    # Remove hardcoded vendor filter dropdown options (keep the structure, just clean options)
    # We'll remove specific IT vendors like AWS, CompTIA, Cisco, etc.
    it_vendors = [
        'CompTIA', 'Cisco', 'AWS', 'Amazon AWS', 'Microsoft', 'Google Cloud',
        'VMware', 'Red Hat', 'Docker', 'Kubernetes', 'Oracle', 'Python Institute',
        'Linux Professional', 'CWNP', 'PeopleCert', 'ISC2', 'ISACA', 'PMI'
    ]
    
    for vendor in it_vendors:
        content = re.sub(
            rf'<option value="{re.escape(vendor)}">{re.escape(vendor)}</option>\s*',
            '',
            content
        )
    
    # Remove IT-specific hardcoded certification examples in JavaScript
    # Remove the example certifications array entirely
    content = re.sub(
        r'/\* Example certifications.*?(?=\n\s*/\*|\n\s*fetch|\n\s*function loadCertifications)',
        '',
        content,
        flags=re.DOTALL
    )
    
    # Remove IT-specific vendor mappings in JavaScript
    # These are the hardcoded logo paths for IT vendors
    content = re.sub(
        r"const vendorLogos = \{[^}]+?'Python Institute'.*?\};",
        "const vendorLogos = {}; // Populated dynamically from certification data",
        content,
        flags=re.DOTALL
    )
    
    # Remove IT-specific salary data
    content = re.sub(
        r"const certificationSalaries = \{[^}]+?'AWS Cloud Practitioner'.*?\};",
        "const certificationSalaries = {}; // Populated dynamically",
        content,
        flags=re.DOTALL
    )
    
    # Remove IT-specific exception rules
    content = re.sub(
        r"// AWS: allow one Associate.*?\},",
        "",
        content,
        flags=re.DOTALL
    )
    
    # Remove IT vendor tier lists
    content = re.sub(
        r"const premiumVendors = \[.*?'AWS'.*?\];",
        "const premiumVendors = []; // Determined by data",
        content,
        flags=re.DOTALL
    )
    
    # Clean up any remaining AWS/CompTIA references
    content = content.replace('AWS Cloud Practitioner', 'Entry Level Certification')
    content = content.replace('CompTIA A+', 'Foundation Certification')
    
    # Save if changes were made
    if len(content) != original_length:
        with open(html_file, 'w') as f:
            f.write(content)
        return True
    return False

def main():
    programs_dir = Path("programs")
    
    print("=" * 70)
    print("🧹 REMOVING IT-SPECIFIC HARDCODED CONTENT FROM ALL 23 SECTORS")
    print("=" * 70)
    print()
    
    updated_count = 0
    
    for slug in ALL_SECTORS:
        html_file = programs_dir / f"{slug}.html"
        
        if not html_file.exists():
            print(f"⚠️  {slug}.html not found, skipping...")
            continue
        
        print(f"🔧 Processing {slug}...")
        if remove_it_hardcoded_content(html_file):
            print(f"   ✅ Cleaned up IT references")
            updated_count += 1
        else:
            print(f"   ℹ️  No changes needed")
    
    print()
    print("=" * 70)
    print(f"✅ Updated {updated_count}/{len(ALL_SECTORS)} sector pages")
    print("=" * 70)
    print()
    print("Note: This removes IT-specific hardcoded content.")
    print("Certifications will now load from sector-specific JSON files.")
    print()

if __name__ == "__main__":
    main()
