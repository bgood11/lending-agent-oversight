"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ClipboardCheck, Clock } from "lucide-react";
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
import type { FileReview } from "@/lib/types";

export function FileReviewWorkspace() {
  const skin = useDemoStore((s) => s.skin);
  const skinDef = SKINS[skin];
  const dataset = getDataset(skin);
  const router = useRouter();

  const reviews = useMemo(
    () =>
      [...dataset.reviews]
        .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""))
        .slice(0, 60),
    [dataset.reviews],
  );

  const avgScore = useMemo(
    () =>
      Math.round(
        dataset.reviews.reduce((s, r) => s + r.score, 0) /
          Math.max(1, dataset.reviews.length),
      ),
    [dataset.reviews],
  );

  const reviewsThisMonth = useMemo(
    () =>
      dataset.reviews.filter((r) => {
        if (!r.completedAt) return false;
        return FIXED_NOW_TS - new Date(r.completedAt).getTime() < 30 * 24 * 3600_000;
      }).length,
    [dataset.reviews],
  );

  const failingReviews = useMemo(
    () => dataset.reviews.filter((r) => r.score < 65).length,
    [dataset.reviews],
  );

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
          {skinDef.shortName} · {skinDef.rubric} rubric
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold leading-tight mt-1">
          File review workspace
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Cases sampled for review across the network. Each scored against the {skinDef.rubric} regulatory rubric. Aggregate findings flow into AR-level risk scores and root-cause analysis.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MiniTile
          icon={ClipboardCheck}
          label="Average score"
          value={`${avgScore}/100`}
          accent="muted"
        />
        <MiniTile
          icon={Clock}
          label="Reviews this month"
          value={String(reviewsThisMonth)}
          accent="primary"
        />
        <MiniTile
          icon={ClipboardCheck}
          label="Failing scores (<65)"
          value={String(failingReviews)}
          accent={failingReviews > 5 ? "destructive" : "muted"}
        />
      </div>

      <div className="rounded-lg border border-border overflow-x-auto bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case ref</TableHead>
              <TableHead className="hidden md:table-cell">AR</TableHead>
              <TableHead className="hidden md:table-cell">Reviewer</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Completed</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((r) => (
              <ReviewRow
                key={r.id}
                review={r}
                onClick={() => router.push(`/demo/principal/reviews/${r.id}`)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ReviewRow({
  review,
  onClick,
}: {
  review: FileReview;
  onClick: () => void;
}) {
  const scoreColor =
    review.score >= 80
      ? "text-emerald-600"
      : review.score >= 65
        ? "text-foreground"
        : "text-[color:var(--severity-high)]";
  return (
    <TableRow
      onClick={onClick}
      className="cursor-pointer hover:bg-foreground/[0.03] transition-colors"
    >
      <TableCell>
        <div className="font-mono text-xs">{review.caseRef}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">
          {review.rubricCode}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
        {review.arId.split("-").slice(-1)[0]}
      </TableCell>
      <TableCell className="hidden md:table-cell text-sm">
        {review.reviewerName}
      </TableCell>
      <TableCell className={`text-right font-bold tabular-nums ${scoreColor}`}>
        {review.score}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-[10px] capitalize">
          {review.status.replace(/-/g, " ")}
        </Badge>
      </TableCell>
      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
        {review.completedAt
          ? new Date(review.completedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })
          : "In progress"}
      </TableCell>
      <TableCell>
        <ArrowUpRight className="size-4 text-muted-foreground" />
      </TableCell>
    </TableRow>
  );
}

function MiniTile({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: "primary" | "destructive" | "muted";
}) {
  const accentClass =
    accent === "primary"
      ? "bg-primary/10 text-primary"
      : accent === "destructive"
        ? "bg-destructive/10 text-destructive"
        : "bg-muted text-muted-foreground";
  return (
    <Card className="p-4">
      <div className={`size-7 rounded-md grid place-items-center ${accentClass}`}>
        <Icon className="size-3.5" />
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
