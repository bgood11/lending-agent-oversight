"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Send } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDemoStore } from "@/lib/state";
import { SKINS } from "@/lib/skins";
import { getDataset } from "@/lib/fixtures";
import type { MIReturn } from "@/lib/types";

type Step = "volumes" | "conduct" | "confirm";

export function MIReturnForm() {
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
  const appendLiveMIReturn = useDemoStore((s) => s.appendLiveMIReturn);
  const router = useRouter();

  const [step, setStep] = useState<Step>("volumes");
  const [submitted, setSubmitted] = useState(false);
  const [metrics, setMetrics] = useState({
    newBusinessVolumeGBP: 380000000, // £3.8m in pence
    newBusinessCount: 87,
    complaintsReceived: 2,
    complaintsUpheld: 1,
    breachesSelfReported: 1,
    conductEventsLogged: 4,
    cancellations: 3,
  });

  function next() {
    if (step === "volumes") setStep("conduct");
    else if (step === "conduct") setStep("confirm");
  }
  function prev() {
    if (step === "confirm") setStep("conduct");
    else if (step === "conduct") setStep("volumes");
  }

  function submit() {
    const newReturn: MIReturn = {
      id: `live-${Date.now()}`,
      arId: ar.id,
      period: {
        year: new Date("2026-05-08T00:00:00Z").getUTCFullYear(),
        quarter: 1,
      },
      submittedAt: new Date().toISOString(),
      status: "submitted",
      metrics,
      anomalyScore: 0.32,
    };
    appendLiveMIReturn(newReturn);
    setSubmitted(true);
    advance();
    setTimeout(() => router.push("/demo/ar"), 1800);
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
              MI return submitted
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {skinDef.shortName} has received your Q1 return. Your principal&apos;s
              compliance team can see it the moment they open the dashboard.
            </p>
            <div className="text-[11px] text-muted-foreground italic">
              Returning to your home in a moment…
            </div>
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
        <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
          Quarterly MI return · {ar.tradingName}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-medium leading-tight tracking-tight mt-1">
          Q1 {new Date().getFullYear()} return
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Required by {skinDef.shortName} as part of your annual oversight cycle.
          Volumes, complaints, breaches, conduct events. The principal&apos;s
          compliance team sees this the moment you submit.
        </p>
      </div>

      <Stepper step={step} />

      {step === "volumes" && (
        <Card className="p-6 space-y-4">
          <SectionLabel>Step 1 · Volumes</SectionLabel>
          <Field
            id="volume"
            label="New business volume (GBP)"
            value={(metrics.newBusinessVolumeGBP / 100).toString()}
            onChange={(v) =>
              setMetrics({
                ...metrics,
                newBusinessVolumeGBP: Math.round(Number(v.replace(/[^\d.]/g, "")) * 100) || 0,
              })
            }
            prefix="£"
          />
          <Field
            id="count"
            label="New business count"
            value={String(metrics.newBusinessCount)}
            onChange={(v) =>
              setMetrics({
                ...metrics,
                newBusinessCount: Math.max(0, Math.floor(Number(v.replace(/[^\d]/g, ""))) || 0),
              })
            }
          />
          <Field
            id="cancellations"
            label="Cancellations"
            value={String(metrics.cancellations)}
            onChange={(v) =>
              setMetrics({
                ...metrics,
                cancellations: Math.max(0, Math.floor(Number(v.replace(/[^\d]/g, ""))) || 0),
              })
            }
          />
        </Card>
      )}

      {step === "conduct" && (
        <Card className="p-6 space-y-4">
          <SectionLabel>Step 2 · Conduct</SectionLabel>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field
              id="complaints"
              label="Complaints received"
              value={String(metrics.complaintsReceived)}
              onChange={(v) =>
                setMetrics({
                  ...metrics,
                  complaintsReceived: Math.max(0, Math.floor(Number(v.replace(/[^\d]/g, ""))) || 0),
                })
              }
            />
            <Field
              id="upheld"
              label="Complaints upheld"
              value={String(metrics.complaintsUpheld)}
              onChange={(v) =>
                setMetrics({
                  ...metrics,
                  complaintsUpheld: Math.max(0, Math.floor(Number(v.replace(/[^\d]/g, ""))) || 0),
                })
              }
            />
            <Field
              id="breaches"
              label="Breaches self-reported"
              value={String(metrics.breachesSelfReported)}
              onChange={(v) =>
                setMetrics({
                  ...metrics,
                  breachesSelfReported: Math.max(0, Math.floor(Number(v.replace(/[^\d]/g, ""))) || 0),
                })
              }
            />
            <Field
              id="conduct"
              label="Conduct events logged"
              value={String(metrics.conductEventsLogged)}
              onChange={(v) =>
                setMetrics({
                  ...metrics,
                  conductEventsLogged: Math.max(0, Math.floor(Number(v.replace(/[^\d]/g, ""))) || 0),
                })
              }
            />
          </div>
        </Card>
      )}

      {step === "confirm" && (
        <Card className="p-6 space-y-4">
          <SectionLabel>Step 3 · Confirm</SectionLabel>
          <div className="space-y-2 text-sm">
            <Row k="New business" v={`£${(metrics.newBusinessVolumeGBP / 100 / 1000).toFixed(0)}k`} />
            <Row k="Cases" v={String(metrics.newBusinessCount)} />
            <Row k="Cancellations" v={String(metrics.cancellations)} />
            <Row k="Complaints received" v={String(metrics.complaintsReceived)} />
            <Row k="Complaints upheld" v={String(metrics.complaintsUpheld)} />
            <Row k="Breaches self-reported" v={String(metrics.breachesSelfReported)} />
            <Row k="Conduct events" v={String(metrics.conductEventsLogged)} />
          </div>
          <p className="text-xs text-muted-foreground italic pt-2 border-t border-border">
            Once submitted you can&apos;t edit this return. Contact{" "}
            {skinDef.shortName} compliance to query a submitted return.
          </p>
        </Card>
      )}

      <div className="flex items-center justify-between gap-3">
        {step !== "volumes" ? (
          <Button variant="outline" onClick={prev} className="gap-1.5">
            <ArrowLeft className="size-4" />
            Back
          </Button>
        ) : (
          <span />
        )}
        {step !== "confirm" ? (
          <Button onClick={next} className="gap-1.5">
            Next
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onClick={submit} className="gap-1.5">
            <Send className="size-4" />
            Submit return
          </Button>
        )}
      </div>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps: Array<{ id: Step; label: string }> = [
    { id: "volumes", label: "Volumes" },
    { id: "conduct", label: "Conduct" },
    { id: "confirm", label: "Confirm" },
  ];
  const idx = steps.findIndex((s) => s.id === step);
  return (
    <div className="flex items-center gap-3">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2 flex-1">
          <div
            className={`size-7 rounded-full grid place-items-center text-xs font-semibold ${
              i <= idx
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {i + 1}
          </div>
          <span
            className={`text-xs font-medium ${
              i === idx ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-px ml-2 ${
                i < idx ? "bg-primary" : "bg-muted"
              }`}
              aria-hidden
            />
          )}
        </div>
      ))}
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

function Field({
  id,
  label,
  value,
  onChange,
  prefix,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        {prefix && (
          <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground text-sm pointer-events-none">
            {prefix}
          </span>
        )}
        <Input
          id={id}
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={prefix ? "pl-6 tabular-nums" : "tabular-nums"}
        />
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border last:border-0 py-1.5">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium tabular-nums">{v}</span>
    </div>
  );
}
