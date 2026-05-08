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
