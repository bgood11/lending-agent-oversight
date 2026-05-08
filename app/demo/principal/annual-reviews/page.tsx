"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDemoStore } from "@/lib/state";
import { SKINS } from "@/lib/skins";
import { getDataset, FIXED_NOW_TS } from "@/lib/fixtures";
import { RiskBandBadge } from "@/components/principal/risk-band-badge";

export default function AnnualReviewsListPage() {
  const skin = useDemoStore((s) => s.skin);
  const skinDef = SKINS[skin];
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;

  const dataset = getDataset(skin);
  const ars = useMemo(
    () =>
      [...dataset.ars]
        .filter((a) => a.status !== "terminated")
        .sort(
          (a, b) =>
            new Date(a.nextReviewDueAt).getTime() -
            new Date(b.nextReviewDueAt).getTime(),
        ),
    [dataset.ars],
  );

  const overdue = ars.filter(
    (a) => new Date(a.nextReviewDueAt).getTime() < FIXED_NOW_TS,
  );
  const dueSoon = ars.filter((a) => {
    const t = new Date(a.nextReviewDueAt).getTime();
    return t >= FIXED_NOW_TS && t - FIXED_NOW_TS < 30 * 24 * 3600_000;
  });

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 space-y-5">
      <Link
        href="/demo/principal"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Compliance home
      </Link>

      <div>
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
          {skinDef.shortName} · SUP 12.6A annual fitness reviews
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold leading-tight mt-1">
          Annual reviews
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Every AR&apos;s annual fitness review packet. Sorted by next-review-due, oldest first. Drill in to see the aggregated picture, sign off, and feed the firm-level board pack.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MiniTile label="Overdue" value={overdue.length} accent={overdue.length > 0 ? "destructive" : "muted"} />
        <MiniTile label="Due in 30 days" value={dueSoon.length} accent="amber" />
        <MiniTile label="Total ARs" value={ars.length} accent="muted" />
      </div>

      <div className="rounded-lg border border-border overflow-x-auto bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>AR</TableHead>
              <TableHead className="text-right">Risk</TableHead>
              <TableHead>Band</TableHead>
              <TableHead>Next review due</TableHead>
              <TableHead className="hidden md:table-cell">Last reviewed</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {ars.slice(0, 50).map((ar) => {
              const due = new Date(ar.nextReviewDueAt).getTime();
              const days = Math.floor((due - FIXED_NOW_TS) / (24 * 3600_000));
              const isOverdue = days < 0;
              return (
                <TableRow
                  key={ar.id}
                  className="cursor-pointer hover:bg-foreground/[0.03] transition-colors"
                >
                  <TableCell>
                    <Link
                      href={`/demo/principal/annual-reviews/${ar.id}`}
                      className="block"
                    >
                      <div className="font-medium leading-tight max-w-[260px] truncate">
                        {ar.tradingName}
                      </div>
                      <div className="text-[11px] text-muted-foreground tabular-nums">
                        {ar.frn ? `FRN ${ar.frn}` : "via principal"} · {ar.type}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-bold tabular-nums">
                    {Math.round(ar.riskScore)}
                  </TableCell>
                  <TableCell>
                    <RiskBandBadge band={ar.riskBand} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        isOverdue
                          ? "border-destructive/40 text-destructive"
                          : days < 30
                            ? "border-amber/40 text-amber-foreground"
                            : ""
                      }
                    >
                      <Calendar className="size-3 mr-1" />
                      {isOverdue
                        ? `Overdue ${Math.abs(days)}d`
                        : `Due in ${days}d`}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {ar.lastAnnualReviewAt
                      ? new Date(ar.lastAnnualReviewAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Not yet"}
                  </TableCell>
                  <TableCell>
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function MiniTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "destructive" | "amber" | "muted";
}) {
  const accentClass =
    accent === "destructive"
      ? "bg-destructive/10 text-destructive"
      : accent === "amber"
        ? "bg-amber-soft text-amber-foreground"
        : "bg-muted text-muted-foreground";
  return (
    <Card className="p-4">
      <div className={`size-7 rounded-md grid place-items-center ${accentClass}`}>
        <Calendar className="size-3.5" />
      </div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mt-2">
        {label}
      </div>
      <div className="text-2xl font-bold tabular-nums leading-tight mt-0.5">
        {value}
      </div>
    </Card>
  );
}
