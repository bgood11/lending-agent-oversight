# Lending Agent Oversight

An operating system for principal firms supervising Appointed Representatives. Composite risk scoring, breach workflow with FCA notification countdowns, file reviews scored against the right regulatory rubric (MCOB, ICOBS, CONC), AR-side MI return submission, annual fitness review packets.

> Concept demo. No backend, no real authentication, no real email. Hardcoded fixtures drive a fully scripted walkthrough plus a free-explore mode. Engineering-spec docs cover the production build path.

---

## What it is

Three principal-firm skins, two persona views, one supervision loop.

- **Marketing landing**: hero, how-it-works (three-step), features, vs-other-tools comparison, audience cards, FAQ, FCA-style footer.
- **Principal home** (`/demo/principal`): composite risk dashboard with KPI tiles, top-10 highest-risk ARs, breach activity heatmap, next-actions widget.
- **AR register and detail** (`/demo/principal/register`): filterable list of every AR with risk score, drill-in to a single AR's full picture (risk gauge, breach history, file reviews, MI returns, conduct events).
- **Breach triage and detail** (`/demo/principal/breaches`): SUP 15 notification countdowns, root-cause taxonomy, FCA notification recording.
- **File review workspace** (`/demo/principal/reviews`): per-skin regulatory rubric (MCOB / ICOBS / CONC), scoring, root-cause aggregation.
- **Annual fitness review packet** (`/demo/principal/annual-reviews/[arId]`): aggregated picture for SUP 12.6A annual review with director sign-off.
- **AR home and self-service** (`/demo/ar`): the AR's own surface, with required actions, MI return submission, and breach reporting.

Three principal-firm skins switch the brand colour, FCA register number, AR fixtures, and file-review rubric: **Heritage Mortgage Network** (mortgage broking, MCOB), **Crown GI Collective** (general insurance, ICOBS), **Pinpoint Credit Network** (consumer credit, CONC).

## Family

- [bgood11/lending-agent](https://github.com/bgood11/lending-agent): the AI-mediated waterfall broker, live at <https://lending-agent.vercel.app>.
- [bgood11/lending-agent-presenter](https://github.com/bgood11/lending-agent-presenter): the menu-style finance presentment demo, live at <https://lending-agent-presenter.vercel.app>.
- **lending-agent-oversight** (this repo): the AR/IAR network supervision tool.

## Tech stack

- Next.js 16 App Router + TypeScript
- Tailwind CSS v4 with `@theme` design tokens
- shadcn/ui (Nova preset) + Lucide icons
- motion (framer-motion successor) for transitions
- Zustand for demo state machine
- Geist + Geist Mono + Fraunces (display) via `next/font/google`

## Run locally

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Documentation

- **[Engineering-spec docs site](https://lending-agent-oversight-docs.vercel.app)**: full implementation, architecture, safety, privacy, and regulatory guidance ([source](https://github.com/bgood11/lending-agent-oversight-docs)).
- In-repo `docs/` folder for engineering-anchor markdown.

## Status

Scaffolding complete (visual identity tokens, three skin definitions, types, state machine, walkthrough overlay). Surface implementation in progress. Follow the build at the repo's commit history.

---

Built by [Barney Goodman](https://github.com/bgood11).
