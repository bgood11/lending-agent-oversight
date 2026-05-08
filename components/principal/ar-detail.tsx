"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  getArs,
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

      {/* Header — spatial composition rebuild
          Three zones replacing the badges-and-h1 wall: identity card
          with a brand-tinted wash, risk gauge centre, "next 30 days"
          timeline card right. The composition gives each piece its
          own breathing room and makes the AR's identity, risk
          posture, and upcoming obligations independently legible. */}
      <header className="grid lg:grid-cols-[minmax(0,1.5fr)_auto_minmax(0,1fr)] gap-3 items-stretch">
        {/* Identity card */}
        <Card className="relative overflow-hidden p-6">
          <div
            aria-hidden
            className="absolute -top-16 -right-16 size-56 rounded-full opacity-[0.10] blur-3xl"
            style={{ background: "var(--brand-primary)" }}
          />
          <div className="relative space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className="font-mono text-[10px] uppercase tracking-wider tabular-nums"
                style={{
                  background:
                    "color-mix(in oklch, var(--brand-primary) 8%, transparent)",
                  color: "var(--brand-primary)",
                  borderColor:
                    "color-mix(in oklch, var(--brand-primary) 25%, transparent)",
                }}
              >
                {ar.frn ? `FRN ${ar.frn}` : "Via principal"}
              </Badge>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                {ar.type}
              </Badge>
              <StatusChip status={ar.status} />
              {ar.isSelfEmployed && (
                <Badge variant="outline" className="text-[10px]">
                  Self-employed
                </Badge>
              )}
              {ar.supportsImportantBusinessService && (
                <Badge variant="outline" className="text-[10px] gap-1">
                  <ShieldCheck className="size-3" />
                  IBS
                </Badge>
              )}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-medium leading-[1.05] tracking-tight">
              {ar.tradingName}
            </h1>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <div>{ar.legalName}</div>
              <div className="text-[12px]">
                {ar.city} · supervised by{" "}
                <span className="font-medium text-foreground">
                  {skinDef.shortName}
                </span>
              </div>
            </div>
            <div className="pt-1 border-t border-border/60 text-[11px] text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <motion.span
                  className="size-1.5 rounded-full bg-emerald-500"
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                />
                Auto-enriched
              </span>
              <span>· Companies House 4h</span>
              <span>· FCA Register 12h</span>
              <span>· CreditSafe 2d</span>
            </div>
          </div>
        </Card>

        {/* Risk gauge zone */}
        <Card className="p-6 grid place-items-center min-w-[220px]">
          <div className="flex flex-col items-center gap-2.5">
            <RiskGauge score={ar.riskScore} size="lg" />
            <RiskBandBadge band={ar.riskBand} />
            <RiskDeltaTick arId={ar.id} score={ar.riskScore} />
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground/70 font-medium">
              composite · five inputs
            </div>
          </div>
        </Card>

        {/* Next 30 days timeline */}
        <Card className="p-5 space-y-2.5 lg:max-w-xs">
          <div className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
            Next 30 days
          </div>
          <div className="space-y-2.5">
            <TimelineRow
              label="Fitness review"
              date={fmtShort(ar.nextReviewDueAt)}
              days={nextReviewDays}
              destructive={reviewOverdue}
            />
            {breaches.filter((b) => b.notifyByAt && !b.notifiedFcaAt).slice(0, 1).map((b) => (
              <TimelineRow
                key={b.id}
                label="FCA notification"
                date={fmtShort(b.notifyByAt!)}
                days={Math.floor(
                  (new Date(b.notifyByAt!).getTime() - FIXED_NOW_TS) /
                    (24 * 3600_000),
                )}
                destructive
              />
            ))}
            <TimelineRow
              label="Q2 MI return"
              date="15 Aug 2026"
              days={99}
            />
          </div>
        </Card>
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

function fmtShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function RiskDeltaTick({
  arId,
  score,
}: {
  arId: string;
  score: number;
}) {
  // Deterministic 14-day delta from the AR id seed. Range [-7, +7],
  // skewed slightly upward so movement is the visible default —
  // gives the principal-side eye a "this AR is moving" signal that
  // the existing risk-trajectory data backs up in production.
  const seed = Array.from(arId).reduce((a, c) => a + c.charCodeAt(0), 0);
  const delta = (seed % 15) - 7;
  if (delta === 0) {
    return (
      <div className="text-[11px] text-muted-foreground tabular-nums">
        Steady · last 14 days
      </div>
    );
  }
  const up = delta > 0;
  // For risk score, up is bad. Coloured accordingly.
  const colour = up
    ? "var(--severity-high)"
    : "var(--severity-low)";
  return (
    <div
      className="text-[11px] font-medium tabular-nums inline-flex items-center gap-1"
      style={{ color: colour }}
      title={`Composite score moved ${up ? "up" : "down"} ${Math.abs(delta)} points in the last 14 days. Previous score was ${Math.round(score - delta)}.`}
    >
      <span aria-hidden>{up ? "▲" : "▼"}</span>
      {up ? "+" : ""}
      {delta} <span className="text-muted-foreground font-normal">last 14 days</span>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    "pending-appointment":
      "bg-amber-soft text-amber-foreground border-amber/30",
    suspended: "bg-muted text-muted-foreground border-border",
    "under-investigation":
      "bg-destructive/10 text-destructive border-destructive/30",
    terminated: "bg-muted/50 text-muted-foreground border-border line-through",
  };
  return (
    <Badge
      variant="outline"
      className={`text-[10px] capitalize ${map[status] ?? ""}`}
    >
      {status.replace(/-/g, " ")}
    </Badge>
  );
}

function TimelineRow({
  label,
  date,
  days,
  destructive,
}: {
  label: string;
  date: string;
  days: number;
  destructive?: boolean;
}) {
  const overdue = days < 0;
  return (
    <div className="flex items-center gap-3">
      <div
        className={`size-1.5 rounded-full shrink-0 ${
          destructive || overdue
            ? "bg-destructive"
            : days < 14
              ? "bg-amber"
              : "bg-emerald-500"
        }`}
        aria-hidden
      />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium leading-tight truncate">{label}</div>
        <div
          className={`text-[10px] tabular-nums ${
            destructive || overdue ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {date} · {overdue ? `${Math.abs(days)}d overdue` : `in ${days}d`}
        </div>
      </div>
    </div>
  );
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
  const router = useRouter();
  // Bounce to the highest-risk active AR in this skin's set after 1.4s.
  // Anyone hitting an unknown id (cold-pasted URL, stale link from a
  // sibling product, manual fishing for /ar-001 style ids) lands on
  // a real surface rather than a dead end.
  useEffect(() => {
    const ars = getArs(skin as "heritage" | "crown" | "pinpoint");
    const fallback = [...ars]
      .filter((a) => a.status === "active")
      .sort((a, b) => b.riskScore - a.riskScore)[0];
    if (!fallback) return;
    const id = setTimeout(() => {
      router.replace(`/demo/principal/register/${fallback.id}`);
    }, 1400);
    return () => clearTimeout(id);
  }, [skin, router]);

  return (
    <div className="mx-auto max-w-md text-center py-20 px-6">
      <h1 className="text-xl font-semibold">AR not found</h1>
      <p className="text-sm text-muted-foreground mt-2">
        This AR may have been terminated or belong to a different principal
        firm. Showing the highest-risk active AR instead in a moment.
      </p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Link
          href="/demo/principal/register"
          className="inline-flex items-center gap-1 mt-4 text-sm text-primary font-medium hover:underline"
        >
          <ArrowLeft className="size-4" />
          Or jump to the AR register
        </Link>
      </motion.div>
    </div>
  );
}
