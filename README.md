# vnktsh.com — personal portfolio

A static, no-build-step portfolio site (plain HTML/CSS/JS). Pages: Home, Apps, About, Contact.

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
└── assets/favicon.svg       Site icon
```

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

1. **`apps.html` + `index.html`** — MoneyBook's real pitch/description, tech tags,
   and links (App Store / Play Store / website). Replace or remove the two
   placeholder app cards, or duplicate the `<article class="app-card">` block
   to add more apps.
2. **`about.html`** — your real bio, skills, and timeline. Swap the `V` avatar
   div for a real `<img>` photo if you want one.
3. **`contact.html`** — real GitHub / LinkedIn / X links (currently `#`).
   Your email is already filled in from what I have on file — double check it's
   the one you want public.
4. **Contact form** — currently points at a placeholder Formspree URL
   (`YOUR_FORM_ID`) and will show a friendly "not connected yet" message until
   you fix that. Two-minute setup:
   - Go to [formspree.io](https://formspree.io), sign up free, create a new form.
   - Copy the endpoint it gives you (`https://formspree.io/f/xxxxxxx`).
   - Paste it into the `action="..."` attribute of the `<form id="contact-form">`
     in `contact.html`.
   - Formspree's free tier is plenty for a personal site (50 submissions/month).
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
