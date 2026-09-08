# Site versions

Every entry here is a git tag. `./version.sh restore <version>` puts
that exact state of the site back. Newest first.

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
