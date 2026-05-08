"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Clock, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemoStore } from "@/lib/state";
import { getDataset, FIXED_NOW_TS } from "@/lib/fixtures";
import type { BreachReport, BreachStatus, BreachSeverity } from "@/lib/types";
import { BreachSeverityBadge } from "./breach-severity-badge";

export function BreachTriageQueue() {
  const skin = useDemoStore((s) => s.skin);
  const router = useRouter();

  const allFromFixtures = useMemo(() => getDataset(skin).breaches, [skin]);
  const liveBreaches = useDemoStore((s) => s.liveBreaches);
  const all = useMemo(
    () => [...liveBreaches, ...allFromFixtures],
    [allFromFixtures, liveBreaches],
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BreachStatus | "all">("all");
  const [severity, setSeverity] = useState<BreachSeverity | "all">("all");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return all.filter((b) => {
      if (status !== "all" && b.status !== status) return false;
      if (severity !== "all" && b.severity !== severity) return false;
      if (term.length > 0) {
        const hay = `${b.title} ${b.description} ${b.category}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [all, search, status, severity]);

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        // Open + nearest deadline first
        const aOverdue = a.notifyByAt && new Date(a.notifyByAt).getTime() < FIXED_NOW_TS && !a.notifiedFcaAt;
        const bOverdue = b.notifyByAt && new Date(b.notifyByAt).getTime() < FIXED_NOW_TS && !b.notifiedFcaAt;
        if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;
        if (a.status === "open" && b.status !== "open") return -1;
        if (b.status === "open" && a.status !== "open") return 1;
        return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
      }),
    [filtered],
  );

  const awaiting = all.filter(
    (b) => !b.notifiedFcaAt && b.notifyByAt,
  );
  const overdue = awaiting.filter(
    (b) => new Date(b.notifyByAt!).getTime() < FIXED_NOW_TS,
  );
  const closedRecently = all.filter((b) => {
    if (b.status !== "closed") return false;
    const t = new Date(b.reportedAt).getTime();
    return FIXED_NOW_TS - t < 7 * 24 * 3600_000;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <MiniTile label="Awaiting FCA" value={awaiting.length} accent="amber" />
        <MiniTile label="Overdue" value={overdue.length} accent={overdue.length > 0 ? "destructive" : "muted"} />
        <MiniTile label="Closed last 7 days" value={closedRecently.length} accent="muted" />
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_180px_180px]">
        <div className="grid gap-1.5">
          <Label htmlFor="search" className="text-xs text-muted-foreground">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Title, description, category…"
              className="pl-9"
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus((v as BreachStatus | "all" | null) ?? "all")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-remediation">In remediation</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs text-muted-foreground">Severity</Label>
          <Select
            value={severity}
            onValueChange={(v) => setSeverity((v as BreachSeverity | "all" | null) ?? "all")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severities</SelectItem>
              <SelectItem value="significant">Significant</SelectItem>
              <SelectItem value="material">Material</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="minor">Minor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Showing <span className="text-foreground font-medium tabular-nums">{sorted.length}</span> of{" "}
        <span className="tabular-nums">{all.length}</span> breaches
      </div>

      <div className="rounded-lg border border-border overflow-x-auto bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead>SUP 15</TableHead>
              <TableHead className="hidden lg:table-cell">Reported</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.slice(0, 50).map((b) => (
              <BreachRow
                key={b.id}
                breach={b}
                onClick={() => router.push(`/demo/principal/breaches/${b.id}`)}
              />
            ))}
          </TableBody>
        </Table>
        {sorted.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No breaches match these filters.
          </div>
        )}
      </div>
    </div>
  );
}

function BreachRow({
  breach,
  onClick,
}: {
  breach: BreachReport;
  onClick: () => void;
}) {
  const notifyBy = breach.notifyByAt ? new Date(breach.notifyByAt).getTime() : null;
  const notified = breach.notifiedFcaAt !== null;
  const overdue = !notified && notifyBy !== null && notifyBy < FIXED_NOW_TS;
  const remainingDays = notifyBy !== null
    ? Math.floor((notifyBy - FIXED_NOW_TS) / (24 * 3600_000))
    : null;

  return (
    <TableRow
      onClick={onClick}
      className="cursor-pointer hover:bg-foreground/[0.03] transition-colors"
    >
      <TableCell>
        <div className="font-medium leading-tight max-w-[320px] truncate">
          {breach.title}
        </div>
        <div className="text-[11px] text-muted-foreground mt-0.5">
          AR {breach.arId.split("-").slice(-1)[0]}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge variant="outline" className="text-[10px] capitalize">
          {breach.category.replace(/-/g, " ")}
        </Badge>
      </TableCell>
      <TableCell>
        <BreachSeverityBadge severity={breach.severity} />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge variant="outline" className="text-[10px] capitalize">
          {breach.status.replace(/-/g, " ")}
        </Badge>
      </TableCell>
      <TableCell>
        {notified ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
            ✓ Notified
          </span>
        ) : notifyBy === null ? (
          <span className="text-[11px] text-muted-foreground">N/A</span>
        ) : overdue ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-destructive tabular-nums">
            <Clock className="size-3" />
            {Math.abs(remainingDays!)}d overdue
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-foreground tabular-nums">
            <Clock className="size-3" />
            {remainingDays}d left
          </span>
        )}
      </TableCell>
      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
        {fmtRelative(breach.reportedAt)}
      </TableCell>
      <TableCell>
        <ArrowUpRight className="size-4 text-muted-foreground" />
      </TableCell>
    </TableRow>
  );
}

function MiniTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "amber" | "destructive" | "muted";
}) {
  const accentClass =
    accent === "amber"
      ? "bg-amber-soft text-amber-foreground"
      : accent === "destructive"
        ? "bg-destructive/10 text-destructive"
        : "bg-muted text-muted-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className={`size-7 rounded-md grid place-items-center ${accentClass}`}>
        <Clock className="size-3.5" />
      </div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mt-2">
        {label}
      </div>
      <div className="text-2xl font-bold tabular-nums leading-tight mt-0.5">
        {value}
      </div>
    </div>
  );
}

function fmtRelative(iso: string): string {
  const days = Math.floor((FIXED_NOW_TS - new Date(iso).getTime()) / (24 * 3600_000));
  if (days <= 0) return "Just now";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  return `${Math.round(days / 30)}mo ago`;
}
