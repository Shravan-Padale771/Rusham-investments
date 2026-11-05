# Rusham Investment — Premium Financial Advisory Website

Multi-page Next.js (App Router) website for **Rusham Investment** — <https://rushaminvestment.in>.

Pages: `/` Home · `/about` · `/services` · `/contact`, plus `/privacy-policy`, `/terms-and-conditions` and `/disclaimer` (general drafts — have them reviewed by counsel).
`/insights` is intentionally **not** created or linked until real content exists.

## Stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · Framer Motion · GSAP + ScrollTrigger · Lenis · Lucide · Nodemailer · Zod · Drizzle ORM (PostgreSQL / Supabase-ready).

## Getting started

```bash
npm install
cp .env.example .env.local     # fill in SMTP values (see below)
npm run dev                    # http://localhost:3000
npm run build && npm run start # production
```

Optional (store enquiries in PostgreSQL): set `DATABASE_URL`, then `npx drizzle-kit push`.
The `enquiries` table is defined in `src/db/schema.ts`. Storage is best-effort: if the database is not configured the API relies on email only.

## Project structure

```
src/
  app/            routes, metadata, sitemap, robots, /api/contact
  components/     layout/ home/ about/ services/ contact/ ui/
  config/         theme.ts · site.ts · navigation.ts · services.ts · about.ts · approach.ts
  hooks/          useLenis.ts · useReducedMotion.ts
  lib/            email.ts · validation.ts · rate-limit.ts · enquiries.ts · fonts.ts · metadata.ts
  db/             Drizzle client + schema
public/videos/    coins.mp4 (original) · coins-optimized.mp4 (1080p) · coins-mobile.mp4 (720p)
public/images/    hero-poster.webp · about-*.jpg
```

## Theme customisation (one file)

All colours, font names and layout sizes live in **`src/config/theme.ts`**.

* `palette` holds the raw hex values — change a brand colour here and the entire site follows.
* `semantic` maps roles (`background`, `foreground`, `accent`, `muted`, …) to palette keys.
* `ThemeStyle` turns the config into CSS variables (`--theme-*`) at render time; `globals.css` exposes them as
  `--color-*` and Tailwind utilities (`bg-background`, `text-foreground`, `bg-accent`, `bg-dark`, …).
* No gradients are used anywhere, and components never contain hard-coded brand hex values.

Fonts (DM Serif Display, Manrope, DM Sans) are loaded with `next/font` in `src/lib/fonts.ts`.

## Editing business content (nothing is invented)

* `src/config/site.ts` — email, phone, address, working hours, social links, regulatory disclosures.
  Empty values are hidden automatically. Add registration numbers (AMFI ARN, SEBI, etc.) **only after verification**.
* `src/config/about.ts` — story, mission, vision, values. The story is philosophy only; replace with your real history when available.
* `src/config/services.ts` — the six services and their feature lists.
* The site deliberately contains no testimonials, client counts, awards, returns or certifications. The home page uses an honest FAQ instead.

## Contact form & email (SMTP)

`POST /api/contact` (`src/app/api/contact/route.ts`, Node runtime):

1. same-origin check and payload-size limit
2. rate limiting (5 requests / 15 min / IP)
3. honeypot field + minimum-fill-time check
4. server-side Zod validation and sanitisation (`src/lib/validation.ts`)
5. business notification email — subject **"New Website Enquiry — Rusham Investment"**, `Reply-To` = visitor
6. customer acknowledgement — subject **"Thank You for Contacting Rusham Investment"**
7. safe, generic error responses; failures are logged without secrets or message content

The enquiry is reported as received only if the notification email was sent **or** the enquiry was stored in the database.
Nothing here has been tested against real SMTP credentials — configure them and send a test enquiry before launch.

### Option A — Gmail / Google Workspace (default)

1. Turn on **2-Step Verification** for the Google account.
2. Create an **App Password** at <https://myaccount.google.com/apppasswords> (never use the normal password).
3. Set in `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-google-app-password
CONTACT_RECEIVER=your-business-email@gmail.com
CONTACT_FROM=your-email@gmail.com
```

Gmail SMTP only authenticates a Gmail / eligible Google Workspace mailbox. It cannot send as a Hostinger-hosted mailbox.

### Option B — Hostinger business mailbox

If `hello@rushaminvestment.in` is hosted on Hostinger, use Hostinger's SMTP instead (confirm the exact host/port in
hPanel → Emails → *Configure email app*; typically `smtp.hostinger.com`, port `465`, SSL):

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=hello@rushaminvestment.in
SMTP_PASS=the-mailbox-password
CONTACT_RECEIVER=hello@rushaminvestment.in
CONTACT_FROM=hello@rushaminvestment.in
```

Keep `CONTACT_FROM` equal to the authenticated mailbox. The visitor's address is always used as `Reply-To`, never as `From`.
Add SPF/DKIM records for the domain for best deliverability.

### Production rate limiting

The default limiter is in-memory (fine for one server). On Vercel/serverless each instance has its own memory, so set
`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` — the limiter switches to Upstash Redis automatically (REST, no extra package).

## Video, scroll experience & performance

The falling-coins visual is used twice (hero + signature scroll sequence) but **never decoded twice at once** — each instance
attaches its source only when near the viewport and pauses when off-screen. The browser cache serves the second request.

* **Placeholder asset:** `public/videos/coins.mp4` is a stock Pexels clip (1920×1080, 24 fps, H.264, ~2.8 Mbps, 5 s, 1.7 MB)
  used until you drop in your own file. Replace `coins.mp4`, then re-run the encodes below.
* **Optimised for web** (FFmpeg): source is natively 24 fps, so fps is kept (converting to 30 fps would duplicate frames unevenly and cause judder). Keyframe every second for smooth looping.

```bash
# desktop – 1080p
ffmpeg -i public/videos/coins.mp4 -vf "scale=1920:-2:flags=lanczos,format=yuv420p" -r 24 \
  -c:v libx264 -preset medium -crf 23 -g 24 -movflags +faststart -an public/videos/coins-optimized.mp4
# mobile – 720p
ffmpeg -i public/videos/coins.mp4 -vf "scale=1280:-2:flags=lanczos,format=yuv420p" -r 24 \
  -c:v libx264 -preset medium -crf 26 -g 24 -movflags +faststart -an public/videos/coins-mobile.mp4
# poster
ffmpeg -ss 1.5 -i public/videos/coins.mp4 -frames:v 1 -vf scale=1600:-2 -c:v libwebp -quality 80 public/images/hero-poster.webp
```

If your video has a different frame rate, change `-r`. Do not upscale low-resolution footage. Filenames are referenced in `src/config/site.ts`.

**How the zoom stays smooth** (`src/components/home/CinematicStory.tsx`):

* one fixed 16:9 wrapper, `object-fit: contain`, the same `<video>` for the whole sequence;
* only the *wrapper's* `transform` (scale ≈ 1 → 1.2) and `opacity` are animated — never width/height, filters, shadows or blend modes;
* `will-change` is applied only while the pin is active; no React state changes during scroll;
* a single ScrollTrigger timeline (pin + scrub 0.4) drives the zoom and a 3-panel horizontal track (≈ 2 viewport-heights of extra scroll);
* GSAP is driven by one ticker shared with Lenis (single smooth-scroll instance); everything is reverted on unmount via `gsap.matchMedia`.

**Mobile / tablet (< 1024 px):** no pinning; video plus vertically stacked panels with a gentle scale-in.
**Reduced motion:** no pinning, no Lenis, no reveals, poster instead of autoplay — all content stays visible. Lenis is also disabled on touch devices.

Pre-launch performance checklist (cannot be automated here): test on a real mid-range phone and a desktop browser, watch the
Performance panel while scrolling the story section, and run Lighthouse on the deployed URL.

## SEO

Per-page title/description, canonical URLs, Open Graph + Twitter cards, `sitemap.xml`, `robots.txt`, semantic headings,
Organization JSON-LD (verified fields only) and an ItemList for services. No fabricated ratings, registrations or awards.

## Deploying to Vercel & domain

1. Push to GitHub (`.env*` files are git-ignored except `.env.example`) and import the repo in Vercel.
2. Add the environment variables from `.env.example` under *Project → Settings → Environment Variables* (SMTP_*, CONTACT_*, optional UPSTASH_*, optional DATABASE_URL).
3. Deploy. Add `rushaminvestment.in` (and `www`) in *Settings → Domains* and create the DNS records Vercel shows (A record `76.76.21.21` for the apex or a CNAME for `www`, as instructed by Vercel at the time).
4. Set `www` → apex (or the reverse) redirect, then send a real test enquiry from the live site.

## Testing checklist

- [ ] `npm run build` passes; `npx tsc --noEmit` and `npm run lint` are clean
- [ ] All four main routes + legal pages load; mobile menu opens/closes and closes after navigation
- [ ] Contact form: invalid input shows field errors; server rejects invalid payloads (HTTP 422); honeypot ignored silently
- [ ] Real SMTP test: notification and acknowledgement both arrive; `Reply-To` is the visitor
- [ ] Story section on desktop (1280/1440/1920), tablet and phone; browser resize; back/forward navigation
- [ ] OS "reduce motion" enabled → static presentation, all content visible
- [ ] Network tab: only one video file requested per viewport size
