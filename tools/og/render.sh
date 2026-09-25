#!/usr/bin/env bash
# Renders tools/og/card.html to the 1200x630 og:image PNGs with headless Chrome.
set -euo pipefail
cd "$(dirname "$0")/../.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p assets/images/og
for card in site moneybook; do
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=1200,630 --virtual-time-budget=4000 \
    --screenshot="$PWD/assets/images/og/og-$card.png" \
    "file://$PWD/tools/og/card.html?card=$card" 2>/dev/null
  echo "wrote assets/images/og/og-$card.png"
done
# Link previews don't need PNG; JPEG keeps each card well under 100 KB.
for card in site moneybook; do
  sips -s format jpeg -s formatOptions 88 "assets/images/og/og-$card.png" --out "assets/images/og/og-$card.jpg" >/dev/null
  rm "assets/images/og/og-$card.png"
done
