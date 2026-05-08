"use client";

import { cn } from "@/lib/utils";
import type { RiskBand } from "@/lib/types";
import { BAND_LABEL } from "@/lib/risk-scoring";

const BAND_CLASSES: Record<RiskBand, string> = {
  low: "bg-[var(--severity-low)]/15 text-[color:var(--severity-low)]",
  moderate: "bg-[var(--severity-moderate)]/15 text-[color:var(--severity-moderate)]",
  elevated: "bg-amber-soft text-amber-foreground",
  high: "bg-[var(--severity-high)]/15 text-[color:var(--severity-high)]",
  critical: "bg-destructive/15 text-destructive",
};

export function RiskBandBadge({
  band,
  className,
}: {
  band: RiskBand;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider",
        BAND_CLASSES[band],
        className,
      )}
    >
      {BAND_LABEL[band]}
    </span>
  );
}
