#!/usr/bin/env python3
"""
Merge all vendor certifications (ASE, Tesla, BMW, Ford, Bosch, etc.) into a single multi-vendor automotive certification file.
- Preserves all original vendor certifications
- Adds full ASE stack (no duplicates)
- Output: automotive-certifications-merged.json
"""
import json
from pathlib import Path

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(data, path):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def main():
    base = Path('assets/data')
    orig = load_json(base / 'automotive-certifications.json')
    ase = load_json(base / 'ase-all-certifications.json')
    # Use (vendor, exam) as unique key
    seen = set((c['vendor'], c.get('exam','')) for c in orig)
    merged = list(orig)
    added = 0
    for cert in ase:
        key = (cert['vendor'], cert.get('exam',''))
        if key not in seen:
            merged.append(cert)
            seen.add(key)
            added += 1
    save_json(merged, base / 'automotive-certifications-merged.json')
    print(f"✅ Merged {added} new ASE certifications. Total: {len(merged)}.")

if __name__ == '__main__':
    main()
