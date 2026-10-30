# Tanu Sharma — Portfolio

React + Vite + Tailwind + GSAP + Three.js frontend, Express + Nodemailer backend (contact form).

## Quick start
```bash
npm install
cp server/.env.example server/.env      # then fill in SMTP values
cp client/.env.example client/.env      # add your EmailJS IDs (see below)
npm run dev                             # client :5173, server :5000
```
Prerequisites: Node 18.18+ (tested on current Node).

## Structure
`client/` (React app: sections, three effects, data files) · `server/` (Express API) · `tests/` (node:test).

## Configure
- **Personal info/links:** `client/src/data/siteConfig.js` (email comes from `VITE_CONTACT_EMAIL`; empty GitHub/LinkedIn show a placeholder).
- **Portrait:** drop `client/public/images/tanu-portrait.jpg` (~900x1200). A placeholder shows until then.
- **Skills / projects:** `client/src/data/skills.js`, `projects.js`. Add `live`/`source` URLs only when real. The first project's `caseStudy` text is placeholder.
- **SMTP:** set `SMTP_HOST/PORT/SECURE/USER/PASS`, `MAIL_FROM` (an address your provider allows), `CONTACT_TO_EMAIL`. Gmail: 2FA + App Password, host `smtp.gmail.com`, port 587, secure false (465 → secure true). Without config `/api/contact` returns 503.
- SMTP acceptance does not guarantee inbox delivery (spam filters, bounces can still happen).

## Scripts
`npm run dev` · `npm run build` (client → `client/dist`) · `npm start` (server) · `npm test`.

## Deploy
Frontend: any static host (Netlify/Vercel/Cloudflare Pages) with `VITE_API_BASE_URL` set to your API URL. Backend: any Node host (Render/Railway/Fly) with the server env vars; set `CLIENT_ORIGIN` to the deployed site URL.

## Motion
The "Motion On/Off" button (and `prefers-reduced-motion`) stops continuous animation, scroll scrubbing and reveals; scenes render a still frame.

## Known limitations
Real SMTP sending, portrait, and project details need your configuration. Not tested in a real browser or on devices yet. The JS bundle is ~740 kB (not code-split).

## EmailJS (contact form)
The form now sends through EmailJS straight from the browser (no server needed).
1. Create a free account at emailjs.com, add an **Email Service** (Gmail) -> copy the *Service ID*.
2. Create an **Email Template** with variables `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`; set *To email* to your own inbox and *Reply-To* to `{{reply_to}}` -> copy the *Template ID*.
3. Account -> *Public Key*.
4. Put them in `client/.env`: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` (also add them in your host's env settings when deploying).
The `server/` folder is no longer used by the site and can be removed.
