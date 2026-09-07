# vnktsh.com — personal portfolio

A static, no-build-step portfolio site (plain HTML/CSS/JS). Pages: Home, Apps, About, Contact.

## The theme — hospitality

Everything on this site is downstream of one idea, set out verbatim in the
manifesto block on `index.html`:

> We have turned creation into transaction. Every tool comes with a
> subscription; every craft comes with a meter. But the best things in life are
> born from a different impulse: hospitality. […] I build these apps open and
> free because the joy of creation lies in the reaction of the guest, not the
> size of the tip.

Practically, that means:

- **The visual language is a warm, sunlit kitchen table** — unbleached paper
  (`--paper`), linen bands (`--linen`), terracotta and amber accents, a fine
  paper grain (`--grain`) over flat colour, and Fraunces (a soft serif) for
  display type instead of a tech-y geometric sans.
- **The price is stated, not buried.** Every app card carries a `.price-line`
  ("Free · No ads · Nothing collected"), and the home page has `.receipt` — a
  bill where every line reads `0.00`, stamped *Paid in full*.
- **Recurring marks**: the steam `.ornament` (three curls rising off something
  warm) divides major sections; `.footer-creed` closes every page with
  "Made to be shared, not sold."
- **Claims stay true.** The apps are free, ad-free, and collect nothing — say
  that freely. The source is *not* public, so never write "open source" or link
  a code repo from a page. "Open" here means openly given, not open-source.
- **`about.html#sous-chef`** is the honest note about AI's role in the build:
  it preps the kitchen, the recipe and the taste are Venkatesh's.

Re-theming is a token edit: every colour, font, radius and shadow lives in
`:root` at the top of `css/style.css`, and the palette there is contrast-checked
(body text and links clear 4.5:1 against `--paper`; the display gradient clears
3:1 on the large headings that use it). If you change a token, keep that true.

## Structure

```
vnktsh-portfolio/
├── index.html      Home
├── apps.html        Apps / projects showcase
├── about.html        About me
├── contact.html       Contact form + socials
├── 404.html            Not-found page
├── css/style.css        All styling (edit colors in :root at the top)
├── js/main.js             Mobile nav, scroll reveal, contact form handling
├── assets/favicon.svg       Site icon
└── apps/                     One folder per app, its own detail page(s)
    ├── _template/               Copy this to scaffold a new app page
    │   └── index.html
    └── money-book/              MoneyBook's detail page (what it does, features)
        └── index.html
```

## Adding a new app

Every app gets two things:

1. **A card** on `apps.html` (and, if it's the currently-featured app, on
   `index.html` too) — duplicate the `<article class="app-card">` block.
2. **Its own detail page** at `apps/<app-slug>/index.html`, linked from that
   card's `app-links` row (see how MoneyBook's card links to
   `apps/money-book/index.html`). This is where "what it does / features"
   content lives — it's a full page, not just a card blurb, so there's room
   to actually explain the app.

To scaffold a new one:

```bash
cp -r apps/_template apps/<app-slug>
```

Then open `apps/<app-slug>/index.html` and fill in every block marked
`EDIT:` (title, pitch, feature cards, status). It already uses the same
nav/footer/hero/card/CTA styling as the rest of the site — no new CSS
needed unless the app genuinely needs a new layout.

No build tools, no framework, no dependencies — just open `index.html` in a browser,
or run a tiny local server so relative paths behave exactly like they will in
production:

```bash
cd vnktsh-portfolio
python3 -m http.server 8000
# then open http://localhost:8000
```

## What to edit before going live

Search each file for `EDIT:` comments — every placeholder is flagged. In short:

1. **`apps.html` + `index.html`** — MoneyBook's pitch and store links go live
   once Play approves the developer account. Duplicate the
   `<article class="app-card">` block to add more apps, and keep the
   `.price-line` on each one.
2. **`about.html`** — bio, the "why I give it all away" cards, the sous-chef
   section, and skills.
3. **`contact.html`** — LinkedIn is the only social link on the site; the
   GitHub link was deliberately removed so the code repos aren't discoverable
   from the public site. Don't re-add it. The support email is also kept off
   the page (out of reach of scrapers/spam) — the contact form is the intended
   way in; see below.
4. **Contact form** — POSTs straight to [Web3Forms](https://web3forms.com),
   which relays submissions server-side to whatever inbox the access key
   below is registered to in your Web3Forms dashboard — that mapping lives
   in your Web3Forms account, not this repo, so change it there if the
   destination ever needs to move. No mailto: involved, so it works for any
   visitor regardless of whether they have a local email client configured.
   The access key lives in a hidden
   `access_key` input in the `<form id="contact-form">` in `contact.html`
   (Web3Forms access keys are meant to be public/client-side, so this is
   safe to commit). To rotate the key or point it at a different inbox,
   generate a new one at web3forms.com and swap the `value`. A hidden
   `botcheck` checkbox (`.hidden-field` in `css/style.css`) is Web3Forms'
   honeypot spam trap — leave it in the form.
5. **Favicon/logo** — `assets/favicon.svg` is a simple gradient "v" monogram.
   Replace it with your own mark if you have one.
6. **If MoneyBook collects personal data**, most app stores require a privacy
   policy link somewhere reachable from your site — worth adding a
   `privacy.html` page and linking it from the footer before submitting/updating
   store listings.

## Deploying with vnktsh.com (Hostinger domain, hosted elsewhere)

You said you'll host on a platform like Vercel/Netlify/GitHub Pages and point
Hostinger's DNS at it — that's the easiest path for a static site (auto SSL,
git-based deploys, generous free tier). Two good options:

### Option A — Vercel (recommended, simplest)

1. Push this folder to a GitHub repo (see git steps below).
2. Go to [vercel.com](https://vercel.com) → New Project → import that repo.
   Framework preset: "Other" (no build command needed).
3. Once deployed, go to Project → Settings → Domains → add `vnktsh.com` and
   `www.vnktsh.com`.
4. Vercel will show you the DNS records to add. In **Hostinger → hPanel → DNS
   Zone Editor** for vnktsh.com, add:
   - `A` record, host `@`, value → the IP Vercel gives you (usually `76.76.21.21`)
   - `CNAME` record, host `www`, value → `cname.vercel-dns.com`
5. Wait for DNS to propagate (usually minutes, can be up to a day). Vercel
   auto-issues an SSL certificate once it verifies the domain.

### Option B — GitHub Pages

1. Push this folder to a GitHub repo, e.g. `vnktsh-portfolio`.
2. Repo → Settings → Pages → Source: deploy from the `main` branch, root folder.
3. Add a file named `CNAME` (no extension) at the repo root containing just:
   ```
   vnktsh.com
   ```
4. In **Hostinger → hPanel → DNS Zone Editor**, add:
   - Four `A` records, host `@`, values → GitHub Pages' IPs:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record, host `www`, value → `your-username.github.io`
5. Back in repo Settings → Pages, enter `vnktsh.com` as the custom domain and
   enable "Enforce HTTPS" once it's available (can take a bit after DNS propagates).

### Pushing this folder to GitHub (either option needs this first)

```bash
cd "vnktsh-portfolio"
git init
git add -A
git commit -m "Initial portfolio site"
gh repo create vnktsh-portfolio --public --source=. --remote=origin --push
# (or create the repo on github.com and `git remote add origin <url>` + `git push -u origin main`)
```

### Alternative — Hostinger's own hosting

If you'd rather keep everything on Hostinger's shared hosting instead: hPanel →
File Manager → `public_html/` → upload every file in this folder (keeping the
`css/`, `js/`, `assets/` subfolders intact), or connect via FTP with the
credentials from hPanel → Files → FTP Accounts. No DNS changes needed since the
domain already points at Hostinger. SSL: hPanel → SSL → enable the free
Let's Encrypt certificate.

## Notes / limitations

- This is a fully static site — no server, no database. The contact form relies
  on Formspree (or swap in any similar service: Web3Forms, Getform, etc.).
- No analytics wired up. If you want visit stats, the easiest static-friendly
  options are Vercel Analytics (if you deploy there), Plausible, or Google
  Analytics (paste their snippet before `</head>` on each page).
- Images: there are no real screenshots yet — app cards use CSS gradient +
  emoji placeholders on purpose so it never looks broken. Swap in real
  screenshots by adding an `<img>` inside `.app-card-media`.
