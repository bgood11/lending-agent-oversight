"use client";

import { motion } from "motion/react";

/**
 * Calendar-style breach activity heatmap. Last 90 days as a 14-week
 * grid. Cell intensity scales with breach count (0 / 1 / 2 / 3+).
 * Cells stagger-fade in on first paint top-left to bottom-right.
 */
export function BreachHeatmap({
  data,
  className,
}: {
  /** Array of 90 numbers, oldest first. */
  data: number[];
  className?: string;
}) {
  // 14 weeks × 7 days = 98 cells, we use the last 90, padding the rest.
  const padded = new Array(98 - data.length).fill(0).concat(data);
  const totalBreaches = data.reduce((a, b) => a + b, 0);
  const peakDay = Math.max(...data, 0);

  function cellOpacity(count: number): number {
    if (count === 0) return 0;
    if (count === 1) return 0.30;
    if (count === 2) return 0.55;
    return 0.85;
  }

  return (
    <div className={className}>
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
            Breach activity · last 90 days
          </div>
          <div className="text-lg font-semibold tabular-nums mt-0.5">
            {totalBreaches} breaches
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground tabular-nums">
          Peak day: <span className="text-foreground font-medium">{peakDay}</span>
        </div>
      </div>

      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}
      >
        {padded.map((count, i) => {
          const week = Math.floor(i / 7);
          const day = i % 7;
          const cellIndex = week * 7 + day;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18, delay: cellIndex * 0.005 }}
              className="aspect-square rounded-sm"
              style={{
                backgroundColor: count > 0
                  ? `color-mix(in oklch, var(--brand-primary) ${cellOpacity(count) * 100}%, transparent)`
                  : "var(--muted)",
              }}
              title={count > 0 ? `${count} breach${count === 1 ? "" : "es"}` : undefined}
              aria-label={`${count} breach${count === 1 ? "" : "es"}`}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-[3px]">
          {[0, 1, 2, 3].map((c) => (
            <div
              key={c}
              className="size-2.5 rounded-sm"
              style={{
                backgroundColor: c === 0
                  ? "var(--muted)"
                  : `color-mix(in oklch, var(--brand-primary) ${cellOpacity(c) * 100}%, transparent)`,
              }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
