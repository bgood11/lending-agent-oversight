"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Building, Mail, ShieldCheck } from "lucide-react";
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
    <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 py-6 space-y-6">
      <Link
        href="/demo/ar"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Your home
      </Link>

      <div className="space-y-2">
        <Badge variant="outline" className="text-[10px]">
          AR view · profile
        </Badge>
        <h1 className="font-display text-3xl font-medium leading-tight">
          {ar.tradingName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Supervised by {skinDef.shortName} · {ar.frn ? `FRN ${ar.frn}` : "via principal"}
        </p>
      </div>

      <div className="grid sm:grid-cols-[1fr_220px] gap-4">
        <Card className="p-5 space-y-3">
          <SectionLabel>Firm details</SectionLabel>
          <Row k="Legal name" v={ar.legalName} />
          <Row k="City" v={ar.city} />
          <Row k="Type" v={ar.type === "AR" ? "Appointed Representative" : "Introducer Appointed Representative"} />
          <Row k="Appointed" v={new Date(ar.appointedOn).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} />
          <Row k="Self-employed" v={ar.isSelfEmployed ? "Yes" : "No"} />
          <Row
            k="Important Business Service"
            v={ar.supportsImportantBusinessService ? "Yes (SYSC 15A applies)" : "No"}
          />
        </Card>

        <Card className="p-5 flex flex-col items-center text-center gap-2">
          <RiskGauge score={ar.riskScore} size="md" />
          <div>
            <div className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground">
              Your risk score
            </div>
            <div className="mt-1">
              <RiskBandBadge band={ar.riskBand} />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5 space-y-3">
        <SectionLabel>Permissions</SectionLabel>
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

      <Card className="p-5 space-y-2">
        <SectionLabel>Primary contact</SectionLabel>
        <div className="flex items-center gap-2 text-sm">
          <Building className="size-3.5 text-muted-foreground" />
          {ar.contact.name}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="size-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{ar.contact.email}</span>
        </div>
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
