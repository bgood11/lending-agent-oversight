"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Building, Mail, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDemoStore } from "@/lib/state";
import { SKINS } from "@/lib/skins";
import { getDataset } from "@/lib/fixtures";
import { RiskGauge } from "@/components/principal/risk-gauge";
import { RiskBandBadge } from "@/components/principal/risk-band-badge";

export default function ArProfilePage() {
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

  return (
    <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 py-6 space-y-5">
      <Link
        href="/demo/ar"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Your home
      </Link>

      {/* Header — same three-zone composition as the principal-side
          AR detail, AR-side flavoured. Identity card with brand wash,
          gauge zone with risk band, supervisor strip on the right. */}
      <header className="grid lg:grid-cols-[minmax(0,1.6fr)_auto_minmax(0,1fr)] gap-3 items-stretch">
        <Card className="relative overflow-hidden p-6">
          <div
            aria-hidden
            className="absolute -top-20 -right-20 size-60 rounded-full opacity-[0.10] blur-3xl"
            style={{ background: "var(--brand-primary)" }}
          />
          <div className="relative space-y-3">
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
            </div>
          </div>
        </Card>

        <Card className="p-6 grid place-items-center min-w-[220px]">
          <div className="flex flex-col items-center gap-2.5">
            <RiskGauge score={ar.riskScore} size="lg" />
            <RiskBandBadge band={ar.riskBand} />
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground/70 font-medium">
              your composite score
            </div>
          </div>
        </Card>

        <Card className="p-5 lg:max-w-xs">
          <SectionLabel>Supervisor</SectionLabel>
          <div className="mt-2.5 space-y-2">
            <div className="text-sm font-medium leading-tight">
              {skinDef.shortName}
            </div>
            <div className="text-[11px] text-muted-foreground font-mono">
              FRN {skinDef.frn}
            </div>
            <div className="text-[11px] text-muted-foreground leading-relaxed pt-1">
              Your principal firm holds regulatory responsibility for your
              regulated activity within the scope of your appointment. Read
              their policies in your dashboard.
            </div>
          </div>
        </Card>
      </header>

      <div className="grid sm:grid-cols-2 gap-3">
        <Card className="p-5 space-y-3">
          <SectionLabel>Firm details</SectionLabel>
          <Row k="Legal name" v={ar.legalName} />
          <Row k="City" v={ar.city} />
          <Row
            k="Type"
            v={ar.type === "AR" ? "Appointed Representative" : "Introducer Appointed Representative"}
          />
          <Row
            k="Appointed"
            v={new Date(ar.appointedOn).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          />
          <Row k="Self-employed" v={ar.isSelfEmployed ? "Yes" : "No"} />
          <Row
            k="Important Business Service"
            v={ar.supportsImportantBusinessService ? "Yes (SYSC 15A applies)" : "No"}
          />
        </Card>

        <Card className="p-5 space-y-2">
          <SectionLabel>Primary contact</SectionLabel>
          <div className="flex items-center gap-2 text-sm pt-1">
            <Building className="size-3.5 text-muted-foreground" />
            {ar.contact.name}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="size-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">{ar.contact.email}</span>
          </div>
        </Card>
      </div>

      <Card className="p-5 space-y-3">
        <SectionLabel>Your permissions</SectionLabel>
        <ul className="space-y-2">
          {ar.permissions.map((p) => (
            <li
              key={p.code}
              className="flex items-start justify-between gap-3 text-sm"
            >
              <div>
                <div className="font-mono text-xs text-muted-foreground">{p.code}</div>
                <div className="mt-0.5">{p.label}</div>
              </div>
              <Badge variant="outline" className="text-[10px] shrink-0">
                <ShieldCheck className="size-3 mr-1" />
                Active
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
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

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border last:border-0 py-1.5 text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
