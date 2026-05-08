/**
 * Shared types for Lending Agent Oversight.
 * Production server replaces these with persisted entities, see
 * Architecture / Data model in the docs.
 */

export type Ulid = string;
export type IsoTimestamp = string;
export type Frn = string;
export type Pence = number;

export type Vertical = "mortgage" | "general-insurance" | "credit-broking";
export type RubricCode = "MCOB" | "ICOBS" | "CONC";
export type ArType = "AR" | "IAR";
export type RiskBand = "low" | "moderate" | "elevated" | "high" | "critical";
export type Persona = "principal-admin" | "principal-compliance-officer" | "ar-user";

export type Role =
  | "principal-admin"
  | "principal-compliance-officer"
  | "ar-user"
  | "fca-auditor";

export interface PostalAddress {
  line1: string;
  line2: string | null;
  city: string;
  postcode: string;
  country: "GB";
}

export type ArStatus =
  | "pending-appointment"
  | "active"
  | "suspended"
  | "under-investigation"
  | "terminated";

export interface AppointedRep {
  id: Ulid;
  type: ArType;
  tradingName: string;
  legalName: string;
  frn: Frn | null;
  status: ArStatus;
  permissions: Permission[];
  city: string;
  appointedOn: IsoTimestamp;
  lastAnnualReviewAt: IsoTimestamp | null;
  nextReviewDueAt: IsoTimestamp;
  /** Composite risk score 0-100. */
  riskScore: number;
  riskBand: RiskBand;
  isSelfEmployed: boolean;
  supportsImportantBusinessService: boolean;
  contact: { name: string; email: string };
}

export interface Permission {
  code: string;
  label: string;
  grantedOn: IsoTimestamp;
  revokedOn: IsoTimestamp | null;
}

export type BreachCategory =
  | "conduct"
  | "financial-crime"
  | "data-protection"
  | "complaints-handling"
  | "advice-suitability"
  | "disclosure"
  | "training-competence"
  | "other";

export type BreachSeverity = "minor" | "moderate" | "material" | "significant";
export type BreachCustomerImpact = "none" | "potential" | "actual-low" | "actual-high";
export type BreachStatus = "open" | "in-remediation" | "resolved" | "closed";

export interface BreachReport {
  id: Ulid;
  arId: Ulid;
  title: string;
  description: string;
  category: BreachCategory;
  severity: BreachSeverity;
  customerImpact: BreachCustomerImpact;
  awareAt: IsoTimestamp;
  reportedAt: IsoTimestamp;
  notifiedFcaAt: IsoTimestamp | null;
  /** Computed deadline by SUP 15.3 timing for the category and severity. */
  notifyByAt: IsoTimestamp | null;
  rootCauseTaxonomy: string[];
  status: BreachStatus;
  filedByPersona: Persona;
}

export type FileReviewStatus = "scheduled" | "in-progress" | "complete" | "challenged";

export interface FileReviewFinding {
  itemCode: string;
  itemLabel: string;
  outcome: "pass" | "advisory" | "fail" | "n/a";
  evidence: string;
  remediation: string | null;
}

export interface FileReview {
  id: Ulid;
  arId: Ulid;
  caseRef: string;
  reviewerName: string;
  rubricCode: RubricCode;
  /** Rubric version at the time of scoring, so historic reviews stay
   *  legible after the rubric is amended. Demo defaults to "v1". */
  rubricVersion?: string;
  findings: FileReviewFinding[];
  score: number;
  status: FileReviewStatus;
  startedAt: IsoTimestamp | null;
  completedAt: IsoTimestamp | null;
  rootCauseTaxonomy: string[];
  notes: string;
}

export type MIReturnStatus = "draft" | "submitted" | "queried" | "accepted";

export interface MIReturnMetrics {
  newBusinessVolumeGBP: Pence;
  newBusinessCount: number;
  complaintsReceived: number;
  complaintsUpheld: number;
  breachesSelfReported: number;
  conductEventsLogged: number;
  cancellations: number;
}

export interface MIReturn {
  id: Ulid;
  arId: Ulid;
  period: { year: number; quarter: 1 | 2 | 3 | 4 };
  submittedAt: IsoTimestamp | null;
  status: MIReturnStatus;
  metrics: MIReturnMetrics;
  /** 0-1, computed against the AR's own historic distribution. */
  anomalyScore: number;
}

export type AnnualReviewStatus = "draft" | "in-review" | "signed-off" | "rejected";

export interface AnnualReview {
  id: Ulid;
  arId: Ulid;
  cycleYear: number;
  status: AnnualReviewStatus;
  riskTrajectory: { at: IsoTimestamp; score: number }[];
  breachSummaryRefs: Ulid[];
  fileReviewSummaryRefs: Ulid[];
  miReturnRefs: Ulid[];
  signOffByName: string | null;
  signOffAt: IsoTimestamp | null;
  signOffNotes: string;
}

export type ConductEventType =
  | "complaint"
  | "training-completion"
  | "supervision-1to1"
  | "policy-attestation"
  | "other";

export interface ConductEvent {
  id: Ulid;
  arId: Ulid;
  type: ConductEventType;
  occurredAt: IsoTimestamp;
  detail: string;
}

/**
 * Demo-side audit event. The production shape (documented in
 * `architecture/data-model`) carries `tenantId`, `prevHash`, `hash`,
 * `ip`, `userAgent` for the SHA-256 chain. The demo set is a strict
 * subset that's sufficient for in-memory rendering. See the
 * mock-vs-real boundary doc for the seam.
 */
export interface AuditEvent {
  id: Ulid;
  at: IsoTimestamp;
  actorName: string;
  actorRole: Role;
  action: string;
  subjectType: "ar" | "breach" | "review" | "annual-review" | "mi-return" | "tenant" | "user";
  subjectId: Ulid;
}

export interface RequiredAction {
  id: Ulid;
  arId: Ulid;
  title: string;
  dueAt: IsoTimestamp;
  href: string;
}

/**
 * Oversight task frequency. Drives the cadence at which a tenant-
 * level supervisory task fires on the principal's calendar. The
 * principal-admin can change a task's frequency without altering
 * the underlying obligation, e.g. running file reviews monthly
 * for elevated-band ARs and quarterly for moderate.
 */
export type TaskFrequency =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "half-yearly"
  | "annual"
  | "ad-hoc";

export type TaskCategory =
  | "review"
  | "attestation"
  | "data-collection"
  | "filing"
  | "training"
  | "other";

export type TaskScope = "per-ar" | "firm-level";

export type TaskAppliesTo = "AR" | "IAR" | "all";

export type TaskRegulatorySource =
  | "ps22-11"
  | "sup-12.6"
  | "sup-12.6a"
  | "sup-15"
  | "disp-1"
  | "consumer-duty"
  | "sysc-15a"
  | "fg21-1"
  | "internal";

export interface OversightTask {
  id: Ulid;
  title: string;
  description: string;
  category: TaskCategory;
  scope: TaskScope;
  appliesTo: TaskAppliesTo;
  /** Default frequency the product ships with. */
  defaultFrequency: TaskFrequency;
  ownerRole: Role;
  /** Days after the cycle start the task is due. */
  dueOffsetDays: number;
  source: TaskRegulatorySource;
  /** Whether this is a canonical product-shipped task or one the
   *  principal-admin added. */
  isCanonical: boolean;
}

/**
 * Per-tenant override of a canonical task or a custom task added
 * by principal-admin. The override layers on the canonical record
 * so changes are auditable and reversible.
 */
export interface OversightTaskOverride {
  taskId: Ulid;
  /** If null, falls back to the canonical defaultFrequency. */
  frequency: TaskFrequency | null;
  enabled: boolean;
  notes: string | null;
}

/**
 * Connector for ingesting data into the platform. Spans both MI
 * data ingestion (CRM webhooks, lender portals, CSV uploads,
 * complaints systems) and external enrichment APIs (Companies
 * House, CreditSafe, FCA Register).
 */
export type ConnectorKind =
  | "crm-webhook"
  | "lender-portal"
  | "csv-upload"
  | "complaints-system"
  | "companies-house"
  | "creditsafe"
  | "fca-register";

export type ConnectorPurpose = "mi-ingestion" | "enrichment";

export type ConnectorStatus =
  | "connected"
  | "syncing"
  | "error"
  | "not-configured";

export interface DataConnector {
  id: Ulid;
  kind: ConnectorKind;
  purpose: ConnectorPurpose;
  label: string;
  description: string;
  status: ConnectorStatus;
  lastSyncAt: IsoTimestamp | null;
  /** Sync cadence in human form, e.g. "every 4 hours", "on event". */
  cadenceLabel: string;
  /** Fields populated by the connector (for enrichment connectors). */
  enrichedFields: string[];
  /** Number of ARs currently covered by this connector. */
  arCoverage: number;
  /** Connector-specific error string if status === 'error'. */
  errorMessage: string | null;
  /** External provider's documentation URL. */
  providerDocsUrl: string | null;
}
