"use client";

import { useMemo } from "react";

/**
 * Tiny inline sparkline used in KPI tiles, table rows, and elsewhere.
 * Linear path scaled to container, optional last-point dot, optional
 * amber-gradient area fill underneath.
 */
export function Sparkline({
  data,
  className,
  height = 32,
  showLastDot = true,
  fill = true,
  stroke = "var(--brand-primary)",
}: {
  data: number[];
  className?: string;
  height?: number;
  showLastDot?: boolean;
  fill?: boolean;
  stroke?: string;
}) {
  const { path, area, lastX, lastY } = useMemo(() => {
    if (data.length === 0) return { path: "", area: "", lastX: 0, lastY: 0 };
    const max = Math.max(...data, 1);
    const w = 100;
    const stepX = data.length > 1 ? w / (data.length - 1) : 0;
    const points = data.map((v, i) => ({
      x: i * stepX,
      y: 100 - (v / max) * 100,
    }));
    const path = points
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
      .join(" ");
    const area =
      `M${points[0].x.toFixed(2)},${points[0].y.toFixed(2)} ` +
      points
        .slice(1)
        .map((p) => `L${p.x.toFixed(2)},${p.y.toFixed(2)}`)
        .join(" ") +
      ` L${points[points.length - 1].x.toFixed(2)},100 L0,100 Z`;
    return {
      path,
      area,
      lastX: points[points.length - 1].x,
      lastY: points[points.length - 1].y,
    };
  }, [data]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className}
      style={{ height, width: "100%" }}
      aria-hidden
    >
      {fill && (
        <>
          <defs>
            <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.3" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#sparkline-fill)" />
        </>
      )}
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {showLastDot && data.length > 0 && (
        <circle
          cx={lastX}
          cy={lastY}
          r="2.5"
          fill={stroke}
          stroke="var(--background)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}
