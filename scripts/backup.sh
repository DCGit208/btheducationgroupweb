#!/usr/bin/env bash
# Automated snapshot backup for Information Technology page and related data
# Usage: ./scripts/backup.sh
set -euo pipefail

STAMP="$(date '+%Y%m%d-%H%M%S')"
TS_HR="$(date '+%Y-%m-%d %H:%M:%S')"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

IT_HTML="$ROOT_DIR/programs/informationtechnology.html"
PRICING_JSON="$ROOT_DIR/assets/data/pricing.json"
CERTS_JSON="$ROOT_DIR/assets/data/certifications.json"

BK_DIR_PAGES="$ROOT_DIR/programs/backups"
BK_DIR_DATA="$ROOT_DIR/assets/data/backups"
LOG_FILE="$ROOT_DIR/ROLLBACK_LOG.txt"

mkdir -p "$BK_DIR_PAGES" "$BK_DIR_DATA"

# Required file check
if [[ ! -f "$IT_HTML" ]]; then
  echo "ERROR: Not found: $IT_HTML" >&2
  exit 2
fi

# Copy files with timestamped names
BK_HTML="$BK_DIR_PAGES/informationtechnology-${STAMP}.html"
cp "$IT_HTML" "$BK_HTML"

BK_PRICING=""
if [[ -f "$PRICING_JSON" ]]; then
  BK_PRICING="$BK_DIR_DATA/pricing-${STAMP}.json"
  cp "$PRICING_JSON" "$BK_PRICING"
fi

BK_CERTS=""
if [[ -f "$CERTS_JSON" ]]; then
  BK_CERTS="$BK_DIR_DATA/certifications-${STAMP}.json"
  cp "$CERTS_JSON" "$BK_CERTS"
fi

# Helper functions (macOS compatible)
sha256_of() {
  shasum -a 256 "$1" | awk '{print $1}'
}
size_of() {
  stat -f%z "$1"
}

# Build manifest JSON
MANIFEST="$BK_DIR_PAGES/manifest-${STAMP}.json"
{
  echo '{'
  echo "  \"timestamp\": \"$TS_HR\"," 
  echo "  \"tag\": \"informationtechnology-${STAMP}\"," 
  echo '  "files": ['
  echo '    {'
  echo "      \"path\": \"programs/backups/$(basename "$BK_HTML")\"," 
  echo "      \"size\": $(size_of "$BK_HTML"),"
  echo "      \"sha256\": \"$(sha256_of "$BK_HTML")\""
  echo '    }'
  if [[ -n "$BK_PRICING" ]]; then
    echo '    ,{'
    echo "      \"path\": \"assets/data/backups/$(basename "$BK_PRICING")\"," 
    echo "      \"size\": $(size_of "$BK_PRICING"),"
    echo "      \"sha256\": \"$(sha256_of "$BK_PRICING")\""
    echo '    }'
  fi
  if [[ -n "$BK_CERTS" ]]; then
    echo '    ,{'
    echo "      \"path\": \"assets/data/backups/$(basename "$BK_CERTS")\"," 
    echo "      \"size\": $(size_of "$BK_CERTS"),"
    echo "      \"sha256\": \"$(sha256_of "$BK_CERTS")\""
    echo '    }'
  fi
  echo '  ]'
  echo '}'
} > "$MANIFEST"

# Append log entries
{
  echo "| $TS_HR | BACKUP | informationtechnology-${STAMP} | Reason: Pre-change snapshot | ✅ COMPLETED |"
  if [[ -n "$BK_PRICING" ]]; then
    echo "| $TS_HR | BACKUP | pricing-${STAMP} | Reason: Snapshot alongside IT page backup | ✅ COMPLETED |"
  fi
  if [[ -n "$BK_CERTS" ]]; then
    echo "| $TS_HR | BACKUP | certifications-${STAMP} | Reason: Snapshot alongside IT page backup | ✅ COMPLETED |"
  fi
  echo "| $TS_HR | IMPLEMENTATION | manifest-${STAMP} | Reason: Wrote auditable manifest for snapshot (sizes + checksums) | ✅ COMPLETED |"
} >> "$LOG_FILE"

echo "Snapshot complete: informationtechnology-${STAMP}"
echo "Manifest: $MANIFEST"
