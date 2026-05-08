"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Send,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDemoStore } from "@/lib/state";
import { getDataset, getArById, FIXED_NOW_TS } from "@/lib/fixtures";
import { BreachSeverityBadge } from "./breach-severity-badge";
import { FcaCountdownTimer } from "./fca-countdown-timer";

export function BreachDetail({ breachId }: { breachId: string }) {
  const skin = useDemoStore((s) => s.skin);
  const liveBreaches = useDemoStore((s) => s.liveBreaches);
  const dataset = getDataset(skin);
  const breach =
    liveBreaches.find((b) => b.id === breachId) ??
    dataset.breaches.find((b) => b.id === breachId) ??
    null;
  const [confirmedNotified, setConfirmedNotified] = useState(false);

  if (!breach) return <NotFound />;

  const ar = getArById(skin, breach.arId);

  return (
    <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 py-6 space-y-5">
      <Link
        href="/demo/principal/breaches"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Breach triage queue
      </Link>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <BreachSeverityBadge severity={breach.severity} />
          <Badge variant="outline" className="text-[10px] capitalize">
            {breach.category.replace(/-/g, " ")}
          </Badge>
          <Badge variant="outline" className="text-[10px] capitalize">
            {breach.status.replace(/-/g, " ")}
          </Badge>
          <Badge variant="outline" className="text-[10px] capitalize">
            Filed by {breach.filedByPersona === "ar-user" ? "AR" : "principal"}
          </Badge>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-medium leading-tight tracking-tight">
          {breach.title}
        </h1>
        {ar && (
          <p className="text-sm text-muted-foreground">
            Raised against{" "}
            <Link
              href={`/demo/principal/register/${ar.id}`}
              className="text-primary hover:underline font-medium"
            >
              {ar.tradingName}
            </Link>
            {" · "}
            FRN {ar.frn ?? "via principal"}
          </p>
        )}
      </div>

      <FcaCountdownTimer breach={breach} />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-5">
        <div className="space-y-4">
          <Card className="p-5 space-y-3">
            <SectionLabel>Description</SectionLabel>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {breach.description}
            </p>
          </Card>

          <Card className="p-5 space-y-3">
            <SectionLabel>Customer impact</SectionLabel>
            <div className="text-sm">
              <Badge
                variant="outline"
                className={
                  breach.customerImpact === "actual-high"
                    ? "border-destructive/40 text-destructive"
                    : breach.customerImpact === "actual-low"
                      ? "border-[var(--severity-high)]/40 text-[color:var(--severity-high)]"
                      : breach.customerImpact === "potential"
                        ? "border-amber/40 text-amber-foreground"
                        : ""
                }
              >
                {breach.customerImpact === "none"
                  ? "No customer impact"
                  : breach.customerImpact === "potential"
                    ? "Potential impact"
                    : breach.customerImpact === "actual-low"
                      ? "Actual, low impact"
                      : "Actual, high impact"}
              </Badge>
            </div>
          </Card>

          {breach.rootCauseTaxonomy.length > 0 && (
            <Card className="p-5 space-y-3">
              <SectionLabel>Root-cause taxonomy</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {breach.rootCauseTaxonomy.map((rc) => (
                  <Badge key={rc} variant="secondary" className="text-[11px] capitalize">
                    {rc.replace(/-/g, " ")}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-5 space-y-3">
            <SectionLabel>Timeline</SectionLabel>
            <ol className="relative space-y-3 pl-6">
              <span
                className="absolute left-2 top-2 bottom-2 w-px bg-border"
                aria-hidden
              />
              <Event
                label="AR became aware"
                at={breach.awareAt}
                actor="AR"
              />
              <Event
                label="Reported to principal"
                at={breach.reportedAt}
                actor={breach.filedByPersona === "ar-user" ? "AR" : "Principal"}
              />
              {breach.notifiedFcaAt && (
                <Event
                  label="FCA notified"
                  at={breach.notifiedFcaAt}
                  actor="Principal compliance"
                  emphasis
                />
              )}
              {confirmedNotified && !breach.notifiedFcaAt && (
                <Event
                  label="FCA notified (recorded just now)"
                  at={new Date(FIXED_NOW_TS).toISOString()}
                  actor="You"
                  emphasis
                />
              )}
            </ol>
          </Card>
        </div>

        <div className="space-y-4">
          {!breach.notifiedFcaAt && !confirmedNotified && breach.notifyByAt && (
            <Card className="p-5 space-y-3 bg-amber-soft/30 border-amber/40">
              <SectionLabel>Take action</SectionLabel>
              <p className="text-sm leading-relaxed">
                Recording an FCA notification fires an audit-chain entry that
                cannot be undone. Step-up authentication required in
                production.
              </p>
              <Button
                className="w-full gap-1.5"
                onClick={() => setConfirmedNotified(true)}
              >
                <Send className="size-4" />
                Record FCA notification
              </Button>
              <p className="text-[10px] text-muted-foreground">
                Demo records to local state only.
              </p>
            </Card>
          )}

          {(breach.notifiedFcaAt || confirmedNotified) && (
            <Card className="p-5 bg-emerald-500/5 border-emerald-500/30">
              <div className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                <ShieldAlert className="size-4 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium">FCA notification recorded</div>
                  <div className="text-[11px] mt-0.5 opacity-80">
                    SUP 15 obligation discharged. Audit chain entry written.
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-5">
            <SectionLabel>Reporting reference</SectionLabel>
            <div className="font-mono text-xs text-muted-foreground tabular-nums mt-2">
              {breach.id}
            </div>
            <Separator className="my-3" />
            <div className="text-xs text-muted-foreground space-y-1.5">
              <div>SUP 15.3 · category {breach.category}</div>
              <div>Severity {breach.severity}</div>
              <div>{breach.notifyByAt ? `Window: ${breach.severity === "significant" ? "1 business day" : "30 days"}` : "Below threshold"}</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
      {children}
    </div>
  );
}

function Event({
  label,
  at,
  actor,
  emphasis,
}: {
  label: string;
  at: string;
  actor: string;
  emphasis?: boolean;
}) {
  return (
    <li className="relative">
      <span
        className={`absolute -left-[1.05rem] top-1 size-3 rounded-full ring-4 ring-background ${
          emphasis ? "bg-emerald-600" : "bg-muted-foreground/40"
        }`}
      />
      <div className={`text-sm font-medium leading-snug ${emphasis ? "text-foreground" : ""}`}>
        {label}
      </div>
      <div className="text-[11px] text-muted-foreground mt-0.5 tabular-nums">
        {new Date(at).toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        · by {actor}
      </div>
    </li>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-md text-center py-20 px-6">
      <h1 className="text-xl font-semibold">Breach not found</h1>
      <p className="text-sm text-muted-foreground mt-2">
        It may have been resolved or filed under a different principal firm.
      </p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Link
          href="/demo/principal/breaches"
          className="inline-flex items-center gap-1 mt-4 text-sm text-primary font-medium hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to triage queue
        </Link>
      </motion.div>
    </div>
  );
}
