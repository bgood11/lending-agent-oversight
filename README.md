# Lending Agent Oversight

An operating system for principal firms supervising Appointed Representatives. Composite risk scoring, breach workflow with FCA notification countdowns, file reviews scored against the right regulatory rubric (MCOB, ICOBS, CONC, IAR), AR-side MI return submission, annual fitness review packets, AR/IAR appointment flow with Companies House / CreditSafe / FCA Register enrichment, and per-tenant configuration of rubric, oversight calendar, and connectors.

> Concept demo. No backend, no real authentication, no real email. Hardcoded fixtures drive a fully scripted walkthrough plus a free-explore mode. Engineering-spec docs cover the production build path.

Live: <https://lending-agent-oversight.vercel.app>.

---

## What it is

Three principal-firm skins, two persona views, one supervision loop.

### Marketing

- **Marketing landing** (`/`): hero with embedded interactive preview, three-step how-it-works, editorial features grid (lead 2x2 + supporting 1x1), vs-other-tools comparison, audience cards, FAQ, FCA-style footer.

### Principal-compliance surface

- **Compliance home** (`/demo/principal`): editorial composition with one headline KPI (critical-band ARs at Fraunces 7-8xl, with risk-band distribution bar), three supporting KPIs, top-10 highest-risk ARs, breach activity heatmap, next-actions widget.
- **AR register** (`/demo/principal/register`): filterable list of every AR, row tinting by status (brand-coloured rail for pending-appointment, destructive for under-investigation), bulk-action bar with Schedule review / Send reminder / Export CSV, sales-friendly empty states.
- **Appoint a new AR or IAR** (`/demo/principal/register/new`): four-stage wizard with Companies House / CreditSafe / FCA Register enrichment that staggers in over ~1.8s, SUP 12.4 due-diligence checklist, scope selector keyed to the skin's rubric (or fixed IAR scope), PS22/11 thirty-day notification clock. Sticky live-contract preview rail builds as you fill in fields.
- **AR detail** (`/demo/principal/register/[arId]`): three-zone header (identity card with brand-tinted wash, risk gauge with 14-day delta tick, next-30-days timeline), tabs for breaches / file reviews / MI returns / conduct events, right-rail Manage menu with SUP 12.8 suspend / terminate flow.
- **Breach triage and detail** (`/demo/principal/breaches`): SUP 15 notification countdowns, root-cause taxonomy, FCA notification recording, four-step next-actions rail.
- **File review workspace** (`/demo/principal/reviews`): per-skin regulatory rubric (MCOB / ICOBS / CONC) for AR appointments, narrowed IAR rubric (introducer scope) for IAR appointments, scoring, root-cause aggregation.
- **Annual fitness review packet** (`/demo/principal/annual-reviews/[arId]`): aggregated picture for SUP 12.6A annual review with magazine-style section headers (Fraunces section numbers, hairline rules), director sign-off, browser-driven PDF export.
- **Settings** (`/demo/principal/settings`): three editorial tabs.
  - **Oversight calendar**: 14 canonical supervisory tasks tied to PS22/11, SUP 12.6A, SUP 15, DISP 1, Consumer Duty, FG21/1, SYSC 15A. Per-tenant frequency overrides and disable.
  - **Rubric editor**: toggle canonical items inapplicable, add tenant-specific custom items per section. AR vertical rubric (MCOB / ICOBS / CONC) and IAR rubric in separate tabs.
  - **Connectors and enrichments**: MI ingestion (CRM webhook, lender portal, complaints system, CSV upload) and enrichment APIs (Companies House, CreditSafe, FCA Register), each with cadence, last sync, AR coverage, and the fields auto-populated.

### AR self-service surface

- **AR home** (`/demo/ar`): required actions, performance summary, recent comms from the principal.
- **MI return submission** (`/demo/ar/mi`): quarterly returns form, draft saving, submit confirmation that surfaces on the principal-side AR detail.
- **File a breach** (`/demo/ar/breaches/new`): AR-side breach reporting with severity self-assessment that fires the SUP 15 timing clock visible in the principal triage queue.
- **AR profile** (`/demo/ar/profile`): three-zone header mirror of the principal-side AR detail, AR-side flavoured, with a Supervisor card explaining the FSMA s.39 regulatory relationship.

### Three skins

| Skin | Vertical | Rubric | Brand colour |
|---|---|---|---|
| Heritage Mortgage Network | Residential mortgage broking | MCOB | Indigo |
| Crown GI Collective | General insurance broking | ICOBS | Emerald |
| Pinpoint Credit Network | Consumer credit broking | CONC | Plum |

Skins switch the brand colour, FCA register number, AR fixture set, and file-review rubric. Per-skin brand colour drives a 2px chrome rail, the active state of the principal nav, and editorial accents across the home and AR detail.

## Family

- [bgood11/lending-agent](https://github.com/bgood11/lending-agent): the AI-mediated waterfall broker, live at <https://lending-agent.vercel.app>.
- [bgood11/lending-agent-presenter](https://github.com/bgood11/lending-agent-presenter): the menu-style finance presentment demo, live at <https://lending-agent-presenter.vercel.app>.
- **lending-agent-oversight** (this repo): the AR/IAR network supervision tool.

## Tech stack

- Next.js 16 App Router + TypeScript (strict)
- Tailwind CSS v4 with `@theme` design tokens, OKLCH severity ramp
- shadcn/ui (Nova preset on Base UI) + Lucide icons
- motion (framer-motion successor) for transitions
- Zustand with persist for the demo state machine
- Geist + Geist Mono + Fraunces (display) via `next/font/google`

## Run locally

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Documentation

- **[Engineering-spec docs site](https://lending-agent-oversight-docs.vercel.app)**: full implementation, architecture, safety, privacy, and regulatory guidance ([source](https://github.com/bgood11/lending-agent-oversight-docs)).
- In-repo `docs/PLAN.md` for the original build plan.

## Status

All surfaces shipped. 23 routes generated, 16 prerendered. Scripted walkthrough crosses the persona boundary mid-tour. Type-safe end-to-end (`npx tsc --noEmit` clean). Vercel auto-deploys on push to `main`.

---

Built by [Barney Goodman](https://github.com/bgood11).
