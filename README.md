# Toro Tribe — ToroTeams

The ToroNet community Work & Funding Engine: bounties, escrow, Integrity, Ambassadors.
Next.js 16 · React 19 · TypeScript · Tailwind CSS 4.

Brand colours: **Dark Green `#1A4314`** and **Golden Brown `#C68642`**.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

## Where things live

```
src/
  app/                 Pages (App Router)
    page.tsx           Home
    bounties/          Task board (search, filters, saved views, watch, bulk select)
    opportunities/ ambassadors/ integrity/ news/ guide/ post/   ← still placeholders, being ported
    layout.tsx         Shell: background, header, footer, drawer/modal, toasts
    globals.css        Tailwind theme tokens (toro-green / toro-gold …)
  styles/toro.css      The prototype's design system, recoloured to the brand
  components/          Header, Footer, BountyCard, Overlays (bounty + wallet drawer, modal), Toasts, …
  lib/
    data.ts            Mock data (projects, bounties, members, courses, news, FAQ)
    store.tsx          App state + actions (claim, deliver, approve, escrow refunds, credit)
    fx.ts              Sounds + coin-burst effect
    types.ts           Shared types
```

## Build plan

1. **Frontend (now)** — port every page from the Qwen prototype. Home and Bounties are done.
2. **Backend** — API + database for users, bounties, claims, reviews, Integrity, ambassadors.
3. **ToroNet** — wallet sign-in, Toro$ balance, escrow lock/release, all behind one service module.

Until step 2, all state is simulated in the browser (localStorage), like the prototype.
To reset the demo, clear the `toro-tribe-v1` key in your browser's localStorage.
