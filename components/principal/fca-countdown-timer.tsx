"use client";

import { Clock, Send, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { BreachReport } from "@/lib/types";
import { FIXED_NOW_TS } from "@/lib/fixtures";

/**
 * SUP 15 notification timing widget. Three nodes on a horizontal
 * track: Received (when the AR became aware), Must notify by (the
 * computed deadline), Notified (when the principal filed with the
 * FCA, if at all).
 *
 * State derived from the breach: open + notifyByAt in future = active
 * countdown; open + notifyByAt past = overdue (destructive); notified
 * = green check on third node.
 */
export function FcaCountdownTimer({ breach }: { breach: BreachReport }) {
  const aware = new Date(breach.awareAt).getTime();
  const notifyBy = breach.notifyByAt ? new Date(breach.notifyByAt).getTime() : null;
  const notified = breach.notifiedFcaAt ? new Date(breach.notifiedFcaAt).getTime() : null;

  if (!notifyBy) {
    // Below SUP 15 threshold (minor / moderate)
    return (
      <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        Below SUP 15 reporting threshold. Recorded internally; not notifiable to the FCA.
      </div>
    );
  }

  const isNotified = notified !== null;
  const isOverdue = !isNotified && FIXED_NOW_TS > notifyBy;
  const inWindow = !isNotified && !isOverdue;

  return (
    <div
      className={cn(
        "rounded-lg border p-5",
        isOverdue
          ? "border-destructive/40 bg-destructive/5"
          : isNotified
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-amber/40 bg-amber-soft/30",
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground">
            SUP 15 notification clock
          </div>
          <div className="text-base font-semibold mt-0.5">
            {isNotified
              ? "FCA notified"
              : isOverdue
                ? "Overdue"
                : "Awaiting notification"}
          </div>
        </div>
        {!isNotified && (
          <CountdownChip targetAt={notifyBy} />
        )}
      </div>

      <div className="relative">
        {/* Track */}
        <div className="absolute left-3 right-3 top-3 h-px bg-border" aria-hidden />
        <motion.div
          aria-hidden
          initial={{ width: 0 }}
          animate={{
            width: isNotified
              ? "100%"
              : inWindow
                ? `${Math.min(95, ((FIXED_NOW_TS - aware) / (notifyBy - aware)) * 100)}%`
                : "100%",
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "absolute left-3 top-3 h-px",
            isOverdue ? "bg-destructive" : isNotified ? "bg-emerald-600" : "bg-amber",
          )}
        />

        <div className="relative grid grid-cols-3 gap-2">
          <Node
            icon={Clock}
            label="Received"
            time={fmtClock(aware)}
            sublabel={fmtDate(aware)}
            state="done"
          />
          <Node
            icon={Send}
            label="Must notify by"
            time={fmtClock(notifyBy)}
            sublabel={fmtDate(notifyBy)}
            state={isNotified ? "done" : isOverdue ? "overdue" : "active"}
            destructive={isOverdue}
          />
          <Node
            icon={CheckCircle2}
            label="Notified"
            time={notified ? fmtClock(notified) : "—"}
            sublabel={notified ? fmtDate(notified) : "Pending"}
            state={isNotified ? "done" : "pending"}
          />
        </div>
      </div>
    </div>
  );
}

function Node({
  icon: Icon,
  label,
  time,
  sublabel,
  state,
  destructive,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  time: string;
  sublabel: string;
  state: "done" | "active" | "pending" | "overdue";
  destructive?: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-1">
      <div
        className={cn(
          "size-6 rounded-full grid place-items-center ring-4 ring-background",
          state === "done" && !destructive && "bg-emerald-600 text-white",
          state === "done" && destructive && "bg-destructive text-white",
          state === "active" && "bg-amber text-amber-foreground",
          state === "overdue" && "bg-destructive text-white",
          state === "pending" && "bg-muted text-muted-foreground border border-border",
        )}
      >
        <Icon className="size-3" />
      </div>
      <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mt-1">
        {label}
      </div>
      <div className="text-xs font-medium tabular-nums">{time}</div>
      <div className="text-[10px] text-muted-foreground tabular-nums">{sublabel}</div>
    </div>
  );
}

function CountdownChip({ targetAt }: { targetAt: number }) {
  const remaining = targetAt - FIXED_NOW_TS;
  const overdue = remaining < 0;
  const abs = Math.abs(remaining);
  const days = Math.floor(abs / (24 * 3600_000));
  const hours = Math.floor((abs % (24 * 3600_000)) / 3600_000);
  const text =
    days >= 1 ? `${days}d ${hours}h` : `${hours}h ${Math.floor((abs % 3600_000) / 60_000)}m`;
  return (
    <div
      className={cn(
        "text-right",
        overdue ? "text-destructive" : "text-amber-foreground",
      )}
    >
      <div className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
        {overdue ? "Overdue by" : "Time left"}
      </div>
      <div className="text-lg font-bold tabular-nums">{text}</div>
    </div>
  );
}

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function fmtClock(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
