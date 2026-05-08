"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

/**
 * Stylised tablet+phone preview for the hero. Tablet shows a stripped-
 * down Heritage compliance home; the active row cycles every 2.4s
 * with risk band shifts to convey "watching the network in real time".
 * Phone shows an AR submitting an MI return; every 4.8s a Submit ->
 * Submitted overlay plays to narrate the persona-switch payoff.
 */
export function HeroPreview() {
  const [highlight, setHighlight] = useState(0);
  const [phoneSubmitting, setPhoneSubmitting] = useState(false);

  useEffect(() => {
    const tabletId = setInterval(() => {
      setHighlight((v) => (v + 1) % 6);
    }, 2400);
    const phoneId = setInterval(() => {
      setPhoneSubmitting(true);
      setTimeout(() => setPhoneSubmitting(false), 1200);
    }, 4800);
    return () => {
      clearInterval(tabletId);
      clearInterval(phoneId);
    };
  }, []);

  const rows = [
    { name: "Pemberton Mortgages", score: 84, band: "critical", trend: [70, 72, 74, 76, 78, 80, 82, 84] },
    { name: "Holyrood Lending", score: 76, band: "high", trend: [60, 64, 68, 70, 72, 74, 75, 76] },
    { name: "Whitechapel Mortgages", score: 64, band: "high", trend: [50, 54, 58, 60, 62, 63, 64, 64] },
    { name: "Larkspur Mortgage", score: 52, band: "elevated", trend: [40, 44, 48, 50, 51, 51, 52, 52] },
    { name: "Sherwood Home Finance", score: 41, band: "elevated", trend: [35, 38, 40, 41, 41, 42, 41, 41] },
    { name: "Caldicott Mortgages", score: 28, band: "moderate", trend: [22, 24, 25, 26, 27, 27, 28, 28] },
  ];

  const bandColour = (band: string) =>
    band === "critical"
      ? "var(--severity-critical)"
      : band === "high"
        ? "var(--severity-high)"
        : band === "elevated"
          ? "var(--severity-elevated)"
          : "var(--severity-moderate)";

  return (
    <div className="relative">
      {/* Tablet bezel */}
      <div className="relative bg-slate-900 dark:bg-slate-800 rounded-3xl p-3 shadow-2xl ring-1 ring-black/10">
        <div className="bg-background rounded-2xl overflow-hidden ring-1 ring-border">
          {/* Top chrome */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/40">
            <div className="flex items-center gap-2">
              <span
                className="size-5 rounded grid place-items-center"
                style={{ color: "var(--brand-primary)" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-full">
                  <path d="M12 2.5 4 5.5v6c0 4.5 3.4 8.6 8 10 4.6-1.4 8-5.5 8-10v-6L12 2.5Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M12 2.5 4 5.5v6c0 4.5 3.4 8.6 8 10 4.6-1.4 8-5.5 8-10v-6L12 2.5Z" />
                </svg>
              </span>
              <span className="text-xs font-semibold">Heritage Mortgage Network</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Imogen</span>
          </div>

          {/* Body */}
          <div className="grid grid-cols-[120px_1fr] gap-3 p-3">
            <div className="space-y-2">
              <Stub label="Critical" value="32" />
              <Stub label="Awaiting FCA" value="3" />
              <Stub label="Overdue" value="7" />
              <Stub label="Due 30d" value="12" />
            </div>

            <div className="space-y-1.5">
              <div className="text-[8px] uppercase tracking-wider font-semibold text-muted-foreground">
                Top 10 highest-risk
              </div>
              {rows.map((row, i) => (
                <motion.div
                  key={row.name}
                  animate={{ scale: highlight === i ? 1.02 : 1 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-md p-1.5 transition-colors ring-1 ${
                    highlight === i
                      ? "ring-amber bg-amber-soft/40"
                      : "ring-border bg-background"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[9px] font-medium leading-tight truncate flex-1">
                      {row.name}
                    </div>
                    <div className="text-[10px] tabular-nums font-bold">
                      {row.score}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Spark data={row.trend} />
                    <span
                      className="size-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: bandColour(row.band) }}
                      aria-hidden
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Phone overhang */}
      <motion.div
        initial={{ opacity: 0, y: 20, x: 30 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute -right-2 -bottom-8 sm:-right-6 sm:-bottom-10 hidden sm:block"
      >
        <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-2 shadow-2xl ring-1 ring-black/10">
          <div className="bg-background rounded-xl w-44 ring-1 ring-border overflow-hidden">
            <div className="px-3 py-2.5 border-b border-border flex items-center gap-2">
              <span
                className="size-4 rounded"
                style={{ backgroundColor: "var(--brand-primary)" }}
              />
              <span className="text-[10px] font-semibold">Pemberton</span>
            </div>
            <div className="p-3 space-y-2 relative">
              <div className="text-[10px] font-semibold leading-tight">
                Q1 MI return
              </div>
              <div className="space-y-1">
                <Bar w="100%" />
                <Bar w="80%" />
                <Bar w="60%" />
                <Bar w="90%" />
              </div>
              <div
                className={`h-5 rounded grid place-items-center mt-1 ${
                  phoneSubmitting ? "bg-emerald-500" : "bg-foreground/90"
                }`}
              >
                <span className={`text-[8px] font-semibold ${phoneSubmitting ? "text-white" : "text-background"}`}>
                  {phoneSubmitting ? "✓ Submitted" : "Submit"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Stub({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[8px] uppercase tracking-wider text-muted-foreground/80 font-semibold">
        {label}
      </div>
      <div className="text-base font-bold tabular-nums leading-none mt-0.5">
        {value}
      </div>
    </div>
  );
}

function Bar({ w }: { w: string }) {
  return <div className="h-1.5 rounded bg-muted" style={{ width: w }} />;
}

function Spark({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const w = 100;
  const stepX = w / (data.length - 1);
  const path = data
    .map((v, i) => `${i === 0 ? "M" : "L"}${i * stepX},${100 - (v / max) * 100}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="flex-1 h-3">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}
