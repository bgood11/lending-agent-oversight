"use client";

import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import type { RequiredAction } from "@/lib/types";

export function NextActions({ actions }: { actions: RequiredAction[] }) {
  if (actions.length === 0) {
    return (
      <Card className="p-5">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
          Next actions
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Network looking healthy. Nothing pressing.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
          Next actions
        </div>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          {actions.length} pending
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {actions.map((a, i) => {
          const due = new Date(a.dueAt);
          const ageDays = Math.floor(
            (due.getTime() - new Date("2026-05-08T18:00:00Z").getTime()) /
              (24 * 3600_000),
          );
          const overdue = ageDays < 0;
          return (
            <motion.li
              key={a.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <Link
                href={a.href}
                className="flex items-start gap-3 rounded-md p-2 -mx-2 hover:bg-muted/40 transition-colors"
              >
                <span
                  className={`size-7 rounded-md grid place-items-center shrink-0 ${
                    overdue
                      ? "bg-destructive/10 text-destructive"
                      : "bg-amber-soft text-amber-foreground"
                  }`}
                >
                  <Calendar className="size-3.5" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium leading-tight">
                    {a.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {overdue
                      ? `Overdue by ${Math.abs(ageDays)} day${Math.abs(ageDays) === 1 ? "" : "s"}`
                      : `Due in ${ageDays} day${ageDays === 1 ? "" : "s"}`}
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground self-center" />
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </Card>
  );
}
