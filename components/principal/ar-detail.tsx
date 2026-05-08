"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Building,
  Mail,
  User,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  ClipboardList,
  TrendingUp,
  History,
} from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useDemoStore } from "@/lib/state";
import { SKINS } from "@/lib/skins";
import {
  getArById,
  getBreachesForAr,
  getReviewsForAr,
  getMIReturnsForAr,
  FIXED_NOW_TS,
} from "@/lib/fixtures";
import { RiskGauge } from "./risk-gauge";
import { RiskBandBadge } from "./risk-band-badge";
import { BreachSeverityBadge } from "./breach-severity-badge";

export function ArDetail({ arId }: { arId: string }) {
  const skin = useDemoStore((s) => s.skin);
  const ar = getArById(skin, arId);
  const skinDef = SKINS[skin];

  if (!ar) return <NotFound skin={skin} />;

  const breaches = getBreachesForAr(skin, arId);
  const reviews = getReviewsForAr(skin, arId);
  const mi = getMIReturnsForAr(skin, arId);

  const lastReviewedDays = ar.lastAnnualReviewAt
    ? Math.floor((FIXED_NOW_TS - new Date(ar.lastAnnualReviewAt).getTime()) / (24 * 3600_000))
    : null;
  const nextReviewDays = Math.floor(
    (new Date(ar.nextReviewDueAt).getTime() - FIXED_NOW_TS) / (24 * 3600_000),
  );
  const reviewOverdue = nextReviewDays < 0;

  return (
    <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-6 space-y-6">
      <Link
        href="/demo/principal/register"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        AR register
      </Link>

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-start gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {ar.frn ? `FRN ${ar.frn}` : "Via principal"}
            </span>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
              {ar.type}
            </Badge>
            <Badge
              variant={ar.status === "active" ? "secondary" : "outline"}
              className="text-[10px] capitalize"
            >
              {ar.status.replace(/-/g, " ")}
            </Badge>
            {ar.isSelfEmployed && (
              <Badge variant="outline" className="text-[10px]">
                Self-employed
              </Badge>
            )}
            {ar.supportsImportantBusinessService && (
              <Badge variant="outline" className="text-[10px] gap-1">
                <ShieldCheck className="size-3" />
                Important Business Service
              </Badge>
            )}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-medium leading-tight tracking-tight">
            {ar.tradingName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {ar.legalName} · {ar.city} · supervised by {skinDef.shortName}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 shrink-0">
          <RiskGauge score={ar.riskScore} size="lg" />
          <RiskBandBadge band={ar.riskBand} />
        </div>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
        {/* Main: tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-muted/40 flex-wrap h-auto">
            <TabsTrigger value="overview" className="gap-1.5">
              <Building className="size-3.5" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="breaches" className="gap-1.5">
              <AlertTriangle className="size-3.5" />
              Breaches ({breaches.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-1.5">
              <ClipboardList className="size-3.5" />
              File reviews ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="mi" className="gap-1.5">
              <TrendingUp className="size-3.5" />
              MI returns
            </TabsTrigger>
            <TabsTrigger value="conduct" className="gap-1.5">
              <History className="size-3.5" />
              Conduct events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="p-5 space-y-4">
              <SectionLabel>Key facts</SectionLabel>
              <dl className="grid sm:grid-cols-2 gap-3 text-sm">
                <Row label="Appointed on" value={fmtDate(ar.appointedOn)} />
                <Row
                  label="Last fitness review"
                  value={lastReviewedDays === null ? "Not yet reviewed" : `${fmtDate(ar.lastAnnualReviewAt!)} (${lastReviewedDays} days ago)`}
                />
                <Row
                  label="Next review due"
                  value={`${fmtDate(ar.nextReviewDueAt)} ${reviewOverdue ? `(overdue by ${Math.abs(nextReviewDays)} days)` : `(in ${nextReviewDays} days)`}`}
                  destructive={reviewOverdue}
                />
                <Row label="Primary contact" value={ar.contact.name} />
                <Row label="Email" value={ar.contact.email} />
                <Row label="Headquarters" value={ar.city} />
              </dl>
            </Card>

            <Card className="p-5 space-y-4">
              <SectionLabel>Permissions</SectionLabel>
              <ul className="space-y-2">
                {ar.permissions.map((p) => (
                  <li
                    key={p.code}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {p.code}
                      </div>
                      <div className="mt-0.5">{p.label}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      Granted {fmtDate(p.grantedOn)}
                    </Badge>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="breaches">
            <Card className="overflow-hidden">
              {breaches.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Clean record. No breaches reported in the last 12 months.
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {breaches.map((b) => (
                    <li
                      key={b.id}
                      className="px-5 py-4 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex flex-wrap items-start gap-2">
                        <BreachSeverityBadge severity={b.severity} />
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {b.category.replace(/-/g, " ")}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {b.status.replace(/-/g, " ")}
                        </Badge>
                        <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">
                          {fmtRelative(b.reportedAt)}
                        </span>
                      </div>
                      <div className="font-medium leading-snug mt-2">
                        {b.title}
                      </div>
                      {b.notifiedFcaAt && (
                        <div className="text-[11px] text-emerald-600 mt-1">
                          ✓ FCA notified {fmtRelative(b.notifiedFcaAt)}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="overflow-hidden">
              <ul className="divide-y divide-border">
                {reviews
                  .sort((a, b) =>
                    (b.completedAt ?? "").localeCompare(a.completedAt ?? ""),
                  )
                  .slice(0, 12)
                  .map((r) => (
                    <li
                      key={r.id}
                      className="px-5 py-3 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {r.caseRef}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Reviewed by {r.reviewerName} · {fmtRelative(r.completedAt!)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-lg font-bold tabular-nums ${
                            r.score >= 80
                              ? "text-emerald-600"
                              : r.score >= 65
                                ? "text-foreground"
                                : "text-[color:var(--severity-high)]"
                          }`}
                        >
                          {r.score}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {r.rubricCode}
                        </span>
                      </div>
                    </li>
                  ))}
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="mi">
            <Card className="p-5">
              <SectionLabel>Last 8 quarters</SectionLabel>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {mi
                  .slice()
                  .sort((a, b) =>
                    a.period.year !== b.period.year
                      ? a.period.year - b.period.year
                      : a.period.quarter - b.period.quarter,
                  )
                  .map((m) => (
                    <div
                      key={m.id}
                      className="rounded-md border border-border p-3 text-sm"
                    >
                      <div className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
                        {m.period.year} Q{m.period.quarter}
                      </div>
                      <div className="text-base font-semibold tabular-nums mt-1">
                        {(() => {
                          const v = m.metrics.newBusinessVolumeGBP / 100;
                          if (v >= 1_000_000) return `£${(v / 1_000_000).toFixed(1)}m`;
                          if (v >= 1_000) return `£${(v / 1_000).toFixed(0)}k`;
                          return `£${v.toFixed(0)}`;
                        })()}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {m.metrics.newBusinessCount}{" "}
                        {m.metrics.newBusinessCount === 1 ? "case" : "cases"} ·{" "}
                        {m.metrics.complaintsReceived}{" "}
                        {m.metrics.complaintsReceived === 1 ? "complaint" : "complaints"}
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="conduct">
            <Card className="p-5 text-sm text-muted-foreground">
              Conduct events log: training completion records, supervision 1-to-1s, policy attestations, and other events captured against this AR. The fixture set ships a representative sample; production loads from `lib/conduct-events.ts` per-AR.
            </Card>
          </TabsContent>
        </Tabs>

        {/* Right rail */}
        <div className="space-y-4">
          <Card className="p-5">
            <SectionLabel>Next fitness review</SectionLabel>
            <div className="mt-2">
              <div className="flex items-center gap-1.5 text-sm">
                <Calendar className="size-3.5 text-muted-foreground" />
                <span className="font-medium tabular-nums">
                  {fmtDate(ar.nextReviewDueAt)}
                </span>
              </div>
              <div
                className={`text-[11px] mt-1 ${
                  reviewOverdue ? "text-destructive font-medium" : "text-muted-foreground"
                }`}
              >
                {reviewOverdue
                  ? `Overdue by ${Math.abs(nextReviewDays)} days`
                  : `Due in ${nextReviewDays} days`}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 gap-1.5"
                render={<Link href={`/demo/principal/annual-reviews/${ar.id}`} />}
              >
                <ClipboardList className="size-3.5" />
                Open annual packet
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <SectionLabel>Primary contact</SectionLabel>
            <div className="mt-2 space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <User className="size-3.5 text-muted-foreground shrink-0" />
                <span>{ar.contact.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground truncate">{ar.contact.email}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-muted/40 border-dashed">
            <SectionLabel>Persona note</SectionLabel>
            <p className="text-xs text-muted-foreground leading-relaxed mt-2">
              Switch to AR view in the top-right to see {ar.tradingName}&apos;s
              own dashboard, MI return submission, and breach reporting.
              The state stays consistent across the boundary.
            </p>
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

function Row({
  label,
  value,
  destructive,
}: {
  label: string;
  value: string;
  destructive?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground/80 font-medium">
        {label}
      </dt>
      <dd
        className={`text-sm tabular-nums leading-tight mt-0.5 ${
          destructive ? "text-destructive font-medium" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtRelative(iso: string): string {
  const days = Math.floor((FIXED_NOW_TS - new Date(iso).getTime()) / (24 * 3600_000));
  if (days <= 0) return "Just now";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  if (days < 365) return `${Math.round(days / 30)}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}

function NotFound({ skin }: { skin: string }) {
  return (
    <div className="mx-auto max-w-md text-center py-20 px-6">
      <h1 className="text-xl font-semibold">AR not found</h1>
      <p className="text-sm text-muted-foreground mt-2">
        This AR may have been terminated or belong to a different principal firm.
      </p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Link
          href="/demo/principal/register"
          className="inline-flex items-center gap-1 mt-4 text-sm text-primary font-medium hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to AR register
        </Link>
      </motion.div>
    </div>
  );
}
