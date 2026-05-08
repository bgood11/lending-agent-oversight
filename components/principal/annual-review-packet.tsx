"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  PenLine,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ClipboardList,
  ScrollText,
  Activity,
} from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDemoStore } from "@/lib/state";
import { SKINS } from "@/lib/skins";
import {
  getDataset,
  FIXED_NOW_TS,
} from "@/lib/fixtures";
import { Sparkline } from "./sparkline";
import { RiskGauge } from "./risk-gauge";
import { RiskBandBadge } from "./risk-band-badge";
import { BreachSeverityBadge } from "./breach-severity-badge";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "overview", label: "Overview", Icon: ScrollText },
  { id: "risk-trajectory", label: "Risk trajectory", Icon: TrendingUp },
  { id: "breaches", label: "Breach summary", Icon: AlertTriangle },
  { id: "file-reviews", label: "File reviews", Icon: ClipboardList },
  { id: "mi", label: "MI return trend", Icon: Activity },
  { id: "conduct", label: "Consumer Duty", Icon: CheckCircle2 },
  { id: "sign-off", label: "Director sign-off", Icon: PenLine },
];

export function AnnualReviewPacket({ arId }: { arId: string }) {
  const skin = useDemoStore((s) => s.skin);
  const skinDef = SKINS[skin];
  const dataset = getDataset(skin);
  const ar = dataset.ars.find((a) => a.id === arId);
  const [activeSection, setActiveSection] = useState("overview");
  const [signedOff, setSignedOff] = useState(false);
  const advance = useDemoStore((s) => s.advanceWalkthrough);

  if (!ar) return <NotFound />;

  const breaches = dataset.breaches.filter((b) => b.arId === arId);
  const reviews = dataset.reviews.filter((r) => r.arId === arId);
  const mi = dataset.miReturns.filter((m) => m.arId === arId);

  const riskTrajectory = useMemo(() => {
    // Twelve monthly snapshots ending at current score
    const result: number[] = [];
    let s = ar.riskScore + 5;
    for (let i = 0; i < 12; i++) {
      const drift = ((Math.sin(i * 1.7 + arId.length) * 6) - 3);
      s = Math.max(0, Math.min(100, s + drift));
      result.push(s);
    }
    result[result.length - 1] = ar.riskScore;
    return result;
  }, [ar.riskScore, arId]);

  const reviewAvg = Math.round(
    reviews.reduce((s, r) => s + r.score, 0) / Math.max(1, reviews.length),
  );
  const breachesByYear = breaches.length;
  const totalGBP = mi.reduce((s, m) => s + m.metrics.newBusinessVolumeGBP, 0) / 100;
  const totalComplaints = mi.reduce((s, m) => s + m.metrics.complaintsReceived, 0);

  function signOff() {
    setSignedOff(true);
    advance();
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6">
      <Link
        href={`/demo/principal/register/${ar.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        AR detail
      </Link>

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 mt-4 mb-6">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
            SUP 12.6A annual fitness review · {new Date().getFullYear() - 1} cycle
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-medium leading-tight tracking-tight mt-1">
            {ar.tradingName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Aggregated across the year for board sign-off. Feeds the firm-level
            self-assessment under PS22/11 and the annual Consumer Duty board report.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5">
            <Download className="size-4" />
            Print PDF
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[200px_minmax(0,1fr)] gap-8">
        {/* Anchor rail */}
        <nav className="hidden lg:block sticky top-20 self-start space-y-1">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setActiveSection(s.id);
                document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={cn(
                "w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                activeSection === s.id
                  ? "bg-amber-soft/50 text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <s.Icon className="size-3.5" />
              {s.label}
            </button>
          ))}
        </nav>

        <div className="space-y-6">
          {/* Overview */}
          <Section id="overview" title="Overview">
            <Card className="p-5 grid sm:grid-cols-3 gap-4">
              <Stat label="Current risk score" value={`${Math.round(ar.riskScore)} / 100`} valueExtra={<RiskBandBadge band={ar.riskBand} />} />
              <Stat label="File-review average" value={`${reviewAvg} / 100`} valueExtra={<span className="text-[11px] text-muted-foreground">across {reviews.length} reviews</span>} />
              <Stat label="Breaches this cycle" value={String(breachesByYear)} valueExtra={<span className="text-[11px] text-muted-foreground">{breaches.filter(b => b.notifiedFcaAt).length} notified to FCA</span>} />
              <Stat label="New business" value={`£${(totalGBP / 1_000_000).toFixed(1)}m`} />
              <Stat label="Complaints" value={String(totalComplaints)} />
              <Stat label="Permissions" value={String(ar.permissions.length)} />
            </Card>
          </Section>

          {/* Risk trajectory */}
          <Section id="risk-trajectory" title="Risk trajectory">
            <Card className="p-5">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
                    Monthly composite score · last 12 months
                  </div>
                  <div className="text-3xl font-bold tabular-nums leading-tight mt-0.5">
                    {Math.round(ar.riskScore)}
                  </div>
                </div>
                <RiskGauge score={ar.riskScore} size="md" />
              </div>
              <Sparkline data={riskTrajectory} height={120} fill stroke="var(--brand-primary)" />
            </Card>
          </Section>

          {/* Breaches */}
          <Section id="breaches" title="Breach summary">
            <Card className="overflow-hidden">
              {breaches.length === 0 ? (
                <div className="p-8 text-sm text-muted-foreground text-center">
                  Clean record. No breaches reported in this cycle.
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {breaches.slice(0, 8).map((b) => (
                    <li key={b.id} className="px-5 py-3">
                      <div className="flex items-start gap-2 flex-wrap">
                        <BreachSeverityBadge severity={b.severity} />
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {b.category.replace(/-/g, " ")}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {b.status.replace(/-/g, " ")}
                        </Badge>
                        <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">
                          {new Date(b.reportedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <div className="text-sm font-medium mt-1.5">{b.title}</div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </Section>

          {/* File reviews */}
          <Section id="file-reviews" title="File review summary">
            <Card className="p-5 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <Stat label="Reviews completed" value={String(reviews.length)} />
                <Stat label="Average score" value={`${reviewAvg} / 100`} />
                <Stat
                  label="Failing scores (<65)"
                  value={String(reviews.filter((r) => r.score < 65).length)}
                />
              </div>
              <Separator />
              <Sparkline
                data={reviews
                  .slice()
                  .sort((a, b) => (a.completedAt ?? "").localeCompare(b.completedAt ?? ""))
                  .slice(-12)
                  .map((r) => r.score)}
                height={64}
                fill
              />
              <div className="text-[11px] text-muted-foreground text-center">
                Last 12 reviews
              </div>
            </Card>
          </Section>

          {/* MI returns */}
          <Section id="mi" title="MI return trend">
            <Card className="p-5">
              <div className="grid sm:grid-cols-4 gap-3">
                {mi
                  .slice()
                  .sort((a, b) =>
                    a.period.year !== b.period.year
                      ? a.period.year - b.period.year
                      : a.period.quarter - b.period.quarter,
                  )
                  .slice(-4)
                  .map((m) => (
                    <div
                      key={m.id}
                      className="rounded-md border border-border p-3 text-sm"
                    >
                      <div className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
                        {m.period.year} Q{m.period.quarter}
                      </div>
                      <div className="text-base font-semibold tabular-nums mt-1">
                        {formatPounds(m.metrics.newBusinessVolumeGBP / 100)}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {m.metrics.complaintsReceived}{" "}
                        {m.metrics.complaintsReceived === 1 ? "complaint" : "complaints"} ·{" "}
                        {m.metrics.breachesSelfReported}{" "}
                        {m.metrics.breachesSelfReported === 1 ? "breach" : "breaches"}
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </Section>

          {/* Consumer Duty */}
          <Section id="conduct" title="Consumer Duty outcomes">
            <Card className="p-5 grid sm:grid-cols-2 gap-3">
              <Outcome
                label="Products and services"
                status="On track"
                note="Target market alignment confirmed for all distributed products."
              />
              <Outcome
                label="Price and value"
                status="On track"
                note="Fee structure within firm-wide fair-value benchmark."
              />
              <Outcome
                label="Consumer understanding"
                status={reviewAvg < 70 ? "Watch" : "On track"}
                note={reviewAvg < 70
                  ? "Two reviews flagged disclosure-quality concerns. Action plan agreed."
                  : "Communications-quality scores in line with cohort."}
              />
              <Outcome
                label="Consumer support"
                status="On track"
                note={`${totalComplaints} complaints over the cycle. ${Math.round((totalComplaints / Math.max(1, mi.reduce((s,m)=>s+m.metrics.complaintsUpheld,0))) * 100)}% upheld; root causes addressed.`}
              />
            </Card>
          </Section>

          {/* Sign-off */}
          <Section id="sign-off" title="Director sign-off">
            <Card className={cn(
              "p-6",
              signedOff && "border-emerald-500/30 bg-emerald-500/5",
            )}>
              {!signedOff ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    By signing off this annual fitness review packet you confirm that, in
                    accordance with SUP 12.6A.5R, you have considered the AR&apos;s activity,
                    business, fitness and propriety, and the Consumer Duty outcomes set
                    out above. The sign-off is recorded in the audit chain with director
                    attribution and timestamp.
                  </p>
                  <div className="grid sm:grid-cols-[1fr_auto] gap-3">
                    <textarea
                      placeholder="Optional sign-off note"
                      rows={3}
                      className="w-full text-sm rounded-md border border-input bg-transparent px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                    <Button onClick={signOff} className="gap-1.5 self-start">
                      <PenLine className="size-4" />
                      Confirm sign-off
                    </Button>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="size-10 rounded-full bg-emerald-500 text-white grid place-items-center shrink-0">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div>
                    <div className="font-medium">Signed off</div>
                    <div className="text-[11px] text-muted-foreground tabular-nums mt-0.5">
                      {new Date().toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} · audit-chain entry written
                    </div>
                  </div>
                </motion.div>
              )}
            </Card>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Stat({
  label,
  value,
  valueExtra,
}: {
  label: string;
  value: string;
  valueExtra?: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
        {label}
      </div>
      <div className="text-xl font-bold tabular-nums leading-tight mt-1">
        {value}
      </div>
      {valueExtra && <div className="mt-1">{valueExtra}</div>}
    </div>
  );
}

function Outcome({
  label,
  status,
  note,
}: {
  label: string;
  status: "On track" | "Watch" | "Action needed";
  note: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{label}</div>
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] capitalize",
            status === "On track" && "border-emerald-500/40 text-emerald-700 dark:text-emerald-400",
            status === "Watch" && "border-amber/40 text-amber-foreground",
            status === "Action needed" && "border-destructive/40 text-destructive",
          )}
        >
          {status}
        </Badge>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
        {note}
      </p>
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-md text-center py-20 px-6">
      <h1 className="text-xl font-semibold">AR not found</h1>
      <Link
        href="/demo/principal/register"
        className="inline-flex items-center gap-1 mt-4 text-sm text-primary font-medium hover:underline"
      >
        <ArrowLeft className="size-4" />
        Back to register
      </Link>
    </div>
  );
}

function formatPounds(value: number): string {
  if (value >= 1_000_000) {
    return `£${(value / 1_000_000).toFixed(1)}m`;
  }
  if (value >= 1_000) {
    return `£${(value / 1_000).toFixed(0)}k`;
  }
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}
