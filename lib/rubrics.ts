/**
 * Per-vertical file-review rubric. Each skin's principal firm uses
 * the rubric matching its regulatory permission scope:
 *   MCOB for residential mortgage broking
 *   ICOBS for general insurance broking
 *   CONC for consumer credit broking
 *
 * Items reference the FCA Handbook section directly so the rubric
 * stays auditable. In production these would be tenant-tunable; the
 * demo ships the canonical set.
 */

import type { RubricCode } from "./types";

export interface RubricItem {
  /** Handbook reference, e.g. "MCOB 4.7A.2R". */
  code: string;
  /** Plain-language descriptor. */
  label: string;
  /** Section grouping (e.g. "Suitability", "Disclosure"). */
  section: string;
}

const MCOB_ITEMS: RubricItem[] = [
  // Section: Suitability (MCOB 4.7A)
  { code: "MCOB 4.7A.2", label: "Customer's needs and circumstances were assessed", section: "Suitability" },
  { code: "MCOB 4.7A.5", label: "Recommendation is suitable for the customer", section: "Suitability" },
  { code: "MCOB 4.7A.6", label: "Suitability rationale is documented", section: "Suitability" },
  // Section: Affordability (MCOB 11.6)
  { code: "MCOB 11.6.2", label: "Income and committed expenditure verified", section: "Affordability" },
  { code: "MCOB 11.6.5", label: "Stress test applied for interest rate increases", section: "Affordability" },
  { code: "MCOB 11.6.18", label: "Interest-only repayment strategy evidenced", section: "Affordability" },
  // Section: Disclosure (MCOB 5)
  { code: "MCOB 5.5.1", label: "ESIS issued before customer commitment", section: "Disclosure" },
  { code: "MCOB 5.6.6", label: "ESIS contains required pre-contract information", section: "Disclosure" },
  { code: "MCOB 5.6.16", label: "Cooling-off period notice included", section: "Disclosure" },
  // Section: Fees and incentives
  { code: "MCOB 4.4A.1", label: "Broker fee disclosed before customer commitment", section: "Fees" },
  { code: "MCOB 4.4A.4", label: "Procuration fee structure declared", section: "Fees" },
  // Section: Vulnerable customer (FG21/1 cross-reference)
  { code: "FG21/1", label: "Vulnerability indicators considered and recorded", section: "Vulnerable customer" },
  { code: "PRIN 2A", label: "Consumer Duty outcome assessment captured", section: "Consumer Duty" },
];

const ICOBS_ITEMS: RubricItem[] = [
  // Section: Suitability of advice (ICOBS 5.2)
  { code: "ICOBS 5.2.2", label: "Customer demands and needs identified", section: "Demands and needs" },
  { code: "ICOBS 5.2.3", label: "Statement of demands and needs documented", section: "Demands and needs" },
  { code: "ICOBS 5.3.1", label: "Personal recommendation explained", section: "Suitability" },
  // Section: Pre-contract disclosure (ICOBS 6)
  { code: "ICOBS 6.1.5", label: "Insurance Product Information Document provided", section: "Disclosure" },
  { code: "ICOBS 6.4.1", label: "Status disclosure (broker vs intermediary)", section: "Disclosure" },
  { code: "ICOBS 6.4.4", label: "Remuneration disclosure (commission)", section: "Disclosure" },
  // Section: Fair value (PROD 4 / Consumer Duty)
  { code: "PROD 4.5", label: "Fair value assessment for the distribution arrangement", section: "Fair value" },
  { code: "PROD 4.5.6", label: "Premium-to-cover ratio appropriate for target market", section: "Fair value" },
  // Section: Consumer Duty / vulnerable customers
  { code: "PRIN 2A.1", label: "Consumer understanding outcome documented", section: "Consumer Duty" },
  { code: "FG21/1", label: "Vulnerability indicators captured during sale", section: "Vulnerable customer" },
  // Section: Claims handling (ICOBS 8)
  { code: "ICOBS 8.1.1", label: "Claims handling expectations explained at sale", section: "Claims" },
];

const CONC_ITEMS: RubricItem[] = [
  // Section: Pre-contract information (CONC 4)
  { code: "CONC 4.2.5", label: "Adequate explanations given to enable informed decision", section: "Pre-contract" },
  { code: "CONC 4.2.7", label: "Customer's understanding probed before agreement", section: "Pre-contract" },
  { code: "CONC 4.2.8", label: "Adverse consequences of payment difficulties explained", section: "Pre-contract" },
  // Section: Creditworthiness (CONC 5.2A)
  { code: "CONC 5.2A.4", label: "Creditworthiness assessment carried out before granting credit", section: "Creditworthiness" },
  { code: "CONC 5.2A.10", label: "Sources of information for the assessment recorded", section: "Creditworthiness" },
  { code: "CONC 5.2A.20", label: "Customer-specific affordability assessment performed", section: "Creditworthiness" },
  // Section: Disclosure (CONC 4)
  { code: "CONC 4.2.15", label: "Pre-contract credit information document provided", section: "Disclosure" },
  { code: "CONC 4.4.2", label: "Total amount payable and APR disclosed", section: "Disclosure" },
  // Section: Brokerage and commission
  { code: "CONC 4.4.4", label: "Broker fee disclosed and consented to", section: "Fees" },
  { code: "CONC 4.5.3", label: "Commission disclosure adequate", section: "Fees" },
  // Section: Vulnerable customer / Consumer Duty
  { code: "FG21/1", label: "Vulnerability indicators captured in the customer file", section: "Vulnerable customer" },
  { code: "PRIN 2A.4", label: "Consumer support outcome recorded", section: "Consumer Duty" },
];

export const RUBRICS: Record<RubricCode, RubricItem[]> = {
  MCOB: MCOB_ITEMS,
  ICOBS: ICOBS_ITEMS,
  CONC: CONC_ITEMS,
};

export function getRubric(code: RubricCode): RubricItem[] {
  return RUBRICS[code];
}

export function getRubricSections(code: RubricCode): string[] {
  return Array.from(new Set(RUBRICS[code].map((i) => i.section)));
}
