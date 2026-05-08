"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Download, Search } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemoStore } from "@/lib/state";
import { getArs } from "@/lib/fixtures";
import type { AppointedRep, ArStatus, RiskBand } from "@/lib/types";
import { RiskBandBadge } from "./risk-band-badge";

const STATUSES: Array<{ value: ArStatus | "all"; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "under-investigation", label: "Under investigation" },
  { value: "terminated", label: "Terminated" },
];

const BANDS: Array<{ value: RiskBand | "all"; label: string }> = [
  { value: "all", label: "All risk bands" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "elevated", label: "Elevated" },
  { value: "moderate", label: "Moderate" },
  { value: "low", label: "Low" },
];

export function ArRegisterTable() {
  const skin = useDemoStore((s) => s.skin);
  const setFocusedArId = useDemoStore((s) => s.setFocusedArId);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ArStatus | "all">("all");
  const [band, setBand] = useState<RiskBand | "all">("all");

  const allArs = useMemo(() => getArs(skin), [skin]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return allArs.filter((a) => {
      if (status !== "all" && a.status !== status) return false;
      if (band !== "all" && a.riskBand !== band) return false;
      if (term.length > 0) {
        const hay = `${a.tradingName} ${a.legalName} ${a.frn ?? ""} ${a.city}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [allArs, search, status, band]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => b.riskScore - a.riskScore),
    [filtered],
  );

  function open(ar: AppointedRep) {
    setFocusedArId(ar.id);
    router.push(`/demo/principal/register/${ar.id}`);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_180px_180px_auto]">
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
              placeholder="Trading name, FRN, city…"
              className="pl-9"
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus((v as ArStatus | "all" | null) ?? "all")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div
          className="grid gap-1.5"
          data-walkthrough="filter-critical"
        >
          <Label className="text-xs text-muted-foreground">Risk band</Label>
          <Select
            value={band}
            onValueChange={(v) => setBand((v as RiskBand | "all" | null) ?? "all")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BANDS.map((b) => (
                <SelectItem key={b.value} value={b.value}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs text-muted-foreground sr-only">Export</Label>
          <Button variant="outline" className="gap-1.5 self-end h-9">
            <Download className="size-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Showing <span className="text-foreground font-medium tabular-nums">{sorted.length}</span> of{" "}
        <span className="tabular-nums">{allArs.length}</span> ARs
      </div>

      <div className="rounded-lg border border-border overflow-x-auto bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trading name</TableHead>
              <TableHead className="hidden sm:table-cell">FRN</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead>Band</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">City</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((ar) => (
              <TableRow
                key={ar.id}
                className="cursor-pointer hover:bg-foreground/[0.03] transition-colors"
                onClick={() => open(ar)}
              >
                <TableCell>
                  <div className="font-medium leading-tight max-w-[260px] truncate">
                    {ar.tradingName}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {ar.contact.name}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-xs tabular-nums text-muted-foreground">
                  {ar.frn ?? "via principal"}
                </TableCell>
                <TableCell>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    {ar.type}
                  </span>
                </TableCell>
                <TableCell className="text-right font-bold tabular-nums">
                  {Math.round(ar.riskScore)}
                </TableCell>
                <TableCell>
                  <RiskBandBadge band={ar.riskBand} />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant={ar.status === "active" ? "secondary" : "outline"}
                    className="text-[10px] capitalize"
                  >
                    {ar.status.replace(/-/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                  {ar.city}
                </TableCell>
                <TableCell>
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {sorted.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No ARs match these filters.
          </div>
        )}
      </div>
    </div>
  );
}
