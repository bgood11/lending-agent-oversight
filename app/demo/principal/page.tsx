"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  ClipboardCheck,
  ListChecks,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/state";
import { SKINS } from "@/lib/skins";
import { computeKpis, getRequiredActions } from "@/lib/fixtures";
import { KpiTile } from "@/components/principal/kpi-tile";
import { TopRiskTable } from "@/components/principal/top-risk-table";
import { BreachHeatmap } from "@/components/principal/breach-heatmap";
import { NextActions } from "@/components/principal/next-actions";
import { Sparkline } from "@/components/principal/sparkline";

export default function PrincipalHomePage() {
  const skin = useDemoStore((s) => s.skin);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  const skinDef = SKINS[skin];
  const kpis = computeKpis(skin);
  const actions = getRequiredActions(skin);

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
            Principal compliance · Friday 8 May 2026
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-medium leading-tight tracking-tight mt-1">
            {skinDef.shortName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            Composite risk picture across {kpis.activeArCount} active{" "}
            {skinDef.rubric === "MCOB"
              ? "mortgage"
              : skinDef.rubric === "ICOBS"
                ? "general insurance"
                : "credit broking"}{" "}
            ARs. PS22/11 oversight requirements rendered as live data.
          </p>
        </div>
        <Button
          variant="outline"
          render={<Link href="/demo/principal/register" />}
          className="gap-1.5"
          data-walkthrough="register-link"
        >
          Open AR register
          <ArrowRight className="size-4" />
        </Button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiTile
          label="ARs in critical band"
          value={String(kpis.critical)}
          sublabel={`of ${kpis.activeArCount} active ARs`}
          icon={AlertTriangle}
          accent={kpis.critical > 0 ? "primary" : "muted"}
          destructive={kpis.critical > 4}
          delay={0}
        />
        <KpiTile
          label="Breaches awaiting FCA"
          value={String(kpis.awaitingNotification)}
          sublabel={kpis.awaitingNotification > 0 ? "SUP 15 clock running" : "All current breaches notified"}
          icon={CalendarClock}
          accent="amber"
          delay={0.05}
        />
        <KpiTile
          label="Overdue file reviews"
          value={String(kpis.overdueReviews)}
          sublabel={`${kpis.completedReviewsThisMonth} completed this month`}
          icon={ClipboardCheck}
          delay={0.10}
        />
        <KpiTile
          label="Annual reviews due"
          value={String(kpis.dueThisMonth)}
          sublabel="in the next 30 days"
          icon={ListChecks}
          accent="muted"
          delay={0.15}
        />
      </div>

      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-end justify-between mb-3">
              <div>
                <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
                  Top 10 highest-risk ARs
                </div>
                <h2 className="text-lg font-semibold leading-tight mt-0.5">
                  Where to look first
                </h2>
              </div>
              <Link
                href="/demo/principal/register"
                className="text-sm font-medium text-primary hover:underline"
              >
                See all →
              </Link>
            </div>
            <TopRiskTable ars={kpis.topRisk} />
          </div>
        </div>
        <div className="space-y-4">
          <Card className="p-5">
            <BreachHeatmap data={kpis.breachActivity90d} />
          </Card>
          <NextActions actions={actions} />
        </div>
      </div>

      <Card className="p-5">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
              File-review completion · last 12 weeks
            </div>
            <div className="text-lg font-semibold tabular-nums leading-tight mt-0.5">
              {kpis.completedReviewsThisMonth} reviews this month
            </div>
          </div>
          <span className="text-[11px] text-muted-foreground">
            12 weeks rolling
          </span>
        </div>
        <Sparkline
          data={[6, 4, 8, 5, 9, 7, 11, 8, 6, 9, 12, kpis.completedReviewsThisMonth]}
          height={64}
          fill
        />
      </Card>
    </div>
  );
}
