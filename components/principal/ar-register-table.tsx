"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CalendarPlus,
  Download,
  Mail,
  Plus,
  Search,
  X,
} from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "motion/react";
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
  { value: "pending-appointment", label: "Pending appointment" },
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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkConfirm, setBulkConfirm] = useState<null | string>(null);

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const drafts = useDemoStore((s) => s.draftAppointments);
  const allArs = useMemo(() => [...drafts, ...getArs(skin)], [skin, drafts]);

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
    () =>
      [...filtered].sort((a, b) => {
        // Pending appointments float to the top so a freshly-added AR
        // is immediately visible.
        const aPending = a.status === "pending-appointment" ? 1 : 0;
        const bPending = b.status === "pending-appointment" ? 1 : 0;
        if (aPending !== bPending) return bPending - aPending;
        return b.riskScore - a.riskScore;
      }),
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
              <TableHead className="w-10">
                <Checkbox
                  checked={
                    sorted.length > 0 &&
                    sorted.every((a) => selected.has(a.id))
                  }
                  onCheckedChange={(v) => {
                    if (v === true) {
                      setSelected(new Set(sorted.map((a) => a.id)));
                    } else {
                      setSelected(new Set());
                    }
                  }}
                  aria-label="Select all visible ARs"
                />
              </TableHead>
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
            {sorted.map((ar) => {
              // Status-coloured left rail: brand-tinted for pending
              // appointment, destructive for under-investigation,
              // muted for suspended/terminated.
              const railColour =
                ar.status === "pending-appointment"
                  ? "var(--brand-primary)"
                  : ar.status === "under-investigation"
                    ? "var(--destructive)"
                    : ar.status === "suspended" || ar.status === "terminated"
                      ? "var(--muted-foreground)"
                      : null;
              return (
              <TableRow
                key={ar.id}
                className="cursor-pointer hover:bg-foreground/[0.03] transition-colors relative data-[selected=true]:bg-foreground/[0.04]"
                data-selected={selected.has(ar.id)}
                onClick={() => open(ar)}
                style={
                  railColour
                    ? { boxShadow: `inset 3px 0 0 ${railColour}` }
                    : undefined
                }
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selected.has(ar.id)}
                    onCheckedChange={() => toggleSelected(ar.id)}
                    aria-label={`Select ${ar.tradingName}`}
                  />
                </TableCell>
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
              );
            })}
          </TableBody>
        </Table>
        {sorted.length === 0 && (
          <EmptyState
            hasFilters={
              search.trim() !== "" || status !== "all" || band !== "all"
            }
            onClear={() => {
              setSearch("");
              setStatus("all");
              setBand("all");
            }}
          />
        )}
      </div>

      <BulkActionBar
        selectedCount={selected.size}
        onClear={() => setSelected(new Set())}
        onAction={(a) => setBulkConfirm(a)}
      />

      {bulkConfirm && (
        <BulkConfirmDialog
          action={bulkConfirm}
          count={selected.size}
          onClose={() => setBulkConfirm(null)}
          onConfirm={() => {
            setBulkConfirm(null);
            setSelected(new Set());
          }}
        />
      )}
    </div>
  );
}

function BulkActionBar({
  selectedCount,
  onClear,
  onAction,
}: {
  selectedCount: number;
  onClear: () => void;
  onAction: (action: string) => void;
}) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-[calc(100vw-2rem)]"
        >
          <div className="bg-foreground text-background rounded-full shadow-2xl ring-1 ring-foreground/20 pl-4 pr-2 py-1.5 flex items-center gap-2">
            <span className="text-sm font-medium tabular-nums">
              {selectedCount} selected
            </span>
            <span className="h-5 w-px bg-background/30" aria-hidden />
            <Button
              variant="ghost"
              size="sm"
              className="text-background hover:bg-background/15 gap-1.5 text-xs"
              onClick={() => onAction("schedule-review")}
            >
              <CalendarPlus className="size-3.5" />
              Schedule review
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-background hover:bg-background/15 gap-1.5 text-xs"
              onClick={() => onAction("send-reminder")}
            >
              <Mail className="size-3.5" />
              Send reminder
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-background hover:bg-background/15 gap-1.5 text-xs"
              onClick={() => onAction("export-csv")}
            >
              <Download className="size-3.5" />
              Export CSV
            </Button>
            <button
              type="button"
              onClick={onClear}
              className="size-7 rounded-full grid place-items-center hover:bg-background/15"
              aria-label="Clear selection"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BulkConfirmDialog({
  action,
  count,
  onClose,
  onConfirm,
}: {
  action: string;
  count: number;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const labels: Record<string, { title: string; body: string; cta: string }> = {
    "schedule-review": {
      title: `Schedule a review for ${count} AR${count === 1 ? "" : "s"}`,
      body: "Adds a file-review task to the principal-compliance queue for each selected AR. Sampling honours the firm's review programme rules.",
      cta: "Schedule reviews",
    },
    "send-reminder": {
      title: `Send a reminder to ${count} AR${count === 1 ? "" : "s"}`,
      body: "Pushes a required-action notification to each AR's home surface. The reminder lands as an in-product action and an email in production.",
      cta: "Send reminders",
    },
    "export-csv": {
      title: `Export ${count} AR${count === 1 ? "" : "s"} as CSV`,
      body: "Downloads a CSV with trading name, FRN, type, status, risk score, last review date, and primary contact. Fits the FCA REP025 staging schema.",
      cta: "Export",
    },
  };
  const l = labels[action];
  if (!l) return null;
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{l.title}</DialogTitle>
          <DialogDescription className="leading-relaxed">{l.body}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>{l.cta}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  if (hasFilters) {
    return (
      <div className="py-14 text-center px-6">
        <div className="mx-auto size-10 rounded-full bg-muted grid place-items-center text-muted-foreground">
          <Search className="size-4" />
        </div>
        <h3 className="text-sm font-semibold mt-4">No ARs match these filters</h3>
        <p className="text-xs text-muted-foreground mt-1.5 max-w-xs mx-auto">
          Try clearing the filter or broaden the risk band.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 gap-1.5"
          onClick={onClear}
        >
          <X className="size-3.5" />
          Clear all filters
        </Button>
      </div>
    );
  }
  return (
    <div className="py-14 text-center px-6">
      <div className="mx-auto size-10 rounded-full bg-muted grid place-items-center text-muted-foreground">
        <Plus className="size-4" />
      </div>
      <h3 className="text-sm font-semibold mt-4">No ARs on the register yet</h3>
      <p className="text-xs text-muted-foreground mt-1.5 max-w-sm mx-auto">
        Appoint your first AR or IAR. Companies House, CreditSafe, and the
        FCA Register will populate the record automatically.
      </p>
      <Button size="sm" className="mt-4 gap-1.5" render={<Link href="/demo/principal/register/new" />}>
        <Plus className="size-3.5" />
        Appoint a new AR or IAR
      </Button>
    </div>
  );
}
