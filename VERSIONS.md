# Site versions

Every entry here is a git tag. `./version.sh restore <version>` puts
that exact state of the site back. Newest first.

## v1.12.2 — 1 October 2026

MoneyBook 1.6.1 for Android, macOS and Windows: a physical keyboard's number pad now types into the amount field.

## v1.12.1 — 1 October 2026

Footer centred: on desktop the links sit exactly under 'Made to be shared, not sold.' (copyright left, Breeze right); on phones and tablets up to 820px the copyright, links and Breeze button stack, each centred. style.css ?v=26.

## v1.12.0 — 1 October 2026

Breeze on/off button in the footer (desktop and phone) stops the leaves, sunlight and crossfade; phones: tap empty space to blow leaves away, flick the page to sway them.

- **Desktop:** a "Breeze: on / off" button in the footer. Off stops the
  leaves (even ones in the air), the sunlight and the page crossfade at
  once, and puts the page back exactly as the plain site. The choice is
  remembered in the visitor's browser (`vnktsh-breeze` in localStorage).
- **Phone:** the leaves now run on touch screens too, with the same look.
  A quick tap on empty background (not a link, button, picture, field or
  words) blows the leaves within ~120px of the finger away; ones a little
  further out shiver. A fast flick of the page makes every third leaf on
  screen lean with it and sway back when it stops. The Breeze button is
  shown on phones as well.
- **Both:** reduced-motion users get none of it and no button.
- Files: `js/main.js` (?v=6), `css/style.css` (?v=25).

## v1.11.0 — 1 October 2026

A soft pool of sunlight follows the mouse on desktop, and pages crossfade into each other with the header held still. Separate from the leaves: restore v1.10.1 to drop just this.

- **Desktop:** a warm light pool (720px, 15% amber at its centre) trails
  the mouse and dims when it leaves the window.
- **Desktop and phone:** moving between pages crossfades in 0.28s with the
  header held still (cross-document view transitions; browsers without
  them just navigate as before).
- Files: `js/main.js` (?v=5), `css/style.css` (?v=24).

## v1.10.1 — 1 October 2026

Leaves now start on every page (Apps and Contact kept them still in v1.10.0).

- **Desktop:** fix - the leaves' first build call was missing, so they
  only started on pages whose height changed as the fonts loaded.
- Files: `js/main.js` (?v=4).

## v1.10.0 — 1 October 2026

Leaves on the background vines blow away from the mouse on desktop and grow back later; phones, reduced-motion and every button unchanged.

- **Desktop:** the vines motif is split in two - stems stay in the CSS
  background, and each of its leaves is redrawn as its own SVG shape in
  exactly the same spot (pixel-checked). Leaves near the cursor rustle;
  ones it touches blow off the screen, tumbling, and grow back after
  18-30s. Every leaf layer ignores the pointer, so no click is blocked.
- **Phone:** unchanged (static vines).
- Files: `js/main.js` now versioned (?v=3), `css/style.css` (?v=23).

## v1.9.4 — 30 September 2026

Download-card buttons (Download now, Open MoneyBook, coming soon) keep their text centred when it wraps on a phone.

## v1.9.3 — 30 September 2026

Accent stripe: a bar of each platform's colour grows across the top of its MoneyBook download card on hover, and stays on the card a hero button jumped to.

## v1.9.2 — 30 September 2026

MoneyBook download cards warm to their platform colour on hover: lift, accent border and glow, filled icon tile, tinted step numbers.

## v1.9.1 — 30 September 2026

Bump stylesheet to ?v=19: Cloudflare cached ?v=18 before the v1.9.0 deploy landed.

## v1.9.0 — 30 September 2026

Platform-coloured MoneyBook buttons that jump to each download card; 'Save as Web App on iPhone'; nav links aligned with Say hello; one de-duplicated feature grid (no bank-statement import); Web page speaks to clients; home page adds websites and a quiet paid-work section.

## v1.8.0 — 30 September 2026

MoneyBook for iPhone is live: an on-device web app at money-book-online.pages.dev with Safari/Chrome install steps; nothing collected on any platform.

## v1.7.1 — 30 September 2026

iPhone card back to 'coming soon' while an on-device iPhone version is built; synced web app and its privacy page taken down.

## v1.7.0 — 30 September 2026

MoneyBook for iPhone: web app at app.vnktsh.com with Safari/Chrome install steps and its own privacy policy; download section is now a four-platform grid.

## v1.6.1 — 30 September 2026

MoneyBook download cards: all store buttons read 'coming soon'; Windows steps no longer list a missing feature.

## v1.6.0 — 30 September 2026

MoneyBook 1.6.0 for Android and macOS, plus the first Windows installer; Apps page card now has one 'Download MoneyBook' button leading to the platform picker.

## v1.5.1 — 27 September 2026

About page: real photos replaced with anime-style illustrations (top portrait plus all three 'Beyond the code' cards) to keep the site's public face private.

## v1.5.0 — 26 September 2026

Web pages: a new Web menu (web.html) setting out the site's web skills, each with a real figure as proof, and a recipe page (web/this-site/) on how vnktsh.com is built, with the changes that were sent back. Web link added to every nav and footer; stylesheet cache bumped to v17.

## v1.4.5 — 26 September 2026

Apps page: MoneyBook card is now clickable through to its features page, matching the home page.

## v1.4.4 — 25 September 2026

Contact page: added a direct mailto link for support@vnktsh.com alongside LinkedIn.

## v1.4.3 — 25 September 2026

Mobile performance: self-hosted fonts (no Google Fonts round-trips) with preload, responsive screenshot sizes, WebP photos and icon, lazy-loaded About photos. No content changes.

## v1.4.2 — 25 September 2026

SEO: robots.txt, sitemap.xml, canonical URLs, Open Graph/Twitter share cards, JSON-LD (WebSite, Person, SoftwareApplication), keyword-bearing MoneyBook title, noindex on 404.

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
