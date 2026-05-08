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

export type ArStatus = "active" | "suspended" | "under-investigation" | "terminated";

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
