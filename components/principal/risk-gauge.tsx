"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { bandFromScore, BAND_COLOR_VAR } from "@/lib/risk-scoring";

/**
 * Semicircular dial. Outer radius 100px (size="lg") or 16px (size="sm").
 * Animates from 0 to score on first paint over 800ms.
 */
export function RiskGauge({
  score,
  size = "lg",
  className,
}: {
  score: number;
  size?: "lg" | "md" | "sm";
  className?: string;
}) {
  const band = bandFromScore(score);
  const colour = BAND_COLOR_VAR[band];
  const dim = size === "lg" ? 220 : size === "md" ? 120 : 32;
  const stroke = size === "lg" ? 14 : size === "md" ? 10 : 4;
  const r = (dim - stroke) / 2;
  const cx = dim / 2;
  const cy = dim / 2;

  // Semicircle from left to right, top half.
  const start = { x: cx - r, y: cy };
  const end = { x: cx + r, y: cy };

  // Score 0..100 maps to 0..PI radians along the arc.
  const angle = (score / 100) * Math.PI;
  const tip = {
    x: cx - r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  };
  const largeArcFlag = angle > Math.PI / 2 ? 0 : 0; // always 0 for half circle
  const path = `M${start.x} ${start.y} A${r} ${r} 0 0 1 ${tip.x.toFixed(2)} ${tip.y.toFixed(2)}`;
  const fullPath = `M${start.x} ${start.y} A${r} ${r} 0 0 1 ${end.x} ${end.y}`;

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: dim, height: dim / 2 + stroke }}
    >
      <svg
        width={dim}
        height={dim / 2 + stroke}
        viewBox={`0 0 ${dim} ${dim / 2 + stroke}`}
        fill="none"
      >
        <path
          d={fullPath}
          stroke="var(--muted)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <motion.path
          d={path}
          stroke={colour}
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      {size === "lg" && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center pt-2">
          <div className="text-3xl font-bold tabular-nums leading-none">
            {Math.round(score)}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
            of 100
          </div>
        </div>
      )}
      {size === "md" && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="text-base font-semibold tabular-nums leading-none">
            {Math.round(score)}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Inline mini-gauge for table rows. Just the arc, no number, score
 * shown beside it by the consumer.
 */
export function RiskMiniGauge({ score }: { score: number }) {
  return <RiskGauge score={score} size="sm" />;
}
