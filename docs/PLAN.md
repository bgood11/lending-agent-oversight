# Build plan

Sequencing for taking the demo and docs from scaffolded to portfolio-ready.

The full multi-thousand-line plan with regulatory deep-dive, engineering deep-dive, UX deep-dive, and 28 consolidated open questions lives at `~/.claude/plans/users-barneygoodman-downloads-ecof-docx-tidy-glacier.md`. This file is the executive summary plus build sequence.

1. **Bootstrap both repos.** Next.js 16, Tailwind v4, shadcn/ui (Nova preset), motion, lucide-react, Geist + Fraunces fonts. Astro Starlight with amber/slate theme and Mermaid pipeline. *Done.*

2. **Lock the visual identity layer.** Tailwind tokens (amber/slate over Nova), per-skin `--brand-primary` for Heritage indigo / Crown emerald / Pinpoint plum, dark-mode parity (with Crown lifted to AAA in dark), severity colour scale, types, state machine, walkthrough overlay/advancer. *Done.*

3. **Build the principal-compliance home and AR register surfaces.** KPI tiles (4-up), top-10 risk table, breach activity heatmap, next-actions widget. AR register filterable table with risk-score gauge chips. Demo fixtures with ~150 ARs across the three skins. Ship to Vercel preview.

4. **Build the AR detail page** with semicircular risk gauge, tabs (Overview, Breach history, File reviews, MI returns, Conduct events, Documents, Notes), risk trajectory sparkline. Ship.

5. **Build the breach triage queue and breach detail surface** with the SUP 15 notification countdown widget (3-node track: Received, Must notify by, Notified). Ship.

6. **Build the file review workspace** with per-skin rubric (MCOB / ICOBS / CONC). Ship.

7. **Build the AR-side surfaces**: home with required actions, MI return submission (3-step), breach report form, profile. The persona-switch demo moment (modal, chrome cross-fade, URL change) hooks in here. Ship.

8. **Build the annual fitness review packet.** Long-scrolling document with anchor rail, director sign-off panel. Ship.

9. **Build the marketing landing.** Hero with HeroPreview, three-step how-it-works with custom illustrations (network of nodes, shield, register-of-records), six-tile features grid, vs-other-tools comparison, audience cards, 7-item FAQ, FCA-style footer. Ship.

10. **Wire the scripted walkthrough across the persona boundary.** 10 steps with the persona-switch confirmation modal at step 4. Free-explore toggle. Skin switcher. Ship.

11. **Write the engineering-spec docs site, section by section** in the order Introduction → Product → Architecture (incl. risk-scoring) → Reference → Regulatory → Implementation → Safety → Privacy → Deploy. Source content from the appendices in the master plan file.

12. **Cross-link, polish, Lighthouse, screenshot capture.** Push final to Vercel production. Add the case study to barneygoodmansite.

Each step ships independently to Vercel.

## Locked decisions

| Decision | Choice |
|---|---|
| Repo name | `lending-agent-oversight` |
| Docs repo | `lending-agent-oversight-docs` |
| Brand family | Lending Agent family, sub-brand "Lending Agent Oversight" |
| Conceptual model | AR/IAR oversight operating system |
| Demo realism | Fully scripted, no backend |
| Persona surfaces | principal-admin (chrome only), principal-compliance-officer, ar-user |
| Tenant skins | Heritage Mortgage Network (MCOB), Crown GI Collective (ICOBS), Pinpoint Credit Network (CONC) |
| Stack | Next.js 16 + Tailwind v4 + shadcn/ui Nova + motion + Geist + Fraunces |
| Marketing landing | Maximal |
| Doc sections | Full mirror of lending-agent-presenter-docs structure, adapted for AR oversight |
| Build-spec depth | Engineering-spec |
| Regulatory baseline | FSMA s.39, SUP 12, SUP 12.6A (PS22/11), SUP 15, SYSC 9, SYSC 15A, DISP 1, PRIN 2A, FG21/1 |
