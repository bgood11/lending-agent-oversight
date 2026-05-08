/**
 * Default data connectors and enrichment integrations. Two
 * purposes:
 *
 *   - mi-ingestion: pull source-of-truth data from the AR's CRM,
 *     lender portal, complaints system, or a CSV upload, so the
 *     MI return is populated from systems of record rather than
 *     re-typed from a spreadsheet.
 *
 *   - enrichment: pull external data about the AR firm itself
 *     (Companies House controllers, charges, accounts), about its
 *     credit standing (CreditSafe), and about its FCA permissions
 *     (FCA Register / RegData). Enriched fields are surfaced on
 *     the AR detail with provenance and last-sync timestamps.
 *
 * The demo ships with a presentational mock connector set —
 * everything appears connected with realistic last-sync values.
 * The mock-vs-real boundary doc describes what each connector
 * does in production.
 */

import type { DataConnector } from "./types";

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
const NINETY_MIN_MS = 90 * 60 * 1000;
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

/**
 * Generate a realistic-looking last-sync timestamp by subtracting
 * the offset from a fixed demo "now". The fixed reference keeps
 * the demo deterministic.
 */
function syncedAt(offsetMs: number): string {
  const demoNow = new Date("2026-05-08T10:30:00Z").getTime();
  return new Date(demoNow - offsetMs).toISOString();
}

export const DEFAULT_CONNECTORS: DataConnector[] = [
  // MI ingestion connectors
  {
    id: "conn-crm-webhook",
    kind: "crm-webhook",
    purpose: "mi-ingestion",
    label: "AR CRM webhook",
    description:
      "Each AR's CRM posts case-completion events to a per-tenant webhook. Volumes, complaint events, and conduct events stream into the MI buffer in real time. Idempotent on the CRM's own case ID.",
    status: "connected",
    lastSyncAt: syncedAt(NINETY_MIN_MS),
    cadenceLabel: "On event",
    enrichedFields: [],
    arCoverage: 92,
    errorMessage: null,
    providerDocsUrl: null,
  },
  {
    id: "conn-lender-portal",
    kind: "lender-portal",
    purpose: "mi-ingestion",
    label: "Lender portal feeds",
    description:
      "Daily pull from the principal's lender-portal aggregator. Application volumes, completions, decline reasons, and procuration-fee events. Replaces the AR retyping numbers from broker portals into a spreadsheet.",
    status: "connected",
    lastSyncAt: syncedAt(SIX_HOURS_MS),
    cadenceLabel: "Every 4 hours",
    enrichedFields: [],
    arCoverage: 78,
    errorMessage: null,
    providerDocsUrl: null,
  },
  {
    id: "conn-complaints-system",
    kind: "complaints-system",
    purpose: "mi-ingestion",
    label: "Complaints system",
    description:
      "Bidirectional sync with the principal's complaints handling system. Customer complaints originating with an AR are tagged with originatingArId; outcomes flow back so DISP 1.10 returns aggregate cleanly.",
    status: "connected",
    lastSyncAt: syncedAt(NINETY_MIN_MS),
    cadenceLabel: "On event",
    enrichedFields: [],
    arCoverage: 100,
    errorMessage: null,
    providerDocsUrl: null,
  },
  {
    id: "conn-csv-upload",
    kind: "csv-upload",
    purpose: "mi-ingestion",
    label: "CSV upload (fallback)",
    description:
      "For ARs without an integrated source system, drag-and-drop CSV upload of monthly volume and complaints data. Schema documented in the AR onboarding pack.",
    status: "connected",
    lastSyncAt: syncedAt(TWO_DAYS_MS),
    cadenceLabel: "Manual",
    enrichedFields: [],
    arCoverage: 14,
    errorMessage: null,
    providerDocsUrl: null,
  },
  // Enrichment connectors
  {
    id: "conn-companies-house",
    kind: "companies-house",
    purpose: "enrichment",
    label: "Companies House",
    description:
      "Pulls the AR's company filings, directors, controllers (PSC register), charges, and confirmation-statement cycle. Director changes flag automatically as a conduct event for compliance review.",
    status: "connected",
    lastSyncAt: syncedAt(SIX_HOURS_MS * 4),
    cadenceLabel: "Daily",
    enrichedFields: [
      "Company number",
      "Registered office",
      "SIC codes",
      "Directors",
      "Persons with significant control",
      "Charges",
      "Confirmation-statement due date",
      "Accounts due date",
    ],
    arCoverage: 100,
    errorMessage: null,
    providerDocsUrl: "https://developer.company-information.service.gov.uk/",
  },
  {
    id: "conn-creditsafe",
    kind: "creditsafe",
    purpose: "enrichment",
    label: "CreditSafe",
    description:
      "Pulls the AR firm's credit rating, CCJ history, payment-behaviour score, and risk monitoring alerts. Drops in the AR's credit standing as a SUP 12.4 due-diligence input on appointment and for ongoing monitoring.",
    status: "connected",
    lastSyncAt: syncedAt(SIX_HOURS_MS * 8),
    cadenceLabel: "Weekly",
    enrichedFields: [
      "Credit rating",
      "Credit limit",
      "CCJ summary",
      "Payment-behaviour score",
      "Risk-monitoring alerts",
    ],
    arCoverage: 100,
    errorMessage: null,
    providerDocsUrl: "https://www.creditsafe.com/gb/en/business/api.html",
  },
  {
    id: "conn-fca-register",
    kind: "fca-register",
    purpose: "enrichment",
    label: "FCA Register",
    description:
      "Pulls each AR's FRN status, permitted regulated activities, SMCR-certified individuals, and historic permission changes. Reconciles nightly so the in-product permissions table never drifts from the public Register.",
    status: "connected",
    lastSyncAt: syncedAt(SIX_HOURS_MS * 2),
    cadenceLabel: "Nightly",
    enrichedFields: [
      "FRN status",
      "Trading names",
      "Permitted regulated activities",
      "Approved persons / certified individuals",
      "Permission change history",
      "Disciplinary history",
    ],
    arCoverage: 100,
    errorMessage: null,
    providerDocsUrl:
      "https://register.fca.org.uk/Services/V0.1/Help/Index",
  },
];

export const CONNECTOR_KIND_LABEL: Record<
  import("./types").ConnectorKind,
  string
> = {
  "crm-webhook": "CRM webhook",
  "lender-portal": "Lender portal",
  "csv-upload": "CSV upload",
  "complaints-system": "Complaints system",
  "companies-house": "Companies House",
  creditsafe: "CreditSafe",
  "fca-register": "FCA Register",
};

export function getConnector(id: string): DataConnector | undefined {
  return DEFAULT_CONNECTORS.find((c) => c.id === id);
}

export function getEnrichmentConnectors(): DataConnector[] {
  return DEFAULT_CONNECTORS.filter((c) => c.purpose === "enrichment");
}

export function getMiIngestionConnectors(): DataConnector[] {
  return DEFAULT_CONNECTORS.filter((c) => c.purpose === "mi-ingestion");
}
