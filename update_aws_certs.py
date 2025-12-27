#!/usr/bin/env python3
import json
import sys

# Load the current certifications database
with open('assets/data/certifications.json', 'r') as f:
    certs = json.load(f)

# Define the 12 active AWS certifications for 2025 with proper levels
aws_2025_certs = {
    # Level 1: Foundation (3 certs)
    "AWS Certified Cloud Practitioner": {"level": 1, "level_range": [1, 5], "exam": "CLF-C02", "focus": "Cloud Fundamentals", "vendor_stage": "Foundational", "tags": ["AWS-Foundational", "cloud-literacy"]},
    "AWS Certified AI Practitioner": {"level": 1, "level_range": [1, 5], "exam": "AIF-C01", "focus": "AI Fundamentals", "vendor_stage": "Foundational", "tags": ["AWS-Foundational", "ai-literacy"]},
    "AWS Certified Data Engineer – Associate": {"level": 1, "level_range": [1, 5], "exam": "DEA-C01", "focus": "Data Engineering", "vendor_stage": "Associate", "tags": ["AWS-Associate", "data-literacy"]},
    
    # Level 2: Core Engineering (4 certs)
    "AWS Certified Solutions Architect – Associate": {"level": 2, "level_range": [2, 5], "exam": "SAA-C03", "focus": "Solutions Architecture", "vendor_stage": "Associate", "tags": ["AWS-Associate", "architecture"]},
    "AWS Certified Developer – Associate": {"level": 2, "level_range": [2, 5], "exam": "DVA-C02", "focus": "Application Development", "vendor_stage": "Associate", "tags": ["AWS-Associate", "developer"]},
    "AWS Certified CloudOps Engineer – Associate": {"level": 2, "level_range": [2, 5], "exam": "SOA-C02", "focus": "Operations", "vendor_stage": "Associate", "tags": ["AWS-Associate", "operations"]},
    "AWS Certified Machine Learning Engineer – Associate": {"level": 2, "level_range": [2, 5], "exam": "MLA-C01", "focus": "ML Engineering", "vendor_stage": "Associate", "tags": ["AWS-Associate", "machine-learning"]},
    
    # Level 3: Strategic Leadership (2 certs)
    "AWS Certified Solutions Architect – Professional": {"level": 3, "level_range": [3, 5], "exam": "SAP-C02", "focus": "Advanced Architecture", "vendor_stage": "Professional", "tags": ["AWS-Professional", "architecture"]},
    "AWS Certified DevOps Engineer – Professional": {"level": 3, "level_range": [3, 5], "exam": "DOP-C02", "focus": "DevOps", "vendor_stage": "Professional", "tags": ["AWS-Professional", "devops"]},
    
    # Level 4: Infrastructure Specialization (2 certs)
    "AWS Certified Security – Specialty": {"level": 4, "level_range": [4, 5], "exam": "SCS-C02", "focus": "Security", "vendor_stage": "Specialty", "tags": ["AWS-Specialty", "security"]},
    "AWS Certified Advanced Networking – Specialty": {"level": 4, "level_range": [4, 5], "exam": "ANS-C01", "focus": "Networking", "vendor_stage": "Specialty", "tags": ["AWS-Specialty", "networking"]},
    
    # Level 5: Frontier AI (2 certs)
    "AWS Certified Generative AI Developer – Professional": {"level": 5, "level_range": [5, 5], "exam": "GEN-C01", "focus": "Generative AI", "vendor_stage": "Professional", "tags": ["AWS-Professional", "generative-ai"]},
    "AWS Certified Machine Learning – Specialty": {"level": 5, "level_range": [5, 5], "exam": "MLS-C01", "focus": "Machine Learning", "vendor_stage": "Specialty", "tags": ["AWS-Specialty", "machine-learning", "retiring-2026"]},
}

# Update existing AWS certifications and mark others as retired
updated_count = 0
retired_count = 0

for cert in certs:
    if cert.get("vendor") == "AWS":
        cert_name = cert.get("name")
        if cert_name in aws_2025_certs:
            # Update with new structure
            cert["level"] = aws_2025_certs[cert_name]["level"]
            cert["level_range"] = aws_2025_certs[cert_name]["level_range"]
            cert["exam"] = aws_2025_certs[cert_name]["exam"]
            cert["focus"] = aws_2025_certs[cert_name]["focus"]
            cert["vendor_stage"] = aws_2025_certs[cert_name]["vendor_stage"]
            cert["tags"] = aws_2025_certs[cert_name]["tags"]
            cert["retired"] = False
            cert["premium"] = True
            cert["category"] = "cloud-platforms"
            updated_count += 1
            print(f"✓ Updated: {cert_name} -> Level {cert['level']}")
        else:
            # Mark as retired (not part of 2025 active list)
            cert["retired"] = True
            retired_count += 1
            print(f"⊗ Retired: {cert_name}")

# Add any missing certifications from the 2025 list
existing_names = {c.get("name") for c in certs if c.get("vendor") == "AWS"}
added_count = 0

for cert_name, cert_data in aws_2025_certs.items():
    if cert_name not in existing_names:
        new_cert = {
            "name": cert_name,
            "vendor": "AWS",
            "category": "cloud-platforms",
            "focus": cert_data["focus"],
            "level": cert_data["level"],
            "level_range": cert_data["level_range"],
            "retired": False,
            "premium": True,
            "exam": cert_data["exam"],
            "tags": cert_data["tags"],
            "vendor_stage": cert_data["vendor_stage"],
            "id": hash(cert_name) % 10000000000  # Simple ID generation
        }
        certs.append(new_cert)
        added_count += 1
        print(f"+ Added: {cert_name} -> Level {cert_data['level']}")

# Save the updated database
with open('assets/data/certifications.json', 'w') as f:
    json.dump(certs, f, indent=2)

print(f"\n✓ Database updated successfully!")
print(f"  Updated: {updated_count} certifications")
print(f"  Added: {added_count} certifications")
print(f"  Retired: {retired_count} certifications")
print(f"  Total AWS certifications: {len([c for c in certs if c.get('vendor') == 'AWS'])}")
