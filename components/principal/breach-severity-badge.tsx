"use client";

import { cn } from "@/lib/utils";
import type { BreachSeverity } from "@/lib/types";

const LABELS: Record<BreachSeverity, string> = {
  minor: "Minor",
  moderate: "Moderate",
  material: "Material",
  significant: "Significant",
};

const CLASSES: Record<BreachSeverity, string> = {
  minor: "bg-[var(--severity-low)]/15 text-[color:var(--severity-low)]",
  moderate: "bg-[var(--severity-moderate)]/15 text-[color:var(--severity-moderate)]",
  material: "bg-[var(--severity-high)]/15 text-[color:var(--severity-high)]",
  significant: "bg-destructive/15 text-destructive",
};

export function BreachSeverityBadge({
  severity,
  className,
}: {
  severity: BreachSeverity;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider",
        CLASSES[severity],
        className,
      )}
    >
      {LABELS[severity]}
    </span>
  );
}
