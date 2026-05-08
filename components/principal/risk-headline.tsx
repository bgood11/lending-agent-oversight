"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BAND_LABEL, BAND_COLOR_VAR } from "@/lib/risk-scoring";
import type { RiskBand } from "@/lib/types";

const BAND_ORDER: RiskBand[] = [
  "low",
  "moderate",
  "elevated",
  "high",
  "critical",
];

/**
 * Editorial headline KPI for the principal home. The single most
 * important number on the screen — critical-band ARs — at Fraunces
 * display scale, with a stacked band-distribution bar that puts the
 * number in immediate context. Everything else on the page supports
 * this.
 */
export function RiskHeadline({
  bandDistribution,
  totalActive,
}: {
  bandDistribution: Record<RiskBand, number>;
  totalActive: number;
}) {
  const critical = bandDistribution.critical;
  const high = bandDistribution.high;
  const total = totalActive || 1;

  return (
    <Card className="relative overflow-hidden p-7 lg:p-8">
      {/* Brand-tinted top-left wash, subtle, anchors the surface to the
          active skin without shouting. */}
      <div
        aria-hidden
        className="absolute -top-24 -left-24 size-72 rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "var(--brand-primary)" }}
      />
      <div className="relative">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
          Network risk picture
        </div>

        <div className="mt-4 flex items-baseline gap-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-7xl sm:text-8xl font-medium leading-[0.85] tracking-tight tabular-nums"
            style={{ color: critical > 0 ? "var(--severity-critical)" : "var(--foreground)" }}
          >
            {critical}
          </motion.div>
          <div className="font-display text-2xl sm:text-3xl text-muted-foreground leading-tight tracking-tight">
            <em className="not-italic">in critical band</em>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium flex items-center justify-between">
            <span>Distribution across {totalActive} active ARs</span>
            <span className="font-mono tabular-nums">
              {high + critical} amber-or-red
            </span>
          </div>
          <BandDistributionBar
            distribution={bandDistribution}
            total={total}
          />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1">
            {BAND_ORDER.map((band) => (
              <BandLegend
                key={band}
                band={band}
                count={bandDistribution[band]}
              />
            ))}
          </div>
        </div>

        <Link
          href="/demo/principal/register?band=critical"
          className="inline-flex items-center gap-1.5 text-sm font-medium mt-5 hover:underline"
          style={{ color: "var(--brand-primary)" }}
        >
          Open the critical-band cohort
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </Card>
  );
}

function BandDistributionBar({
  distribution,
  total,
}: {
  distribution: Record<RiskBand, number>;
  total: number;
}) {
  return (
    <div
      className="flex h-3 w-full rounded-full overflow-hidden bg-muted/40 ring-1 ring-border/60"
      role="img"
      aria-label="Risk band distribution"
    >
      {BAND_ORDER.map((band, i) => {
        const v = distribution[band];
        const pct = (v / total) * 100;
        if (pct === 0) return null;
        return (
          <motion.div
            key={band}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1 + i * 0.06,
            }}
            style={{
              background: BAND_COLOR_VAR[band],
            }}
            title={`${BAND_LABEL[band]}: ${v}`}
          />
        );
      })}
    </div>
  );
}

function BandLegend({ band, count }: { band: RiskBand; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="size-2 rounded-full"
        style={{ background: BAND_COLOR_VAR[band] }}
        aria-hidden
      />
      <span className="text-[11px] text-muted-foreground">
        {BAND_LABEL[band]}
      </span>
      <span className="text-[11px] font-medium tabular-nums">{count}</span>
    </div>
  );
}
