#!/usr/bin/env bash
# Starts all three lab apps on this computer only (127.0.0.1). Ctrl+C stops them all.
set -euo pipefail
OUT="${VIBE_LABS_DIR:-$HOME/vibe-labs}"
[ -d "$OUT/buka-orders" ] || { echo "Run ./setup.sh first."; exit 1; }
trap 'kill 0' EXIT INT TERM
(cd "$OUT/buka-orders" && node server.js) &
(cd "$OUT/ajo-circle" && node server.js) &
(cd "$OUT/clinicslot" && node server.js) &
sleep 1
echo
echo "  Buka Orders  http://localhost:3000"
echo "  Ajo Circle   http://localhost:3001"
echo "  ClinicSlot   http://localhost:3002"
echo "Ctrl+C to stop."
wait
