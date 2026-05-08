"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AppointedRep } from "@/lib/types";
import { useDemoStore } from "@/lib/state";
import { RiskBandBadge } from "./risk-band-badge";
import { Sparkline } from "./sparkline";

/**
 * Generate a 30-day risk-score trajectory for the sparkline. Demo
 * data: produce a small wobble around the AR's current score.
 */
function trajectoryFor(score: number): number[] {
  const seed = Math.floor(score * 7);
  const rand = (n: number) => ((Math.sin(seed + n * 1.3) + 1) / 2);
  return Array.from({ length: 14 }, (_, i) => {
    const wobble = (rand(i) - 0.5) * 8;
    return Math.max(0, Math.min(100, score + wobble - (14 - i) * 0.2));
  });
}

export function TopRiskTable({ ars }: { ars: AppointedRep[] }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Trading name</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="hidden md:table-cell w-32">30-day trend</TableHead>
            <TableHead>Band</TableHead>
            <TableHead className="hidden lg:table-cell">Last reviewed</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {ars.map((ar, i) => (
            <ArRow key={ar.id} ar={ar} rank={i + 1} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ArRow({ ar, rank }: { ar: AppointedRep; rank: number }) {
  const setFocusedArId = useDemoStore((s) => s.setFocusedArId);
  const trajectory = trajectoryFor(ar.riskScore);
  const lastReviewedDays = ar.lastAnnualReviewAt
    ? Math.floor(
        (new Date("2026-05-08T18:00:00Z").getTime() -
          new Date(ar.lastAnnualReviewAt).getTime()) /
          (24 * 3600_000),
      )
    : null;

  return (
    <TableRow className="group cursor-pointer hover:bg-foreground/[0.03] transition-colors">
      <TableCell className="text-xs text-muted-foreground tabular-nums">
        {rank}
      </TableCell>
      <TableCell>
        <Link
          href={`/demo/principal/register/${ar.id}`}
          onClick={() => setFocusedArId(ar.id)}
          className="block"
        >
          <div className="font-medium leading-tight">{ar.tradingName}</div>
          <div className="text-[11px] text-muted-foreground tabular-nums">
            FRN {ar.frn ?? "via principal"} · {ar.city}
          </div>
        </Link>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
          {ar.type}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <span className="font-bold tabular-nums">{Math.round(ar.riskScore)}</span>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Sparkline
          data={trajectory}
          height={20}
          showLastDot
          fill={false}
          stroke="var(--brand-primary)"
        />
      </TableCell>
      <TableCell>
        <RiskBandBadge band={ar.riskBand} />
      </TableCell>
      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
        {lastReviewedDays === null
          ? "Not yet"
          : lastReviewedDays === 0
            ? "Today"
            : lastReviewedDays === 1
              ? "Yesterday"
              : lastReviewedDays < 30
                ? `${lastReviewedDays} days ago`
                : `${Math.round(lastReviewedDays / 30)}mo ago`}
      </TableCell>
      <TableCell>
        <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </TableCell>
    </TableRow>
  );
}
