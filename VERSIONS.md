# Site versions

Every entry here is a git tag. `./version.sh restore <version>` puts
that exact state of the site back. Newest first.

## v1.4.1 — 25 September 2026

MoneyBook page: added 'Why I built this' founder note above the closing call to action.

## v1.4.0 — 25 September 2026

MoneyBook page: 'ten seconds a spend' theme — new hero tagline, 'Two ways to keep the habit' section (instant entry + nightly reminder), removed false FX-conversion claim.

## v1.3.3 — 25 September 2026

MoneyBook gallery: added an 'On a Mac?' note under the screenshots inviting visitors to download the macOS build and look around themselves.

## v1.3.2 — 25 September 2026

MoneyBook gallery: screenshots keep rounded corners with no border, spaced apart again. Stylesheet cache bumped to v14 so Cloudflare stops serving the old bezel styles.

## v1.3.1 — 25 September 2026

MoneyBook gallery: dropped the phone bezel and rounded corners; the screenshots now sit flush, edge to edge, as one continuous screen.

## v1.3.0 — 25 September 2026

MoneyBook page: new 'Have a look around' gallery, a swipeable shelf of ten app screenshots (entries, add entry, category and account pickers, stats, budget, new budget, categories, appearance, settings) with arrow buttons and a counter. Stylesheet cache bumped to v13.

## v1.2.2 — 24 September 2026

MoneyBook 1.4.3: Settings > About now shows 'Made by Venkatesh / www.vnktsh.com' as plain text rather than a link, and the app no longer ships any link-opening code. Downloads, sizes and SHA-256 fingerprints updated.

## v1.2.1 — 24 September 2026

MoneyBook 1.4.2: the app now credits its developer in Settings > About with a link to vnktsh.com, and the macOS bundle carries the same attribution. Download links, sizes and SHA-256 fingerprints updated; the Android signing key is unchanged so 1.4.2 installs over 1.4.1.

## v1.2.0 — 24 September 2026

MoneyBook ships: direct Android APK and macOS DMG downloads served from vnktsh.com, with install steps, SHA-256 checksums and a section explaining why sideloading this is safe. Play Store listing marked coming soon rather than blocking the release.

## v1.1.3 — 8 September 2026

MoneyBook privacy policy: point 'Contact us' at the contact page instead of printing a support email, and take the address out of the public JS comment too.

## v1.1.2 — 8 September 2026

restore: keep version.sh, VERSIONS.md and tools/ at their current state instead of rolling them back with the site, so restoring an old version can never strand the tooling.

## v1.1.1 — 8 September 2026

version.sh: allow non-interactive restore with -y, and fall back to stdin when there is no controlling terminal.

## v1.1.0 — 8 September 2026

Background artwork — a pulli kolam behind every hero, plus leafy vines, a palm frond, kitchen doodles and a code block as faint bottom-layer texture. Adds the ./version.sh snapshot and restore tooling.

## v1.0.0 — 8 September 2026

The hospitality theme — warm kitchen-table design, the manifesto, the 0.00 bill, and the sous-chef note. The site as it stood before any background artwork.
