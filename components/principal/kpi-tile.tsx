"use client";

import { type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkline } from "./sparkline";

export function KpiTile({
  label,
  value,
  sublabel,
  icon: Icon,
  accent = "muted",
  sparkline,
  destructive,
  delay = 0,
}: {
  label: string;
  value: string;
  sublabel?: string;
  icon: LucideIcon;
  accent?: "amber" | "primary" | "muted";
  sparkline?: number[];
  destructive?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay }}
    >
      <Card
        className={cn(
          "p-5 relative overflow-hidden h-full",
          destructive && "ring-2 ring-destructive/30",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div
            className={cn(
              "size-9 rounded-lg grid place-items-center shrink-0 ring-1",
              accent === "amber" && "bg-amber-soft text-amber-foreground ring-amber/30",
              accent === "primary" &&
                "ring-[color:var(--brand-primary)]/25 bg-[color:var(--brand-primary)]/10",
              accent === "muted" && "bg-muted text-muted-foreground ring-border",
              destructive && "bg-destructive/10 text-destructive ring-destructive/30",
            )}
            style={
              accent === "primary" && !destructive
                ? { color: "var(--brand-primary)" }
                : undefined
            }
          >
            <Icon className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
            {label}
          </div>
          <div className="text-3xl font-bold leading-tight tabular-nums mt-0.5">
            {value}
          </div>
          {sublabel && (
            <div className="text-[11px] text-muted-foreground tabular-nums mt-1">
              {sublabel}
            </div>
          )}
        </div>
        {sparkline && (
          <div className="mt-3 -mx-1 -mb-1">
            <Sparkline
              data={sparkline}
              height={28}
              showLastDot
              fill
              stroke={destructive ? "var(--destructive)" : "var(--brand-primary)"}
            />
          </div>
        )}
      </Card>
    </motion.div>
  );
}
