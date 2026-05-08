/**
 * Scripted walkthrough definition. Ten steps spanning principal-side
 * and AR-side surfaces, with a persona-switch in the middle (step 4
 * triggers the principal-to-AR transition; step 7 ends the AR
 * sequence and step 8 lands back on the principal side).
 *
 * Auto-advance is handled by walkthrough-advancer.tsx, which watches
 * the path and bumps the step floor when the visitor lands on a new
 * surface.
 */

export interface WalkthroughStep {
  surface: string;
  title: string;
  body: string;
  cta: string;
  /** Optional CSS selector the overlay pulses to draw the eye. */
  targetSelector?: string;
  /** Optional anchor override. Defaults to bottom-right on desktop. */
  anchor?: "br" | "tr";
}

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    surface: "/",
    title: "Welcome to Oversight",
    body: "Three principal-firm skins, two persona views, one scripted tour. Click 'See it in action' to land on the compliance officer's home.",
    cta: "Open the principal home",
  },
  {
    surface: "/demo/principal",
    title: "Read the network at a glance",
    body: "Composite risk scores, breaches awaiting FCA notification, overdue file reviews. The picture you can't get from a spreadsheet.",
    cta: "Open the AR register",
    targetSelector: "[data-walkthrough='register-link']",
  },
  {
    surface: "/demo/principal/register",
    title: "Filter to the critical band",
    body: "Sortable on every column. Click the Critical risk-band chip in the filter bar, then click into the top row.",
    cta: "Drill into the top critical AR",
    targetSelector: "[data-walkthrough='filter-critical']",
  },
  {
    surface: "/demo/principal/register/",
    title: "The deep view of one AR",
    body: "Risk score, breach history, MI returns, conduct events. Everything the SUP 12 / PS22/11 file should hold, in one place.",
    cta: "Switch to the AR's own view",
    targetSelector: "[data-walkthrough='persona-switcher']",
  },
  {
    surface: "/demo/ar",
    title: "Now you're the AR",
    body: "Same skin, different chrome. The AR sees their required actions, their own risk score, and the principal's recent comms. File an MI return.",
    cta: "Submit your Q1 MI return",
  },
  {
    surface: "/demo/ar/mi",
    title: "Quarterly MI return",
    body: "Volumes, complaints, breaches, conduct events. The principal sees this the moment you submit.",
    cta: "Submit the return",
  },
  {
    surface: "/demo/ar/breaches/new",
    title: "File a breach",
    body: "The AR side of SUP 15. Pick a type, self-assess severity, add facts. The clock starts when you submit.",
    cta: "Submit the breach",
  },
  {
    surface: "/demo/principal/breaches",
    title: "Back on the principal side",
    body: "The breach you just filed is at the top of the triage queue with a live FCA notification countdown. Open it.",
    cta: "Open the breach detail",
  },
  {
    surface: "/demo/principal/reviews",
    title: "Run a file review",
    body: "Sampling has surfaced one of the AR's cases for review. Open it, score the rubric, close the review.",
    cta: "Open the case",
  },
  {
    surface: "/demo/principal/annual-reviews",
    title: "Sign off the annual packet",
    body: "Risk trajectory, breaches, file reviews, MI trend, conduct events. One scrolling document. Sign it off and you've completed the loop.",
    cta: "Sign off and finish",
  },
];

export const WALKTHROUGH_LENGTH = WALKTHROUGH_STEPS.length;
