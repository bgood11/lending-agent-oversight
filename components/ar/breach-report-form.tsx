"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Send, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { BreachCategory, BreachReport, BreachSeverity } from "@/lib/types";

const CATEGORIES: Array<{ value: BreachCategory; label: string }> = [
  { value: "conduct", label: "Conduct" },
  { value: "financial-crime", label: "Financial crime" },
  { value: "data-protection", label: "Data protection" },
  { value: "complaints-handling", label: "Complaints handling" },
  { value: "advice-suitability", label: "Advice suitability" },
  { value: "disclosure", label: "Disclosure" },
  { value: "training-competence", label: "Training and competence" },
  { value: "other", label: "Other" },
];

export function BreachReportForm() {
  const skin = useDemoStore((s) => s.skin);
  const skinDef = SKINS[skin];
  const focusedArId = useDemoStore((s) => s.focusedArId);
  const dataset = getDataset(skin);
  const ar = useMemo(
    () =>
      focusedArId
        ? dataset.ars.find((a) => a.id === focusedArId)!
        : [...dataset.ars]
            .filter((a) => a.status === "active")
            .sort((a, b) => b.riskScore - a.riskScore)[0],
    [dataset.ars, focusedArId],
  );
  const advance = useDemoStore((s) => s.advanceWalkthrough);
  const appendLiveBreach = useDemoStore((s) => s.appendLiveBreach);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<BreachCategory>("conduct");
  const [severity, setSeverity] = useState<BreachSeverity>("moderate");
  const [description, setDescription] = useState("");
  const [customerImpact, setCustomerImpact] = useState<"none" | "potential" | "actual-low" | "actual-high">("potential");
  const [steps, setSteps] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedBreachId, setSubmittedBreachId] = useState<string | null>(null);

  function submit() {
    const now = new Date().toISOString();
    const id = `live-${Date.now()}`;
    const isMaterial = severity === "material" || severity === "significant";
    const notifyByAt = isMaterial
      ? new Date(
          Date.now() + (severity === "significant" ? 1 : 30) * 24 * 3600_000,
        ).toISOString()
      : null;

    const newBreach: BreachReport = {
      id,
      arId: ar.id,
      title: title || "Untitled breach (demo)",
      description:
        description ||
        "Demo breach report. In production this is the AR's full operational write-up captured at submission.",
      category,
      severity,
      customerImpact,
      awareAt: now,
      reportedAt: now,
      notifiedFcaAt: null,
      notifyByAt,
      rootCauseTaxonomy: [],
      status: "open",
      filedByPersona: "ar-user",
    };
    appendLiveBreach(newBreach);
    setSubmittedBreachId(id);
    setSubmitted(true);
    advance();
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md w-full px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-8 text-center space-y-4 border-emerald-500/30 bg-emerald-500/5">
            <div className="size-12 rounded-full bg-emerald-500 text-white grid place-items-center mx-auto">
              <CheckCircle2 className="size-6" strokeWidth={2.5} />
            </div>
            <h1 className="font-display text-xl font-medium">
              Breach reported
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {skinDef.shortName} compliance has been notified. The SUP 15
              clock starts now. Severity {severity}{" "}
              {severity === "significant"
                ? "(1 business day to notify FCA)"
                : severity === "material"
                  ? "(30 calendar days to notify FCA)"
                  : "(internal record only)"}
              .
            </p>
            <div className="grid gap-2 pt-2">
              <Button
                className="gap-1.5"
                render={
                  <Link href={`/demo/principal/breaches/${submittedBreachId}`} />
                }
              >
                See it in the principal&apos;s queue
              </Button>
              <Button
                variant="outline"
                render={<Link href="/demo/ar" />}
              >
                Back to your home
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground italic">
              Switching to the principal view shows the breach you just filed in the triage queue.
            </p>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl w-full px-4 sm:px-6 py-6 space-y-6">
      <Link
        href="/demo/ar"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Your home
      </Link>

      <div>
        <Card className="p-3 inline-flex items-center gap-2 text-amber-foreground bg-amber-soft border-amber/40">
          <AlertTriangle className="size-4" />
          <span className="text-xs font-medium">
            Filing here starts the SUP 15 clock for material and significant breaches
          </span>
        </Card>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
          File a breach · {ar.tradingName}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-medium leading-tight tracking-tight mt-1">
          What happened?
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Be specific about what occurred, when, and what you&apos;ve done
          already. {skinDef.shortName} compliance will assess severity and
          decide whether SUP 15 notification is required.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid gap-1.5">
          <Label htmlFor="title" className="text-xs text-muted-foreground">
            Short title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Adviser advised outside scope of permissions"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory((v as BreachCategory | null) ?? "other")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">Severity (your assessment)</Label>
            <Select
              value={severity}
              onValueChange={(v) => setSeverity((v as BreachSeverity | null) ?? "moderate")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="material">Material (30-day SUP 15)</SelectItem>
                <SelectItem value="significant">Significant (1-day SUP 15)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="description" className="text-xs text-muted-foreground">
            What happened
          </Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe the event in plain English. Dates, customer impact (without naming the customer), what was missed."
            className="w-full text-sm rounded-md border border-input bg-transparent px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <div className="grid gap-1.5">
          <Label className="text-xs text-muted-foreground">Customer impact</Label>
          <Select
            value={customerImpact}
            onValueChange={(v) => setCustomerImpact((v as typeof customerImpact | null) ?? "none")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No customer impact</SelectItem>
              <SelectItem value="potential">Potential impact</SelectItem>
              <SelectItem value="actual-low">Actual, low impact</SelectItem>
              <SelectItem value="actual-high">Actual, high impact</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="steps" className="text-xs text-muted-foreground">
            Immediate steps you&apos;ve taken
          </Label>
          <textarea
            id="steps"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            rows={3}
            placeholder="What you've done already to contain the issue."
            className="w-full text-sm rounded-md border border-input bg-transparent px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
      </Card>

      <div className="flex items-center justify-end">
        <Button onClick={submit} className="gap-1.5">
          <Send className="size-4" />
          Submit breach report
        </Button>
      </div>
    </div>
  );
}
