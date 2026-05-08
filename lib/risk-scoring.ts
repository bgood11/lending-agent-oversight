/**
 * Composite risk scoring for an AR. Five normalised inputs, weighted,
 * scaled to 0-100. Bands derived from the score.
 *
 * Inputs in [0, 1]:
 *   complaintsDensity   uphold-weighted complaints / new business volume
 *   breachSeveritySum   weighted sum over rolling 12 months
 *   fileReviewInverse   1 - (mean review score / 100)
 *   timeSinceLastReview months since last review / 24, capped
 *   miAnomalyScore      most recent MI return's anomaly score
 */

import type { RiskBand } from "./types";

export interface RiskScoreInputs {
  complaintsDensity: number;
  breachSeveritySum: number;
  fileReviewInverse: number;
  timeSinceLastReview: number;
  miAnomalyScore: number;
}

export interface RiskScoreWeights {
  complaints: number;
  breach: number;
  reviewInverse: number;
  timeSinceReview: number;
  miAnomaly: number;
}

export const DEFAULT_WEIGHTS: RiskScoreWeights = {
  complaints: 0.20,
  breach: 0.30,
  reviewInverse: 0.25,
  timeSinceReview: 0.10,
  miAnomaly: 0.15,
};

export function computeRiskScore(
  inputs: RiskScoreInputs,
  weights: RiskScoreWeights = DEFAULT_WEIGHTS,
): number {
  return (
    100 *
    (weights.complaints * inputs.complaintsDensity +
      weights.breach * inputs.breachSeveritySum +
      weights.reviewInverse * inputs.fileReviewInverse +
      weights.timeSinceReview * inputs.timeSinceLastReview +
      weights.miAnomaly * inputs.miAnomalyScore)
  );
}

export interface RiskScoreContribution {
  input: keyof RiskScoreInputs;
  label: string;
  weight: number;
  rawValue: number;
  contribution: number;
  /** Percent of the composite this input contributed (0-100). */
  share: number;
}

/**
 * Derive a per-input attribution for a composite score so the
 * principal-side gauge tooltip and the AR-side dashboard can show
 * "your score moved from 38 to 42 because complaints density was
 * up". Pure function over the same weights.
 */
export function explainScore(
  inputs: RiskScoreInputs,
  weights: RiskScoreWeights = DEFAULT_WEIGHTS,
): RiskScoreContribution[] {
  const composite = computeRiskScore(inputs, weights);
  const safe = composite > 0 ? composite : 1;
  const rows: Array<{ key: keyof RiskScoreInputs; label: string; weight: number; rawValue: number }> = [
    { key: "complaintsDensity", label: "Complaints density", weight: weights.complaints, rawValue: inputs.complaintsDensity },
    { key: "breachSeveritySum", label: "Breach severity", weight: weights.breach, rawValue: inputs.breachSeveritySum },
    { key: "fileReviewInverse", label: "File-review score (inverse)", weight: weights.reviewInverse, rawValue: inputs.fileReviewInverse },
    { key: "timeSinceLastReview", label: "Time since last review", weight: weights.timeSinceReview, rawValue: inputs.timeSinceLastReview },
    { key: "miAnomalyScore", label: "MI anomaly", weight: weights.miAnomaly, rawValue: inputs.miAnomalyScore },
  ];
  return rows.map((r) => {
    const contribution = r.rawValue * r.weight * 100;
    return {
      input: r.key,
      label: r.label,
      weight: r.weight,
      rawValue: r.rawValue,
      contribution,
      share: (contribution / safe) * 100,
    };
  });
}

export function bandFromScore(score: number): RiskBand {
  if (score < 20) return "low";
  if (score < 40) return "moderate";
  if (score < 60) return "elevated";
  if (score < 80) return "high";
  return "critical";
}

export const BAND_LABEL: Record<RiskBand, string> = {
  low: "Low",
  moderate: "Moderate",
  elevated: "Elevated",
  high: "High",
  critical: "Critical",
};

/**
 * Map band to the corresponding severity-* CSS variable colour. The
 * variables are defined in globals.css and are consumed via Tailwind
 * arbitrary values like text-[var(--severity-elevated)].
 */
export const BAND_COLOR_VAR: Record<RiskBand, string> = {
  low: "var(--severity-low)",
  moderate: "var(--severity-moderate)",
  elevated: "var(--severity-elevated)",
  high: "var(--severity-high)",
  critical: "var(--severity-critical)",
};
