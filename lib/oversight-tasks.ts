/**
 * Default oversight tasks shipped with the product. Each task is
 * tied to a specific regulatory source, has a default frequency,
 * an owner role, and an applies-to scope (AR / IAR / all).
 *
 * The principal-admin can edit any of these via /demo/principal/
 * settings — change frequency, disable, or add custom tasks. The
 * defaults represent the canonical PS22/11-era supervision
 * programme; in production they would seed the tenant's task
 * register on onboarding.
 *
 * In the demo these are read-only at the source; per-tenant
 * overrides live in the Zustand store.
 */

import type { OversightTask } from "./types";

export const DEFAULT_OVERSIGHT_TASKS: OversightTask[] = [
  // Per-AR review and attestation
  {
    id: "task-annual-ar-review",
    title: "Annual review of each AR",
    description:
      "Per-AR fitness review packet. Risk trajectory, breach summary, file-review summary, MI trend, conduct events. Director sign-off.",
    category: "review",
    scope: "per-ar",
    appliesTo: "all",
    defaultFrequency: "annual",
    ownerRole: "principal-compliance-officer",
    dueOffsetDays: 365,
    source: "sup-12.6a",
    isCanonical: true,
  },
  {
    id: "task-file-review-critical",
    title: "File review — critical-band ARs",
    description:
      "Sample 5% of new cases for ARs in the critical risk band. Score against per-vertical rubric (MCOB / ICOBS / CONC) or IAR rubric.",
    category: "review",
    scope: "per-ar",
    appliesTo: "all",
    defaultFrequency: "monthly",
    ownerRole: "principal-compliance-officer",
    dueOffsetDays: 30,
    source: "sup-12.6",
    isCanonical: true,
  },
  {
    id: "task-file-review-elevated",
    title: "File review — elevated and high-band ARs",
    description: "Sample 3% of new cases. Same rubric as critical-band reviews.",
    category: "review",
    scope: "per-ar",
    appliesTo: "all",
    defaultFrequency: "quarterly",
    ownerRole: "principal-compliance-officer",
    dueOffsetDays: 90,
    source: "sup-12.6",
    isCanonical: true,
  },
  {
    id: "task-file-review-baseline",
    title: "File review — baseline sampling",
    description:
      "Random 1% sample across moderate and low-band ARs. Catches drift the risk-band sampling misses.",
    category: "review",
    scope: "per-ar",
    appliesTo: "all",
    defaultFrequency: "quarterly",
    ownerRole: "principal-compliance-officer",
    dueOffsetDays: 90,
    source: "internal",
    isCanonical: true,
  },
  {
    id: "task-mi-return",
    title: "AR submits quarterly MI return",
    description:
      "Volumes, complaints received and upheld, breaches self-reported, conduct events, cancellations. Anomaly score recomputed on submission.",
    category: "data-collection",
    scope: "per-ar",
    appliesTo: "all",
    defaultFrequency: "quarterly",
    ownerRole: "ar-user",
    dueOffsetDays: 45,
    source: "sup-12.6a",
    isCanonical: true,
  },
  {
    id: "task-supervision-1to1",
    title: "Supervision 1:1 with AR senior individual",
    description:
      "Recorded conversation with the AR's nominated senior individual. Covers risk-score movement, open breaches, training gaps.",
    category: "attestation",
    scope: "per-ar",
    appliesTo: "AR",
    defaultFrequency: "half-yearly",
    ownerRole: "principal-compliance-officer",
    dueOffsetDays: 180,
    source: "sup-12.6",
    isCanonical: true,
  },
  {
    id: "task-iar-scope-attestation",
    title: "IAR scope-adherence attestation",
    description:
      "IAR's senior individual attests that no advice, arranging, or dealing has been carried out in the period and only the principal's approved material has been used.",
    category: "attestation",
    scope: "per-ar",
    appliesTo: "IAR",
    defaultFrequency: "quarterly",
    ownerRole: "ar-user",
    dueOffsetDays: 90,
    source: "sup-12.6",
    isCanonical: true,
  },
  {
    id: "task-policy-attestation",
    title: "Policy attestation — AR refresher",
    description:
      "AR confirms reading and adoption of the principal's current policy pack (treating customers fairly, vulnerability, financial promotions, complaints).",
    category: "attestation",
    scope: "per-ar",
    appliesTo: "all",
    defaultFrequency: "annual",
    ownerRole: "ar-user",
    dueOffsetDays: 365,
    source: "consumer-duty",
    isCanonical: true,
  },
  {
    id: "task-vulnerability-mi",
    title: "Vulnerable-customer MI roll-up",
    description:
      "Identification rate, recorded adjustments, and complaint outcomes for vulnerable cohorts aggregated to the principal's vulnerable-customer MI tile.",
    category: "data-collection",
    scope: "firm-level",
    appliesTo: "all",
    defaultFrequency: "quarterly",
    ownerRole: "principal-compliance-officer",
    dueOffsetDays: 30,
    source: "fg21-1",
    isCanonical: true,
  },
  // Firm-level filings and attestations
  {
    id: "task-self-assessment",
    title: "Annual AR oversight self-assessment",
    description:
      "Written self-assessment of the principal's compliance with its AR oversight obligations. Approved by the governing body.",
    category: "filing",
    scope: "firm-level",
    appliesTo: "all",
    defaultFrequency: "annual",
    ownerRole: "principal-admin",
    dueOffsetDays: 365,
    source: "ps22-11",
    isCanonical: true,
  },
  {
    id: "task-rep025",
    title: "REP025 annual data return",
    description:
      "Per-AR data including revenue and complaints submitted to the FCA via RegData. Exported from the AR register and MI returns.",
    category: "filing",
    scope: "firm-level",
    appliesTo: "all",
    defaultFrequency: "annual",
    ownerRole: "principal-admin",
    dueOffsetDays: 365,
    source: "ps22-11",
    isCanonical: true,
  },
  {
    id: "task-disp1-return",
    title: "DISP 1 complaints return",
    description:
      "Half-yearly DISP 1.10 complaints return covering all AR-originated complaints, submitted at the principal level.",
    category: "filing",
    scope: "firm-level",
    appliesTo: "all",
    defaultFrequency: "half-yearly",
    ownerRole: "principal-compliance-officer",
    dueOffsetDays: 30,
    source: "disp-1",
    isCanonical: true,
  },
  {
    id: "task-consumer-duty-board",
    title: "Consumer Duty board report",
    description:
      "Annual board report on Consumer Duty outcomes across the AR network. Feeds from the per-AR Consumer Duty section of the annual review packet.",
    category: "filing",
    scope: "firm-level",
    appliesTo: "all",
    defaultFrequency: "annual",
    ownerRole: "principal-admin",
    dueOffsetDays: 365,
    source: "consumer-duty",
    isCanonical: true,
  },
  {
    id: "task-resilience-self-assessment",
    title: "Operational resilience self-assessment",
    description:
      "SYSC 15A self-assessment for ARs designated as supporting an Important Business Service. Impact tolerance, severe-but-plausible scenarios, recovery posture.",
    category: "attestation",
    scope: "firm-level",
    appliesTo: "all",
    defaultFrequency: "annual",
    ownerRole: "principal-admin",
    dueOffsetDays: 365,
    source: "sysc-15a",
    isCanonical: true,
  },
];

export function getDefaultTask(id: string): OversightTask | undefined {
  return DEFAULT_OVERSIGHT_TASKS.find((t) => t.id === id);
}

export const FREQUENCY_LABEL: Record<
  import("./types").TaskFrequency,
  string
> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  "half-yearly": "Half-yearly",
  annual: "Annual",
  "ad-hoc": "Ad-hoc",
};

export const SOURCE_LABEL: Record<
  import("./types").TaskRegulatorySource,
  string
> = {
  "ps22-11": "PS22/11",
  "sup-12.6": "SUP 12.6",
  "sup-12.6a": "SUP 12.6A",
  "sup-15": "SUP 15",
  "disp-1": "DISP 1",
  "consumer-duty": "Consumer Duty",
  "sysc-15a": "SYSC 15A",
  "fg21-1": "FG21/1",
  internal: "Internal",
};

export const CATEGORY_LABEL: Record<
  import("./types").TaskCategory,
  string
> = {
  review: "Review",
  attestation: "Attestation",
  "data-collection": "Data collection",
  filing: "Filing",
  training: "Training",
  other: "Other",
};
