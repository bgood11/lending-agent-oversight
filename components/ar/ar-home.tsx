"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  TrendingUp,
  AlertTriangle,
  ClipboardCheck,
  ArrowRight,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemoStore } from "@/lib/state";
import { SKINS } from "@/lib/skins";
import { getDataset, FIXED_NOW_TS } from "@/lib/fixtures";
import { RiskGauge } from "@/components/principal/risk-gauge";
import { RiskBandBadge } from "@/components/principal/risk-band-badge";

/**
 * The AR's own home. Top strip is taller than the principal side,
 * greeting in Fraunces, persona pill on the right reads "AR · {firm}".
 * Body shows required actions, own performance, recent comms, quick
 * links. No risk-table-of-other-ARs here, only the AR's own data.
 */
export function ArHome() {
  const skin = useDemoStore((s) => s.skin);
  const skinDef = SKINS[skin];
  const focusedArId = useDemoStore((s) => s.focusedArId);
  const dataset = getDataset(skin);

  // Pick a representative AR if none is focused. Aim for one with a
  // few breaches and reviews so the home shows meaningful data.
  const ar = useMemo(() => {
    if (focusedArId) {
      const found = dataset.ars.find((a) => a.id === focusedArId);
      if (found) return found;
    }
    // Default: pick the highest-risk active AR. This is the most
    // dramatic version of the AR-side story.
    return [...dataset.ars]
      .filter((a) => a.status === "active")
      .sort((a, b) => b.riskScore - a.riskScore)[0];
  }, [dataset.ars, focusedArId]);

  const breaches = dataset.breaches.filter((b) => b.arId === ar.id);
  const reviews = dataset.reviews.filter((r) => r.arId === ar.id);
  const mi = dataset.miReturns.filter((m) => m.arId === ar.id);
  const latestReturn = mi[0];

  const requiredActions = [
    {
      icon: FileText,
      title: `Submit Q1 ${new Date().getFullYear()} MI return`,
      due: "Due in 11 days",
      href: "/demo/ar/mi",
      primary: true,
    },
    {
      icon: AlertCircle,
      title: "Read updated CONC 5.2 vulnerability policy",
      due: "Due in 6 days",
      href: "#",
    },
    {
      icon: ClipboardCheck,
      title: "Annual fitness review packet awaiting your input",
      due: "Due in 18 days",
      href: "#",
    },
  ];

  const recentComms = [
    {
      date: "3 days ago",
      title: `${skinDef.shortName} compliance update`,
      preview: "Policy refresh on adverse-information disclosure for Q2.",
    },
    {
      date: "6 days ago",
      title: "Quarterly broker bulletin",
      preview: "Lender criteria changes and PS22/11 reminder on annual reviews.",
    },
    {
      date: "11 days ago",
      title: "Vulnerability training refresher",
      preview: "FG21/1 e-learning available, 30 minutes, due by month-end.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 py-8 space-y-6">
      {/* Greeting in Fraunces — subliminal "different shoes" cue. */}
      <div className="space-y-2">
        <Badge variant="outline" className="text-[10px]">
          AR view · {ar.tradingName}
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-medium leading-tight tracking-tight">
          Hello {ar.contact.name.split(" ")[0]},
          <br />
          here&apos;s your week.
        </h1>
        <p className="text-sm text-muted-foreground">
          Supervised by {skinDef.shortName} · {ar.frn ? `FRN ${ar.frn}` : "via principal"}
        </p>
      </div>

      <Card className="p-5">
        <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
          Required this week
        </div>
        <ul className="mt-3 space-y-2.5">
          {requiredActions.map((a, i) => (
            <li key={i}>
              <Link
                href={a.href}
                className="flex items-start gap-3 rounded-md p-2.5 -mx-2.5 hover:bg-muted/40 transition-colors"
              >
                <span
                  className={`size-9 rounded-md grid place-items-center shrink-0 ${
                    a.primary
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <a.icon className="size-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium leading-tight">
                    {a.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {a.due}
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground self-center" />
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid sm:grid-cols-3 gap-3">
        <Card className="p-5 sm:col-span-1 flex flex-col items-center text-center gap-2">
          <RiskGauge score={ar.riskScore} size="md" />
          <div>
            <div className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground">
              Your risk score
            </div>
            <div className="mt-1">
              <RiskBandBadge band={ar.riskBand} />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
            File-review average
          </div>
          <div className="text-3xl font-bold tabular-nums leading-tight mt-2">
            {Math.round(
              reviews.reduce((s, r) => s + r.score, 0) / Math.max(1, reviews.length),
            )}
            <span className="text-sm font-normal text-muted-foreground ml-1">/100</span>
          </div>
          <div className="text-[11px] text-muted-foreground tabular-nums mt-1">
            across {reviews.length} reviews this year
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
            Open breaches
          </div>
          <div className="text-3xl font-bold tabular-nums leading-tight mt-2">
            {breaches.filter((b) => b.status === "open" || b.status === "in-remediation").length}
          </div>
          <div className="text-[11px] text-muted-foreground tabular-nums mt-1">
            of {breaches.length} reported in 12 months
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
            Recent comms from your principal
          </div>
          <ul className="mt-3 space-y-3">
            {recentComms.map((c, i) => (
              <li key={i} className="text-sm">
                <div className="font-medium leading-tight">{c.title}</div>
                <div className="text-[11px] text-muted-foreground tabular-nums">
                  {c.date}
                </div>
                <div className="text-muted-foreground mt-0.5 leading-snug">
                  {c.preview}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
            Quick actions
          </div>
          <div className="mt-3 grid gap-2">
            <Button
              className="w-full justify-start gap-2"
              render={<Link href="/demo/ar/mi" />}
            >
              <TrendingUp className="size-4" />
              Submit MI return
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              render={<Link href="/demo/ar/breaches/new" />}
            >
              <AlertTriangle className="size-4" />
              File a breach
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              render={<Link href="/demo/ar/profile" />}
            >
              <ClipboardCheck className="size-4" />
              View your profile
            </Button>
          </div>
          {latestReturn && (
            <div className="mt-3 pt-3 border-t border-border text-[11px] text-muted-foreground">
              Last MI return: Q{latestReturn.period.quarter} {latestReturn.period.year} · status {latestReturn.status}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
