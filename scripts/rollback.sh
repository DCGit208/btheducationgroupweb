#!/usr/bin/env bash
# Rollback helper to restore the IT page and data files to a specific snapshot
# Usage: ./scripts/rollback.sh 20251008-164059
set -euo pipefail

STAMP="${1:-}"
if [[ -z "$STAMP" ]]; then
  echo "Usage: $0 <timestamp like 20251008-164059>"
  exit 1
fi

SRC_HTML="./programs/backups/informationtechnology-${STAMP}.html"
SRC_PRICING="./assets/data/backups/pricing-${STAMP}.json"
SRC_CERTS="./assets/data/backups/certifications-${STAMP}.json"

if [[ ! -f "$SRC_HTML" ]]; then echo "Missing backup: $SRC_HTML"; exit 2; fi
if [[ ! -f "$SRC_PRICING" ]]; then echo "Warning: pricing snapshot not found ($SRC_PRICING). Skipping."; SRC_PRICING=""; fi
if [[ ! -f "$SRC_CERTS" ]]; then echo "Warning: certifications snapshot not found ($SRC_CERTS). Skipping."; SRC_CERTS=""; fi

cp "$SRC_HTML" ./programs/informationtechnology.html
if [[ -n "$SRC_PRICING" ]]; then cp "$SRC_PRICING" ./assets/data/pricing.json; fi
if [[ -n "$SRC_CERTS" ]]; then cp "$SRC_CERTS" ./assets/data/certifications.json; fi

echo "Rollback to $STAMP completed."
