/**
 * Deterministic fixture generator. ~150 ARs spread across the three
 * principal-firm skins, each with breaches, file reviews, MI returns,
 * conduct events, and a risk trajectory. Seeded mulberry32 PRNG so
 * server and client agree at hydration.
 *
 * In production these come from Postgres. The shape mirrors the API
 * payloads documented in the engineering-spec docs.
 */

import type { SkinId } from "./skins";
import type {
  AppointedRep,
  BreachReport,
  FileReview,
  MIReturn,
  ConductEvent,
  AuditEvent,
  RequiredAction,
  ArType,
  ArStatus,
  BreachCategory,
  BreachSeverity,
  BreachStatus,
  Permission,
  RubricCode,
} from "./types";
import { bandFromScore } from "./risk-scoring";

const FIXED_NOW = new Date("2026-05-08T18:00:00Z").getTime();

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function isoOffsetDays(days: number): string {
  return new Date(FIXED_NOW - days * 24 * 3600_000).toISOString();
}

function isoFutureDays(days: number): string {
  return new Date(FIXED_NOW + days * 24 * 3600_000).toISOString();
}

const FIRMS_BY_SKIN: Record<SkinId, string[]> = {
  heritage: [
    "Pemberton Mortgages", "Holyrood Lending Partners", "Chatsworth Home Finance",
    "Whitechapel Mortgages", "Bramwell & Associates", "Tyne Mortgage Bureau",
    "Larkspur Mortgage Solutions", "Westcountry Lending Network", "Sherwood Home Finance",
    "Caldicott Mortgages", "Halton Property Finance", "Quayside Mortgages",
    "Highbury Brokers", "Mossley Independent Brokers", "Warrenford Mortgage Co",
    "Falmouth Lending", "Eddington Mortgages", "Pinehurst Brokers",
    "Belvedere Home Finance", "Stansford Mortgages", "Ravenscroft Lending",
    "Marlowe Mortgage Group", "Trentham Brokers", "Heatherbank Lending",
  ],
  crown: [
    "Cinder & Wright Brokers", "Bridgemount Insurance Services", "Lyndhurst GI",
    "Calderbrook Insurance", "Penwortham Brokers", "Selby Commercial Insurance",
    "Wexham Insurance Partners", "Ardent Risk Solutions", "Beechcroft GI",
    "Falgate Insurance", "Linwood Brokers", "Templegate Risk",
    "Ashwell Insurance", "Northgate Cover", "Middlebrook Brokers",
    "Sandford Risk", "Greycoat Insurance", "Whitcombe Brokers",
  ],
  pinpoint: [
    "Halcyon Retail Finance", "Bridgewell Credit Brokers", "Olive Grove Finance",
    "Cromwell Motor Finance", "Beech & Hart Credit", "Linley Home Improvement Finance",
    "Whitestone Brokers", "Maplewood Credit", "Severn Retail Finance",
    "Carrickbrook Credit", "Stancliffe Finance", "Old Mill Credit Partners",
    "Endsleigh Credit Brokers", "Brookdene Finance", "Wynndale Credit",
    "Faversham Retail Finance", "Tilbrook Credit", "Yelverton Brokers",
    "Barrowford Finance", "Merton Wood Credit", "Caistor Credit",
    "Ravensthorpe Finance", "Halewood Credit Brokers",
  ],
};

const FIRST_NAMES = ["Imogen", "Reuben", "Aisha", "Marcus", "Saoirse", "Tom", "Priya", "Nadia", "James", "Kara", "Felix", "Eleanor"];
const LAST_NAMES = ["Whitfield", "Dabiri", "Crawford", "O'Sullivan", "Bartlett", "Kowalski", "Tanaka", "Holloway", "Reaves", "Marbury"];

const ENGLISH_CITIES = ["Manchester", "Bristol", "Leeds", "Sheffield", "Newcastle", "Norwich", "Plymouth", "Cardiff", "Edinburgh", "Belfast", "Birmingham", "Liverpool", "Brighton", "York", "Bath"];

const PERMISSIONS_BY_SKIN: Record<SkinId, { code: string; label: string }[]> = {
  heritage: [
    { code: "MCOB.ARRANGE", label: "Arrange (regulated mortgage contract)" },
    { code: "MCOB.ADVISE", label: "Advise (regulated mortgage contract)" },
    { code: "MCOB.ENTER", label: "Enter into a regulated mortgage contract" },
  ],
  crown: [
    { code: "ICOBS.ADVISE", label: "Advise on non-investment insurance" },
    { code: "ICOBS.ARRANGE", label: "Arrange (non-investment insurance)" },
    { code: "ICOBS.DEAL", label: "Deal as agent (non-investment insurance)" },
  ],
  pinpoint: [
    { code: "CONC.CREDIT_BROKING", label: "Credit broking (full)" },
    { code: "CONC.LIMITED_BROKING", label: "Credit broking (limited)" },
  ],
};

const BREACH_TITLES_BY_CATEGORY: Record<BreachCategory, string[]> = {
  conduct: [
    "Adviser pressured customer to accept higher commission product",
    "Outside scope of appointment: gave debt advice",
    "Failure to disclose material change in firm structure",
  ],
  "financial-crime": [
    "Possible money-laundering pattern in three customer applications",
    "Source-of-funds documentation missing on accelerated case",
  ],
  "data-protection": [
    "Customer file emailed to wrong recipient",
    "Lost USB drive containing 14 customer applications",
  ],
  "complaints-handling": [
    "Complaint not acknowledged within 5 working days",
    "Final response letter missing required FOS signposting",
  ],
  "advice-suitability": [
    "Suitability report missing customer's stated objectives",
    "Recommendation made without considering customer's existing arrangements",
  ],
  disclosure: [
    "ESIS issued without required cooling-off period notice",
    "Pre-contract credit information omitted APR variant clauses",
  ],
  "training-competence": [
    "Adviser sat with no completed annual CPD record",
    "New joiner advising before competence sign-off",
  ],
  other: [
    "Operational outage: case management system down 6 hours",
    "Senior manager resignation without explanation",
  ],
};

const ROOT_CAUSE_TAXONOMY = [
  "training-gap", "system-failure", "process-omission", "intentional-misconduct",
  "third-party-error", "documentation-quality", "supervision-failure", "control-bypass",
];

interface SkinDataset {
  ars: AppointedRep[];
  breaches: BreachReport[];
  reviews: FileReview[];
  miReturns: MIReturn[];
  conductEvents: ConductEvent[];
  auditEvents: AuditEvent[];
  requiredActions: RequiredAction[];
}

function generateForSkin(
  skinId: SkinId,
  baseSeed: number,
  arCount: number,
  rubric: RubricCode,
): SkinDataset {
  const rand = mulberry32(baseSeed);
  const firms = FIRMS_BY_SKIN[skinId];
  const permsPool = PERMISSIONS_BY_SKIN[skinId];

  const ars: AppointedRep[] = [];
  const breaches: BreachReport[] = [];
  const reviews: FileReview[] = [];
  const miReturns: MIReturn[] = [];
  const conductEvents: ConductEvent[] = [];
  const auditEvents: AuditEvent[] = [];
  const requiredActions: RequiredAction[] = [];

  for (let i = 0; i < arCount; i++) {
    const id = `${skinId}-ar-${String(i + 1).padStart(3, "0")}`;
    const firmName = firms[i % firms.length] +
      (i >= firms.length ? ` (${pick(rand, ENGLISH_CITIES)})` : "");
    const type: ArType = rand() < 0.18 ? "IAR" : "AR";
    const isSelfEmployed = rand() < 0.25;
    const supportsImportantBusinessService = rand() < 0.12;
    const status: ArStatus =
      rand() < 0.04 ? "under-investigation"
      : rand() < 0.06 ? "suspended"
      : rand() < 0.06 ? "terminated"
      : "active";

    // Risk score: skewed distribution. Most ARs sit between 20-60. A
    // small tail in critical band ensures the dashboard has interesting
    // cases to surface. Seed influences distribution.
    const r = rand();
    const score = Math.min(100, Math.max(0,
      r < 0.05 ? 80 + rand() * 20      // 5% critical
      : r < 0.18 ? 60 + rand() * 20    // 13% high
      : r < 0.42 ? 40 + rand() * 20    // 24% elevated
      : r < 0.78 ? 20 + rand() * 20    // 36% moderate
      : rand() * 20                    // 22% low
    ));

    const lastReviewDays = Math.round(rand() * 16 * 30);
    const lastAnnualReviewAt = lastReviewDays > 14 * 30
      ? null
      : isoOffsetDays(lastReviewDays);
    const nextReviewDueDays = lastAnnualReviewAt
      ? Math.max(-30, 365 - lastReviewDays)
      : Math.round(rand() * 14 - 30); // many overdue
    const nextReviewDueAt = isoFutureDays(nextReviewDueDays);

    const permCount = type === "IAR" ? 1 : 1 + Math.floor(rand() * permsPool.length);
    const permissions: Permission[] = permsPool.slice(0, permCount).map((p) => ({
      code: p.code,
      label: p.label,
      grantedOn: isoOffsetDays(Math.round(rand() * 1500 + 200)),
      revokedOn: null,
    }));

    const contactName = `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`;
    const slug = firmName.toLowerCase().replace(/[^a-z]+/g, "");

    const ar: AppointedRep = {
      id,
      type,
      tradingName: firmName,
      legalName: `${firmName} Limited`,
      frn: type === "IAR" ? null : String(700000 + i * 7 + (skinId === "heritage" ? 0 : skinId === "crown" ? 100 : 200)),
      status,
      permissions,
      city: pick(rand, ENGLISH_CITIES),
      appointedOn: isoOffsetDays(Math.round(rand() * 1500 + 100)),
      lastAnnualReviewAt,
      nextReviewDueAt,
      riskScore: Math.round(score * 100) / 100,
      riskBand: bandFromScore(score),
      isSelfEmployed,
      supportsImportantBusinessService,
      contact: {
        name: contactName,
        email: `${slug}@example.com`,
      },
    };
    ars.push(ar);

    // Breach reports per AR. High-risk ARs get more, low-risk fewer.
    const breachCount = score > 70
      ? 2 + Math.floor(rand() * 4)
      : score > 50
      ? Math.floor(rand() * 3)
      : Math.floor(rand() * 2);
    for (let b = 0; b < breachCount; b++) {
      const category = pick(rand, [
        "conduct", "financial-crime", "data-protection", "complaints-handling",
        "advice-suitability", "disclosure", "training-competence", "other",
      ] as BreachCategory[]);
      const severity: BreachSeverity =
        rand() < 0.10 ? "significant"
        : rand() < 0.25 ? "material"
        : rand() < 0.55 ? "moderate" : "minor";
      const customerImpact = rand() < 0.10 ? "actual-high"
        : rand() < 0.30 ? "actual-low"
        : rand() < 0.55 ? "potential" : "none";
      const status: BreachStatus =
        rand() < 0.40 ? "closed"
        : rand() < 0.65 ? "resolved"
        : rand() < 0.85 ? "in-remediation" : "open";
      // Bias age by status. Open breaches are recent (otherwise the
      // demo's SUP 15 countdowns read as wildly overdue and the buyer
      // assumes the system is broken). In-remediation can be older.
      // Resolved/closed sample any age.
      const ageDays =
        status === "open"
          ? Math.round(rand() * 12)            // 0-12 days, in window
          : status === "in-remediation"
            ? 5 + Math.round(rand() * 50)      // 5-55 days
            : Math.round(rand() * 280);        // any age
      const reportedAt = isoOffsetDays(ageDays);
      const awareAt = isoOffsetDays(ageDays + Math.floor(rand() * 3));
      const isSignificantOrMaterial = severity === "significant" || severity === "material";
      const notifyByAt = isSignificantOrMaterial
        ? new Date(new Date(awareAt).getTime() + (severity === "significant" ? 1 : 30) * 24 * 3600_000).toISOString()
        : null;
      const notifiedFcaAt = isSignificantOrMaterial && status !== "open" && rand() < 0.85
        ? new Date(new Date(reportedAt).getTime() + (severity === "significant" ? 18 : 12) * 3600_000 * 24).toISOString()
        : null;

      breaches.push({
        id: `${id}-b-${b + 1}`,
        arId: id,
        title: pick(rand, BREACH_TITLES_BY_CATEGORY[category]),
        description: "Demo description. In production this is the full operational write-up captured at triage, with the rep's notes and any attached evidence.",
        category,
        severity,
        customerImpact,
        awareAt,
        reportedAt,
        notifiedFcaAt,
        notifyByAt,
        rootCauseTaxonomy: status !== "open"
          ? [pick(rand, ROOT_CAUSE_TAXONOMY)].concat(rand() < 0.3 ? [pick(rand, ROOT_CAUSE_TAXONOMY)] : [])
          : [],
        status,
        filedByPersona: rand() < 0.5 ? "ar-user" : "principal-compliance-officer",
      });
    }

    // File reviews: 2-8 per AR depending on status
    const reviewCount = status === "active" ? 4 + Math.floor(rand() * 5) : 2 + Math.floor(rand() * 3);
    for (let r = 0; r < reviewCount; r++) {
      const ageDays = Math.round(rand() * 360);
      const reviewScore = Math.round(score < 60 ? 70 + rand() * 25 : 50 + rand() * 35);
      reviews.push({
        id: `${id}-fr-${r + 1}`,
        arId: id,
        caseRef: `${rubric}-${Math.floor(rand() * 90000 + 10000)}`,
        reviewerName: `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`,
        rubricCode: rubric,
        findings: [],
        score: reviewScore,
        status: "complete",
        startedAt: isoOffsetDays(ageDays + 1),
        completedAt: isoOffsetDays(ageDays),
        rootCauseTaxonomy: reviewScore < 75 ? [pick(rand, ROOT_CAUSE_TAXONOMY)] : [],
        notes: "",
      });
    }

    // MI returns: last 8 quarters
    for (let q = 0; q < 8; q++) {
      const year = 2024 + Math.floor((q + 1) / 4);
      const quarter = (((q % 4) + 1) as 1 | 2 | 3 | 4);
      const submittedDaysAgo = (8 - q) * 90 + Math.floor(rand() * 14);
      miReturns.push({
        id: `${id}-mi-${year}q${quarter}`,
        arId: id,
        period: { year, quarter },
        submittedAt: isoOffsetDays(submittedDaysAgo),
        status: "accepted",
        metrics: {
          newBusinessVolumeGBP: Math.round((1.5e6 + rand() * 6e6) * 100),
          newBusinessCount: 30 + Math.floor(rand() * 200),
          complaintsReceived: Math.floor(rand() * 8),
          complaintsUpheld: Math.floor(rand() * 4),
          breachesSelfReported: Math.floor(rand() * 3),
          conductEventsLogged: Math.floor(rand() * 12),
          cancellations: Math.floor(rand() * 6),
        },
        anomalyScore: score > 60 ? 0.4 + rand() * 0.5 : rand() * 0.4,
      });
    }

    // Required actions for the principal compliance officer
    if (nextReviewDueDays < 30) {
      requiredActions.push({
        id: `${id}-ra-1`,
        arId: id,
        title: nextReviewDueDays < 0
          ? `${firmName}: annual fitness review overdue`
          : `${firmName}: annual fitness review due in ${nextReviewDueDays} days`,
        dueAt: nextReviewDueAt,
        href: `/demo/principal/annual-reviews/${id}`,
      });
    }

    // Conduct events: just a representative sample
    if (rand() < 0.4) {
      conductEvents.push({
        id: `${id}-ce-1`,
        arId: id,
        type: "training-completion",
        occurredAt: isoOffsetDays(Math.round(rand() * 200)),
        detail: `Annual ${rubric} refresher completed by ${contactName}.`,
      });
    }
  }

  // Audit events: pull from breaches with notification timestamps
  breaches
    .filter((b) => b.notifiedFcaAt)
    .slice(0, 20)
    .forEach((b, i) => {
      auditEvents.push({
        id: `audit-${skinId}-${i}`,
        at: b.notifiedFcaAt!,
        actorName: "Compliance team",
        actorRole: "principal-admin",
        action: "breach.notify-fca",
        subjectType: "breach",
        subjectId: b.id,
      });
    });

  return { ars, breaches, reviews, miReturns, conductEvents, auditEvents, requiredActions };
}

const DATASETS: Record<SkinId, SkinDataset> = {
  heritage: generateForSkin("heritage", 11, 124, "MCOB"),
  crown: generateForSkin("crown", 22, 87, "ICOBS"),
  pinpoint: generateForSkin("pinpoint", 33, 198, "CONC"),
};

export function getDataset(skin: SkinId): SkinDataset {
  return DATASETS[skin];
}

export function getArs(skin: SkinId): AppointedRep[] {
  return DATASETS[skin].ars;
}

export function getArById(skin: SkinId, id: string): AppointedRep | null {
  return DATASETS[skin].ars.find((a) => a.id === id) ?? null;
}

export function getBreachesForAr(skin: SkinId, arId: string): BreachReport[] {
  return DATASETS[skin].breaches.filter((b) => b.arId === arId);
}

export function getReviewsForAr(skin: SkinId, arId: string): FileReview[] {
  return DATASETS[skin].reviews.filter((r) => r.arId === arId);
}

export function getMIReturnsForAr(skin: SkinId, arId: string): MIReturn[] {
  return DATASETS[skin].miReturns.filter((m) => m.arId === arId);
}

/**
 * Composite dashboard KPIs derived from the dataset.
 */
export function computeKpis(skin: SkinId) {
  const { ars, breaches, reviews } = DATASETS[skin];
  const critical = ars.filter((a) => a.riskBand === "critical").length;
  const awaitingNotification = breaches.filter((b) => {
    if (!b.notifyByAt) return false;
    if (b.notifiedFcaAt) return false;
    return new Date(b.notifyByAt).getTime() > FIXED_NOW;
  }).length;
  const overdueReviews = ars.filter((a) =>
    new Date(a.nextReviewDueAt).getTime() < FIXED_NOW,
  ).length;
  const dueThisMonth = ars.filter((a) => {
    const d = new Date(a.nextReviewDueAt).getTime();
    return d >= FIXED_NOW && d - FIXED_NOW < 30 * 24 * 3600_000;
  }).length;

  // 14-day breach activity for the heatmap (90 days returned, last 14 surfaced)
  const last90Days = new Array(90).fill(0);
  breaches.forEach((b) => {
    const ageDays = Math.floor((FIXED_NOW - new Date(b.reportedAt).getTime()) / (24 * 3600_000));
    if (ageDays >= 0 && ageDays < 90) {
      last90Days[89 - ageDays]++;
    }
  });

  // Top-10 by risk
  const topRisk = [...ars]
    .filter((a) => a.status !== "terminated")
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 10);

  // Risk-band distribution for the editorial KPI bar.
  const activeArs = ars.filter((a) => a.status === "active");
  const bandDistribution = {
    low: activeArs.filter((a) => a.riskBand === "low").length,
    moderate: activeArs.filter((a) => a.riskBand === "moderate").length,
    elevated: activeArs.filter((a) => a.riskBand === "elevated").length,
    high: activeArs.filter((a) => a.riskBand === "high").length,
    critical: activeArs.filter((a) => a.riskBand === "critical").length,
  };

  return {
    critical,
    awaitingNotification,
    overdueReviews,
    dueThisMonth,
    activeArCount: activeArs.length,
    totalAr: ars.length,
    breachActivity90d: last90Days,
    topRisk,
    bandDistribution,
    completedReviewsThisMonth: reviews.filter((r) => {
      if (!r.completedAt) return false;
      const d = new Date(r.completedAt).getTime();
      return d > FIXED_NOW - 30 * 24 * 3600_000;
    }).length,
  };
}

export function getRequiredActions(skin: SkinId): RequiredAction[] {
  return DATASETS[skin].requiredActions
    .slice()
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, 6);
}

export const FIXED_NOW_TS = FIXED_NOW;
