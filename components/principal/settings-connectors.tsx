"use client";

import { useMemo } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Plug,
  Database,
  Building2,
  ShieldCheck,
  Landmark,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/state";
import {
  DEFAULT_CONNECTORS,
  CONNECTOR_KIND_LABEL,
} from "@/lib/connectors";
import type { DataConnector, ConnectorKind, ConnectorStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<ConnectorKind, ComponentType<SVGProps<SVGSVGElement>>> = {
  "crm-webhook": Plug,
  "lender-portal": Database,
  "csv-upload": Database,
  "complaints-system": CircleAlert,
  "companies-house": Building2,
  creditsafe: ShieldCheck,
  "fca-register": Landmark,
};

export function SettingsConnectors() {
  const overrides = useDemoStore((s) => s.connectorStatusOverrides);
  const setStatus = useDemoStore((s) => s.setConnectorStatus);
  const reset = useDemoStore((s) => s.resetConnectorStatuses);

  const miConnectors = useMemo(
    () => DEFAULT_CONNECTORS.filter((c) => c.purpose === "mi-ingestion"),
    [],
  );
  const enrichmentConnectors = useMemo(
    () => DEFAULT_CONNECTORS.filter((c) => c.purpose === "enrichment"),
    [],
  );

  const customisedCount = Object.keys(overrides).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold leading-tight">
            Connectors &amp; enrichments
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
            Two connector classes. <span className="font-medium text-foreground">MI ingestion</span> pulls
            volumes, complaints, conduct events from the AR&apos;s source
            systems straight into the MI buffer — no spreadsheet retyping.
            <span className="font-medium text-foreground"> Enrichment</span> auto-populates
            the AR firm&apos;s static facts from Companies House, CreditSafe,
            and the FCA Register, with field-level provenance and last-sync
            timestamps surfaced on the AR detail.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={reset}
          disabled={customisedCount === 0}
        >
          Reset connector states
        </Button>
      </div>

      <ConnectorSection
        title="MI ingestion"
        subtitle="Source-of-truth feeds replacing the AR's monthly spreadsheet email."
        connectors={miConnectors}
        overrides={overrides}
        onSetStatus={setStatus}
      />

      <ConnectorSection
        title="Enrichment"
        subtitle="External APIs that fill in the AR firm's static facts and monitor change."
        connectors={enrichmentConnectors}
        overrides={overrides}
        onSetStatus={setStatus}
      />

      <Card className="p-5 bg-muted/20 border-dashed">
        <h3 className="font-medium text-sm">Add connector</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Production: paste a webhook URL, paste an API key, or upload an OAuth
          consent. Demo: connector catalogue is read-only. The mock-vs-real
          boundary doc covers what each connector does in production.
        </p>
        <Button variant="outline" size="sm" className="mt-3" disabled>
          Browse connector catalogue (demo)
        </Button>
      </Card>
    </div>
  );
}

function ConnectorSection({
  title,
  subtitle,
  connectors,
  overrides,
  onSetStatus,
}: {
  title: string;
  subtitle: string;
  connectors: DataConnector[];
  overrides: Record<string, ConnectorStatus>;
  onSetStatus: (id: string, status: ConnectorStatus) => void;
}) {
  return (
    <section>
      <div className="mb-3">
        <h3 className="text-sm font-semibold leading-tight">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {connectors.map((c) => (
          <ConnectorCard
            key={c.id}
            connector={c}
            statusOverride={overrides[c.id]}
            onSetStatus={(s) => onSetStatus(c.id, s)}
          />
        ))}
      </div>
    </section>
  );
}

function ConnectorCard({
  connector,
  statusOverride,
  onSetStatus,
}: {
  connector: DataConnector;
  statusOverride: ConnectorStatus | undefined;
  onSetStatus: (s: ConnectorStatus) => void;
}) {
  const status = statusOverride ?? connector.status;
  const Icon = KIND_ICON[connector.kind];
  const connected = status === "connected";

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "size-10 rounded-lg grid place-items-center flex-none",
            connected
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : status === "error"
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-sm leading-tight">
              {connector.label}
            </h4>
            <StatusBadge status={status} />
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">
            {CONNECTOR_KIND_LABEL[connector.kind]}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {connector.description}
      </p>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] pt-1 border-t border-border">
        <div>
          <dt className="text-muted-foreground">Cadence</dt>
          <dd className="font-medium">{connector.cadenceLabel}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Last sync</dt>
          <dd className="font-medium tabular-nums">
            {connector.lastSyncAt ? formatRelative(connector.lastSyncAt) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">AR coverage</dt>
          <dd className="font-medium tabular-nums">
            {connector.arCoverage}
            {connector.purpose === "mi-ingestion" ? "% of network" : " ARs"}
          </dd>
        </div>
        {connector.purpose === "enrichment" && (
          <div>
            <dt className="text-muted-foreground">Fields enriched</dt>
            <dd className="font-medium tabular-nums">
              {connector.enrichedFields.length}
            </dd>
          </div>
        )}
      </dl>

      {connector.purpose === "enrichment" && connector.enrichedFields.length > 0 && (
        <div className="pt-1">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1.5">
            Auto-populated fields
          </div>
          <div className="flex flex-wrap gap-1">
            {connector.enrichedFields.map((f) => (
              <Badge
                key={f}
                variant="secondary"
                className="text-[10px] font-normal"
              >
                {f}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            onSetStatus(connected ? "not-configured" : "connected")
          }
        >
          {connected ? (
            <>
              <CircleAlert className="size-3.5" />
              Disconnect
            </>
          ) : (
            <>
              <Plug className="size-3.5" />
              Connect
            </>
          )}
        </Button>
        {connected && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => onSetStatus("syncing")}
          >
            <RefreshCw className="size-3.5" />
            Re-sync
          </Button>
        )}
        {connector.providerDocsUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground ml-auto"
            render={
              <a
                href={connector.providerDocsUrl}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <ExternalLink className="size-3.5" />
            API docs
          </Button>
        )}
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: ConnectorStatus }) {
  if (status === "connected") {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] gap-1">
        <CheckCircle2 className="size-2.5" />
        Connected
      </Badge>
    );
  }
  if (status === "syncing") {
    return (
      <Badge className="bg-amber-soft text-amber-foreground border-amber/40 text-[10px] gap-1">
        <RefreshCw className="size-2.5 animate-spin" />
        Syncing
      </Badge>
    );
  }
  if (status === "error") {
    return (
      <Badge className="bg-destructive/10 text-destructive border-destructive/40 text-[10px]">
        Error
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-[10px]">
      Not configured
    </Badge>
  );
}

function formatRelative(iso: string): string {
  const demoNow = new Date("2026-05-08T10:30:00Z").getTime();
  const t = new Date(iso).getTime();
  const diffMs = demoNow - t;
  const m = Math.floor(diffMs / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
