/**
 * Per-vertical file-review rubric. Each skin's principal firm uses
 * the rubric matching its regulatory permission scope:
 *   MCOB for residential mortgage broking
 *   ICOBS for general insurance broking
 *   CONC for consumer credit broking
 *
 * IAR cases get a separate, vertical-agnostic rubric. An IAR is
 * limited to effecting introductions and providing information
 * about the principal's products (SUP 12.2). It cannot give
 * regulated advice, arrange, or deal. Reviewing an IAR file
 * against MCOB suitability or ICOBS demands-and-needs is therefore
 * the wrong test. The IAR rubric instead checks introduction
 * quality, status disclosure, information accuracy, and scope
 * adherence.
 *
 * Items reference the FCA Handbook section directly so the rubric
 * stays auditable. In production these would be tenant-tunable; the
 * demo ships the canonical set.
 */

import type { RubricCode, ArType } from "./types";

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

/**
 * IAR rubric. Vertical-agnostic. Used for any AR whose appointment
 * type is IAR, regardless of whether the principal firm holds MCOB,
 * ICOBS, or CONC permissions. The items are deliberately narrower:
 * an IAR is making introductions and passing information, not
 * advising or arranging.
 *
 * Sources: SUP 12.2 (IAR scope), SUP 12.5 (written contract scope),
 * PRIN 7 (clear, fair and not misleading communications), PRIN 2A
 * (Consumer Duty applied at point of introduction), FG21/1
 * (vulnerability identification at first contact).
 */
const IAR_ITEMS: RubricItem[] = [
  // Section: Introduction quality
  { code: "SUP 12.2.2", label: "Introduction was within the scope of the IAR appointment", section: "Introduction" },
  { code: "SUP 12.5.5", label: "Customer informed they are dealing with an introducer, not the principal", section: "Introduction" },
  { code: "PRIN 7", label: "Information about the principal's product was clear, fair, and not misleading", section: "Introduction" },
  // Section: Status and remuneration disclosure
  { code: "SUP 12.5.6", label: "Status disclosure (regulated via the principal) provided to customer", section: "Disclosure" },
  { code: "DISP 1.2", label: "Complaints route to the principal explained", section: "Disclosure" },
  { code: "CONC 4.5 / ICOBS 4 / MCOB 4.4A", label: "Any commission or referral fee disclosed before introduction", section: "Disclosure" },
  // Section: Scope adherence (the failure mode for IARs)
  { code: "SUP 12.2.10", label: "No regulated advice given (no recommendation, no comparison, no opinion on suitability)", section: "Scope adherence" },
  { code: "SUP 12.2.11", label: "No arranging activity carried out (no application completion, no submission)", section: "Scope adherence" },
  { code: "SUP 12.2.12", label: "Only the principal's approved promotional material was used", section: "Scope adherence" },
  // Section: Information accuracy and hand-off
  { code: "PRIN 2A", label: "Customer information collected was accurate and complete at hand-off", section: "Hand-off" },
  { code: "FG21/1", label: "Vulnerability indicators flagged to the principal at hand-off", section: "Hand-off" },
  { code: "SYSC 9", label: "Introduction recorded with timestamp, customer consent, and product context", section: "Hand-off" },
];

export const RUBRICS: Record<RubricCode, RubricItem[]> = {
  MCOB: MCOB_ITEMS,
  ICOBS: ICOBS_ITEMS,
  CONC: CONC_ITEMS,
};

/**
 * Pick the rubric for a given AR. IAR appointments get the
 * vertical-agnostic IAR rubric; AR appointments get the
 * principal's vertical rubric.
 */
export function getRubric(code: RubricCode, arType: ArType = "AR"): RubricItem[] {
  if (arType === "IAR") return IAR_ITEMS;
  return RUBRICS[code];
}

export function getRubricSections(code: RubricCode, arType: ArType = "AR"): string[] {
  return Array.from(new Set(getRubric(code, arType).map((i) => i.section)));
}

/**
 * Identifier rendered in the file-review header. The vertical
 * rubric uses its handbook code (MCOB / ICOBS / CONC); IAR
 * reviews render as "IAR" so the reviewer is in no doubt the
 * narrower scope applies.
 */
export function getRubricLabel(code: RubricCode, arType: ArType = "AR"): string {
  return arType === "IAR" ? "IAR" : code;
}

export const IAR_RUBRIC = IAR_ITEMS;
