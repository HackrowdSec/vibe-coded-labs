#!/usr/bin/env bash
# Builds fresh, runnable copies of the three lab apps in ~/vibe-labs, each with its own git history.
# Safe to run any number of times: it wipes ~/vibe-labs and starts again. Needs Node.js 22+ and git.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="${VIBE_LABS_DIR:-$HOME/vibe-labs}"
command -v node >/dev/null || { echo "Node.js is not installed (need 22 or newer)."; exit 1; }
command -v git >/dev/null || { echo "git is not installed."; exit 1; }
[ "$(node -p 'process.versions.node.split(".")[0]')" -ge 22 ] || { echo "Node.js 22 or newer is needed (found $(node --version))."; exit 1; }
commit() { git add -A && git -c user.name="Lab" -c user.email="lab@sample.test" commit -q -m "$1"; }
rm -rf "$OUT" && mkdir -p "$OUT"

# Buka Orders: main has sign-in and "my orders"; branch feat/orders adds an AI-generated feature.
# A local bare repo stands in for GitHub, so tools that diff against origin (like /security-review) work offline.
cp -R "$HERE/apps/buka-orders" "$OUT/buka-orders" && cd "$OUT/buka-orders"
git init -q -b main && printf "node_modules\n.env*\n" > .gitignore && commit "Buka Orders: sign-in and my orders list"
git init -q --bare "$OUT/.buka-orders-origin.git" && git remote add origin "$OUT/.buka-orders-origin.git"
git push -q origin main && git remote set-head origin main
git checkout -q -b feat/orders && cp "$HERE/setup/buka-orders-feature/routes/orders.js" routes/orders.js
commit "Add order detail page and admin refunds (AI-generated)"

# Ajo Circle
cp -R "$HERE/apps/ajo-circle" "$OUT/ajo-circle" && cd "$OUT/ajo-circle"
git init -q -b main && printf "node_modules\n.env*\n" > .gitignore && commit "Ajo Circle: circles, contributions, payouts"

# ClinicSlot: its git history matters too.
cp -R "$HERE/apps/clinicslot" "$OUT/clinicslot" && cd "$OUT/clinicslot"
git init -q -b main && cp "$HERE/setup/clinicslot-history.env" .env && printf "node_modules\n" > .gitignore
commit "ClinicSlot: booking form, staff view, data API"
git rm -q --cached .env && rm .env && printf "node_modules\n.env*\n" > .gitignore && commit "Remove .env to fix deploy"

echo "Ready in $OUT. Next: ./start.sh"
