"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemoStore } from "@/lib/state";
import { SKINS } from "@/lib/skins";
import { getDataset } from "@/lib/fixtures";
import { getRubric, getRubricSections, getRubricLabel, type RubricItem } from "@/lib/rubrics";
import { cn } from "@/lib/utils";

type Outcome = "pass" | "advisory" | "fail" | "n/a";

const OUTCOME_LABEL: Record<Outcome, string> = {
  pass: "Pass",
  advisory: "Advisory",
  fail: "Fail",
  "n/a": "N/A",
};

const OUTCOME_CLASS: Record<Outcome, string> = {
  pass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  advisory: "bg-amber-soft text-amber-foreground border-amber/40",
  fail: "bg-destructive/10 text-destructive border-destructive/40",
  "n/a": "bg-muted text-muted-foreground border-border",
};

export function FileReviewDetail({ reviewId }: { reviewId: string }) {
  const skin = useDemoStore((s) => s.skin);
  const skinDef = SKINS[skin];
  const dataset = getDataset(skin);
  const review = dataset.reviews.find((r) => r.id === reviewId);

  const [findings, setFindings] = useState<Record<string, Outcome>>({});
  const [notes, setNotes] = useState("");
  const [completed, setCompleted] = useState(false);

  if (!review) return <NotFound />;

  const ar = dataset.ars.find((a) => a.id === review.arId);
  const arType = ar?.type ?? "AR";
  const rubric = getRubric(skinDef.rubric, arType);
  const sections = getRubricSections(skinDef.rubric, arType);
  const rubricLabel = getRubricLabel(skinDef.rubric, arType);
  const totalItems = rubric.length;
  const filled = Object.keys(findings).length;
  const passes = Object.values(findings).filter((o) => o === "pass").length;
  const fails = Object.values(findings).filter((o) => o === "fail").length;
  const advisories = Object.values(findings).filter((o) => o === "advisory").length;
  const score = filled === 0
    ? review.score
    : Math.round(
        ((passes + advisories * 0.7) / Math.max(1, filled - Object.values(findings).filter((o) => o === "n/a").length)) *
          100,
      );

  return (
    <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-6 space-y-5">
      <Link
        href="/demo/principal/reviews"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        File review workspace
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
        <div>
          <div className="font-mono text-xs text-muted-foreground tabular-nums">
            {review.caseRef}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-medium leading-tight tracking-tight mt-1">
            File review
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {ar?.tradingName} · {rubricLabel} rubric{arType === "IAR" ? " (introducer scope)" : ""} · reviewed by {review.reviewerName}
          </p>
          {arType === "IAR" && (
            <p className="text-[11px] text-amber-foreground bg-amber-soft/60 border border-amber/30 rounded px-2 py-1 mt-2 inline-block">
              IAR appointment — narrowed rubric. Suitability and affordability items do not apply: an IAR may not give regulated advice, arrange, or deal.
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-3xl font-bold tabular-nums leading-none">
            {score}
            <span className="text-sm font-normal text-muted-foreground ml-1">/100</span>
          </div>
          <div className="text-[11px] text-muted-foreground tabular-nums">
            {filled} of {totalItems} items scored
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-5">
        <div className="space-y-5">
          {sections.map((section) => {
            const items = rubric.filter((i) => i.section === section);
            return (
              <Card key={section} className="overflow-hidden">
                <div className="px-5 py-3 bg-muted/30 border-b border-border">
                  <div className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
                    {section}
                  </div>
                </div>
                <ul className="divide-y divide-border">
                  {items.map((item) => (
                    <RubricRow
                      key={item.code}
                      item={item}
                      outcome={findings[item.code]}
                      onChange={(o) =>
                        setFindings((f) =>
                          o === undefined
                            ? Object.fromEntries(Object.entries(f).filter(([k]) => k !== item.code))
                            : { ...f, [item.code]: o },
                        )
                      }
                      disabled={completed}
                    />
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <Card className="p-5 sticky top-20">
            <div className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
              Score breakdown
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <ScoreLine label="Pass" count={passes} colour="emerald" />
              <ScoreLine label="Advisory" count={advisories} colour="amber" />
              <ScoreLine label="Fail" count={fails} colour="destructive" />
              <ScoreLine
                label="N/A"
                count={Object.values(findings).filter((o) => o === "n/a").length}
                colour="muted"
              />
            </div>
            <Separator className="my-3" />
            <textarea
              placeholder="Reviewer notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              disabled={completed}
              className="w-full text-sm rounded-md border border-input bg-transparent px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-50"
            />
            <Button
              className="w-full mt-3 gap-1.5"
              disabled={filled < totalItems || completed}
              onClick={() => setCompleted(true)}
            >
              <CheckCircle2 className="size-4" />
              {completed ? "Review closed" : "Close review"}
            </Button>
            {filled < totalItems && !completed && (
              <p className="text-[11px] text-muted-foreground mt-2 text-center">
                {totalItems - filled} item{totalItems - filled === 1 ? "" : "s"} remaining
              </p>
            )}
            {completed && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] text-emerald-600 mt-2 text-center"
              >
                ✓ Closed. AR risk score recomputed.
              </motion.p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function RubricRow({
  item,
  outcome,
  onChange,
  disabled,
}: {
  item: RubricItem;
  outcome?: Outcome;
  onChange: (o: Outcome | undefined) => void;
  disabled: boolean;
}) {
  return (
    <li className="px-5 py-3 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[11px] text-muted-foreground">
          {item.code}
        </div>
        <div className="text-sm leading-snug mt-0.5">{item.label}</div>
      </div>
      <Select
        value={outcome ?? ""}
        onValueChange={(v) => onChange((v ?? undefined) as Outcome | undefined)}
        disabled={disabled}
      >
        <SelectTrigger className={cn("w-32 h-9", outcome && OUTCOME_CLASS[outcome])}>
          <SelectValue placeholder="Score…" />
        </SelectTrigger>
        <SelectContent>
          {(["pass", "advisory", "fail", "n/a"] as Outcome[]).map((o) => (
            <SelectItem key={o} value={o}>
              {OUTCOME_LABEL[o]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </li>
  );
}

function ScoreLine({
  label,
  count,
  colour,
}: {
  label: string;
  count: number;
  colour: "emerald" | "amber" | "destructive" | "muted";
}) {
  const dot =
    colour === "emerald"
      ? "bg-emerald-500"
      : colour === "amber"
        ? "bg-amber"
        : colour === "destructive"
          ? "bg-destructive"
          : "bg-muted-foreground/40";
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-muted-foreground">
        <span className={`size-2 rounded-full ${dot}`} aria-hidden />
        {label}
      </span>
      <span className="font-medium tabular-nums">{count}</span>
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-md text-center py-20 px-6">
      <h1 className="text-xl font-semibold">Review not found</h1>
      <Link
        href="/demo/principal/reviews"
        className="inline-flex items-center gap-1 mt-4 text-sm text-primary font-medium hover:underline"
      >
        <ArrowLeft className="size-4" />
        Back to workspace
      </Link>
    </div>
  );
}
