"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Landmark,
  Search,
  CalendarClock,
  PartyPopper,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useDemoStore } from "@/lib/state";
import { SKINS } from "@/lib/skins";
import type { ArType, AppointedRep, RubricCode } from "@/lib/types";
import { cn } from "@/lib/utils";

type Stage = 1 | 2 | 3 | 4 | "submitted";

interface EnrichmentBundle {
  registeredOffice: string;
  sicCodes: string[];
  directors: string[];
  pscs: string[];
  charges: number;
  confirmationStatementDue: string;
  creditRating: string;
  creditScore: number;
  ccjsLast24Months: number;
  fcaStatus: "Not yet authorised" | "Authorised" | "Cancelled";
  fcaPermissions: string[];
}

const SUP_124_CHECKS: { id: string; label: string; note: string }[] = [
  {
    id: "fitness",
    label: "Fitness and propriety of the AR firm and its individuals",
    note: "References, regulatory history, criminal-record self-declarations.",
  },
  {
    id: "solvency",
    label: "Solvency and financial standing",
    note: "CreditSafe rating reviewed. Latest filed accounts on file.",
  },
  {
    id: "suitability",
    label: "Suitability of the proposed regulated activities",
    note: "Permission scope matches the firm's resourcing and competence.",
  },
  {
    id: "controllers",
    label: "Controllers and PSC verified",
    note: "Companies House PSC register cross-checked for prohibited persons.",
  },
  {
    id: "resources",
    label: "Resources adequate for the appointed activities",
    note: "Headcount, professional indemnity insurance, T&C arrangements.",
  },
];

const PERMISSION_PRESETS: Record<RubricCode, { code: string; label: string }[]> = {
  MCOB: [
    { code: "MCOB.ADVISE", label: "Advising on regulated mortgage contracts" },
    { code: "MCOB.ARRANGE", label: "Arranging (bringing about) regulated mortgage contracts" },
    { code: "MCOB.MAKING-ARRANGEMENTS", label: "Making arrangements with a view to regulated mortgage contracts" },
    { code: "MCOB.AGREE", label: "Agreeing to carry on a regulated activity" },
  ],
  ICOBS: [
    { code: "ICOBS.ADVISE", label: "Advising on insurance distribution" },
    { code: "ICOBS.ARRANGE", label: "Arranging (bringing about) deals in insurance" },
    { code: "ICOBS.ASSIST", label: "Assisting in the administration and performance of contracts of insurance" },
    { code: "ICOBS.DEAL", label: "Dealing in insurance as agent" },
  ],
  CONC: [
    { code: "CONC.CREDIT-BROKING", label: "Credit broking" },
    { code: "CONC.DEBT-COUNSELLING", label: "Debt counselling" },
    { code: "CONC.AGREEING", label: "Agreeing to carry on a regulated activity" },
  ],
};

const IAR_PERMISSION: { code: string; label: string } = {
  code: "IAR.INTRODUCE",
  label: "Effecting introductions to the principal",
};

export function AppointAr() {
  const router = useRouter();
  const skin = useDemoStore((s) => s.skin);
  const skinDef = SKINS[skin];
  const appendDraft = useDemoStore((s) => s.appendDraftAppointment);

  const [stage, setStage] = useState<Stage>(1);

  // Stage 1
  const [arType, setArType] = useState<ArType>("AR");
  const [tradingName, setTradingName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");

  // Stage 2 (enrichment)
  const [enriching, setEnriching] = useState(false);
  const [enrichment, setEnrichment] = useState<EnrichmentBundle | null>(null);

  // Stage 3
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isSelfEmployed, setSelfEmployed] = useState(false);
  const [supportsIBS, setSupportsIBS] = useState(false);
  const [contractRef, setContractRef] = useState("CONTRACT-2026-V1");
  const [dueDiligence, setDueDiligence] = useState<Record<string, boolean>>({});

  // Stage 4
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [notifyAtIso, setNotifyAtIso] = useState(() => {
    const t = new Date("2026-05-08T00:00:00Z");
    return t.toISOString().slice(0, 10);
  });

  const earliestAppointmentDate = useMemo(() => {
    // PS22/11: 30 calendar days after notification of intent
    const t = new Date(notifyAtIso);
    t.setDate(t.getDate() + 30);
    return t.toISOString().slice(0, 10);
  }, [notifyAtIso]);

  // Companies House autofill simulation
  useEffect(() => {
    if (stage !== 2 || enrichment !== null) return;
    setEnriching(true);
    const t = setTimeout(() => {
      setEnrichment(mockEnrichment(companyNumber || "00000000", legalName || tradingName));
      setEnriching(false);
    }, 1800);
    return () => clearTimeout(t);
  }, [stage, enrichment, companyNumber, legalName, tradingName]);

  const stage1Valid =
    tradingName.trim().length > 1 &&
    legalName.trim().length > 1 &&
    companyNumber.trim().length >= 6;
  const ddPassed = SUP_124_CHECKS.every((c) => dueDiligence[c.id]);
  const stage3Valid = permissions.length > 0 && ddPassed;
  const stage4Valid =
    contactName.trim().length > 1 && /^\S+@\S+\.\S+$/.test(contactEmail);

  function submit() {
    const id = `AR-DRAFT-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date().toISOString();
    const earliest = new Date(earliestAppointmentDate);
    const review = new Date(earliest);
    review.setFullYear(review.getFullYear() + 1);
    const newAr: AppointedRep = {
      id,
      type: arType,
      tradingName: tradingName.trim(),
      legalName: legalName.trim(),
      frn: arType === "AR" ? generateFrn() : null,
      status: "pending-appointment",
      permissions: permissions.map((code) => ({
        code,
        label:
          PERMISSION_PRESETS[skinDef.rubric].find((p) => p.code === code)?.label ??
          (code === IAR_PERMISSION.code ? IAR_PERMISSION.label : code),
        grantedOn: earliest.toISOString(),
        revokedOn: null,
      })),
      city: enrichment?.registeredOffice.split(",").slice(-2, -1)[0]?.trim() ?? "London",
      appointedOn: earliest.toISOString(),
      lastAnnualReviewAt: null,
      nextReviewDueAt: review.toISOString(),
      riskScore: 24,
      riskBand: "moderate",
      isSelfEmployed,
      supportsImportantBusinessService: supportsIBS,
      contact: { name: contactName.trim(), email: contactEmail.trim() },
    };
    appendDraft(newAr);
    setStage("submitted");
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/demo/principal/register"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          AR register
        </Link>
        {stage !== "submitted" && (
          <ProgressDots stage={stage as 1 | 2 | 3 | 4} />
        )}
      </div>

      {stage !== "submitted" && (
        <header>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
            Onboarding · {skinDef.shortName} · SUP 12.4 / SUP 12.5 / PS22/11
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-medium leading-tight tracking-tight mt-1">
            Appoint a {arType === "AR" ? "new appointed representative" : "new introducer AR"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-3xl">
            Four stages. The platform pulls Companies House, CreditSafe, and the FCA Register as you go, drafts the SUP 12.5 written contract, and starts the PS22/11 thirty-day notification clock the moment you submit.
          </p>
        </header>
      )}

      {stage === "submitted" ? (
        <SubmittedView
          arType={arType}
          tradingName={tradingName}
          earliest={earliestAppointmentDate}
          onDone={() => router.push("/demo/principal/register")}
        />
      ) : (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
          <AnimatePresence mode="wait">
            {stage === 1 && (
              <Stage1
                key="s1"
                arType={arType}
                onArType={setArType}
                tradingName={tradingName}
                onTradingName={setTradingName}
                legalName={legalName}
                onLegalName={setLegalName}
                companyNumber={companyNumber}
                onCompanyNumber={setCompanyNumber}
                valid={stage1Valid}
                onNext={() => setStage(2)}
              />
            )}
            {stage === 2 && (
              <Stage2
                key="s2"
                enriching={enriching}
                enrichment={enrichment}
                companyNumber={companyNumber}
                onBack={() => setStage(1)}
                onNext={() => setStage(3)}
              />
            )}
            {stage === 3 && (
              <Stage3
                key="s3"
                arType={arType}
                rubric={skinDef.rubric}
                permissions={permissions}
                onPermissions={setPermissions}
                isSelfEmployed={isSelfEmployed}
                onSelfEmployed={setSelfEmployed}
                supportsIBS={supportsIBS}
                onSupportsIBS={setSupportsIBS}
                contractRef={contractRef}
                onContractRef={setContractRef}
                dueDiligence={dueDiligence}
                onDueDiligence={setDueDiligence}
                valid={stage3Valid}
                onBack={() => setStage(2)}
                onNext={() => setStage(4)}
              />
            )}
            {stage === 4 && (
              <Stage4
                key="s4"
                contactName={contactName}
                onContactName={setContactName}
                contactEmail={contactEmail}
                onContactEmail={setContactEmail}
                notifyAt={notifyAtIso}
                onNotifyAt={setNotifyAtIso}
                earliest={earliestAppointmentDate}
                valid={stage4Valid}
                onBack={() => setStage(3)}
                onSubmit={submit}
              />
            )}
          </AnimatePresence>

          <ContractPreview
            arType={arType}
            tradingName={tradingName}
            legalName={legalName}
            companyNumber={companyNumber}
            enrichment={enrichment}
            permissions={permissions}
            isSelfEmployed={isSelfEmployed}
            supportsIBS={supportsIBS}
            contractRef={contractRef}
            principalName={skinDef.shortName}
            principalFrn={skinDef.frn}
            notifyAt={notifyAtIso}
            earliest={earliestAppointmentDate}
            stage={stage as 1 | 2 | 3 | 4}
          />
        </div>
      )}
    </div>
  );
}

// =====================================================================
// Progress dots
// =====================================================================

function ProgressDots({ stage }: { stage: 1 | 2 | 3 | 4 }) {
  const labels = ["Identity", "Enrichment", "Scope & DD", "Notify"];
  return (
    <div className="hidden md:flex items-center gap-2.5">
      {labels.map((label, i) => {
        const idx = i + 1;
        const active = stage === idx;
        const done = stage > idx;
        return (
          <div key={label} className="flex items-center gap-2.5">
            <div
              className={cn(
                "flex items-center gap-1.5 text-[11px] uppercase tracking-wide font-medium transition-colors",
                done && "text-emerald-700 dark:text-emerald-400",
                active && "text-foreground",
                !done && !active && "text-muted-foreground/50",
              )}
            >
              <span
                className={cn(
                  "size-5 rounded-full grid place-items-center font-mono text-[10px] tabular-nums border transition-colors",
                  done && "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400",
                  active && "bg-foreground text-background border-foreground",
                  !done && !active && "border-border bg-background",
                )}
              >
                {done ? <CheckCircle2 className="size-3" /> : `0${idx}`}
              </span>
              {label}
            </div>
            {idx < labels.length && (
              <span
                className={cn(
                  "h-px w-6 transition-colors",
                  done ? "bg-emerald-500/40" : "bg-border",
                )}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// =====================================================================
// Stage 1 – Identity
// =====================================================================

function Stage1({
  arType,
  onArType,
  tradingName,
  onTradingName,
  legalName,
  onLegalName,
  companyNumber,
  onCompanyNumber,
  valid,
  onNext,
}: {
  arType: ArType;
  onArType: (t: ArType) => void;
  tradingName: string;
  onTradingName: (s: string) => void;
  legalName: string;
  onLegalName: (s: string) => void;
  companyNumber: string;
  onCompanyNumber: (s: string) => void;
  valid: boolean;
  onNext: () => void;
}) {
  return (
    <StageWrap n={1} title="Identity" subtitle="The firm and its appointment type. Required to start a SUP 12.4 due-diligence file.">
      <Card className="p-6 space-y-6">
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wide font-medium">
            Appointment type
          </Label>
          <div className="grid sm:grid-cols-2 gap-2.5">
            <ArTypeOption
              type="AR"
              title="Appointed Representative"
              desc="Full appointment. The AR carries on the principal's regulated activities within scope."
              active={arType === "AR"}
              onClick={() => onArType("AR")}
            />
            <ArTypeOption
              type="IAR"
              title="Introducer Appointed Representative"
              desc="Limited to effecting introductions to the principal. Cannot advise, arrange, or deal."
              active={arType === "IAR"}
              onClick={() => onArType("IAR")}
            />
          </div>
        </div>
        <Separator />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="trading">Trading name</Label>
            <Input
              id="trading"
              value={tradingName}
              onChange={(e) => onTradingName(e.target.value)}
              placeholder="e.g. Pemberton Mortgages"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="legal">Legal name</Label>
            <Input
              id="legal"
              value={legalName}
              onChange={(e) => onLegalName(e.target.value)}
              placeholder="e.g. Pemberton Mortgages Ltd"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="cn">Companies House number</Label>
            <div className="relative">
              <Input
                id="cn"
                value={companyNumber}
                onChange={(e) =>
                  onCompanyNumber(e.target.value.replace(/[^A-Z0-9]/gi, "").toUpperCase())
                }
                placeholder="e.g. 09812233"
                className="pr-24 font-mono"
                maxLength={10}
              />
              <Badge
                variant="outline"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] gap-1"
              >
                <Search className="size-3" />
                Lookup on next
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              We&apos;ll pull controllers, charges, and the confirmation-statement
              cycle from Companies House on the next step.
            </p>
          </div>
        </div>
      </Card>
      <div className="flex justify-end">
        <Button size="lg" disabled={!valid} onClick={onNext} className="gap-1.5">
          Run enrichment
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </StageWrap>
  );
}

function ArTypeOption({
  type,
  title,
  desc,
  active,
  onClick,
}: {
  type: ArType;
  title: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left rounded-xl border p-4 transition-all",
        active
          ? "border-foreground bg-foreground/[0.03] shadow-[0_0_0_3px_rgb(0_0_0/0.04)]"
          : "border-border hover:border-foreground/40 hover:bg-muted/30",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "size-4 rounded-full border-2 flex-none transition-colors",
            active ? "border-foreground bg-foreground" : "border-border",
          )}
          aria-hidden
        />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {type}
        </span>
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mt-2 ml-6">
        {desc}
      </p>
    </button>
  );
}

// =====================================================================
// Stage 2 – Enrichment
// =====================================================================

function Stage2({
  enriching,
  enrichment,
  companyNumber,
  onBack,
  onNext,
}: {
  enriching: boolean;
  enrichment: EnrichmentBundle | null;
  companyNumber: string;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <StageWrap
      n={2}
      title="Enrichment"
      subtitle="Pulling source-of-truth facts from public and commercial APIs. No retyping."
    >
      <div className="space-y-3">
        <EnrichmentCard
          icon={Building2}
          title="Companies House"
          subtitle={`Company ${companyNumber || "—"}`}
          loadingLabel="Looking up Companies House…"
          delay={0}
          enriching={enriching}
          rows={
            enrichment
              ? [
                  ["Registered office", enrichment.registeredOffice],
                  ["SIC codes", enrichment.sicCodes.join(" · ")],
                  ["Directors", enrichment.directors.join(", ")],
                  ["Persons with significant control", enrichment.pscs.join(", ")],
                  ["Outstanding charges", String(enrichment.charges)],
                  ["Confirmation statement due", enrichment.confirmationStatementDue],
                ]
              : []
          }
        />
        <EnrichmentCard
          icon={ShieldCheck}
          title="CreditSafe"
          subtitle="Credit standing"
          loadingLabel="Pulling credit rating…"
          delay={700}
          enriching={enriching}
          rows={
            enrichment
              ? [
                  ["Rating", enrichment.creditRating],
                  ["Score", `${enrichment.creditScore}/100`],
                  [
                    "CCJs in last 24 months",
                    String(enrichment.ccjsLast24Months),
                  ],
                ]
              : []
          }
        />
        <EnrichmentCard
          icon={Landmark}
          title="FCA Register"
          subtitle="Authorisation status"
          loadingLabel="Cross-checking FRN…"
          delay={1300}
          enriching={enriching}
          rows={
            enrichment
              ? [
                  ["Status", enrichment.fcaStatus],
                  [
                    "Permissions on Register",
                    enrichment.fcaPermissions.length > 0
                      ? enrichment.fcaPermissions.join(", ")
                      : "—",
                  ],
                ]
              : []
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button
          size="lg"
          disabled={enriching || !enrichment}
          onClick={onNext}
          className="gap-1.5"
        >
          Configure scope
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </StageWrap>
  );
}

function EnrichmentCard({
  icon: Icon,
  title,
  subtitle,
  loadingLabel,
  delay,
  enriching,
  rows,
}: {
  icon: typeof Building2;
  title: string;
  subtitle: string;
  loadingLabel: string;
  delay: number;
  enriching: boolean;
  rows: [string, string][];
}) {
  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-3 bg-muted/30 border-b border-border flex items-center gap-3">
        <div className="size-8 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 grid place-items-center">
          <Icon className="size-4" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">{title}</div>
          <div className="text-[11px] text-muted-foreground font-mono">{subtitle}</div>
        </div>
        {enriching ? (
          <Badge className="bg-amber-soft text-amber-foreground border-amber/30 gap-1 text-[10px]">
            <Loader2 className="size-2.5 animate-spin" />
            {loadingLabel}
          </Badge>
        ) : (
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] gap-1">
            <CheckCircle2 className="size-2.5" />
            Synced
          </Badge>
        )}
      </div>
      <div className="px-5 py-4">
        {enriching ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                <div className="h-3 flex-1 bg-muted/60 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <dl className="grid gap-1.5 text-sm">
            {rows.map(([k, v], i) => (
              <motion.div
                key={k}
                className="grid grid-cols-[180px_1fr] gap-3"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: (delay + i * 80) / 1000,
                  duration: 0.25,
                  ease: "easeOut",
                }}
              >
                <dt className="text-muted-foreground text-xs">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </motion.div>
            ))}
          </dl>
        )}
      </div>
    </Card>
  );
}

// =====================================================================
// Stage 3 – Scope & due diligence
// =====================================================================

function Stage3(props: {
  arType: ArType;
  rubric: RubricCode;
  permissions: string[];
  onPermissions: (p: string[]) => void;
  isSelfEmployed: boolean;
  onSelfEmployed: (v: boolean) => void;
  supportsIBS: boolean;
  onSupportsIBS: (v: boolean) => void;
  contractRef: string;
  onContractRef: (s: string) => void;
  dueDiligence: Record<string, boolean>;
  onDueDiligence: (v: Record<string, boolean>) => void;
  valid: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  const presets =
    props.arType === "IAR" ? [IAR_PERMISSION] : PERMISSION_PRESETS[props.rubric];
  const togglePerm = (code: string) => {
    if (props.arType === "IAR") {
      props.onPermissions([code]);
      return;
    }
    props.onPermissions(
      props.permissions.includes(code)
        ? props.permissions.filter((p) => p !== code)
        : [...props.permissions, code],
    );
  };

  return (
    <StageWrap
      n={3}
      title="Scope & due diligence"
      subtitle="The SUP 12.5 written contract scope and the SUP 12.4 pre-appointment checklist."
    >
      <Card className="p-6 space-y-5">
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wide font-medium">
            Permitted activities
          </Label>
          <div className="grid sm:grid-cols-2 gap-2">
            {presets.map((p) => {
              const checked = props.permissions.includes(p.code);
              return (
                <label
                  key={p.code}
                  className={cn(
                    "rounded-lg border p-3 flex items-start gap-3 cursor-pointer transition-colors",
                    checked
                      ? "border-foreground/60 bg-foreground/[0.03]"
                      : "border-border hover:bg-muted/40",
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => togglePerm(p.code)}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {p.code}
                    </div>
                    <div className="text-sm leading-snug">{p.label}</div>
                  </div>
                </label>
              );
            })}
          </div>
          {props.arType === "IAR" && (
            <p className="text-[11px] text-amber-foreground bg-amber-soft/50 border border-amber/30 rounded px-2.5 py-1.5">
              IARs are limited to introductions only. Permission scope is
              fixed by SUP 12.2 and cannot be extended via the appointment
              contract.
            </p>
          )}
        </div>

        <Separator />

        <div className="grid sm:grid-cols-2 gap-3">
          <ToggleCard
            checked={props.isSelfEmployed}
            onCheckedChange={props.onSelfEmployed}
            title="Self-employed AR cohort"
            note="PS22/11 enhanced oversight applies. Risk model up-weights this AR."
          />
          <ToggleCard
            checked={props.supportsIBS}
            onCheckedChange={props.onSupportsIBS}
            title="Important Business Service"
            note="SYSC 15A. AR's resilience posture rolls up to the principal's resilience register."
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <Label htmlFor="contract" className="text-xs uppercase tracking-wide font-medium">
            SUP 12.5 written contract reference
          </Label>
          <Input
            id="contract"
            value={props.contractRef}
            onChange={(e) => props.onContractRef(e.target.value)}
            className="font-mono"
          />
          <p className="text-[11px] text-muted-foreground">
            Reference to the executed contract version held on file. The
            annual review packet renders the contract in force at each
            cycle.
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-wide font-medium">
              SUP 12.4 due-diligence checklist
            </Label>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {Object.values(props.dueDiligence).filter(Boolean).length}/
              {SUP_124_CHECKS.length}
            </span>
          </div>
          <ul className="divide-y divide-border rounded-lg border border-border overflow-hidden">
            {SUP_124_CHECKS.map((c) => (
              <li
                key={c.id}
                className="px-4 py-3 flex items-start gap-3 bg-card"
              >
                <Checkbox
                  checked={!!props.dueDiligence[c.id]}
                  onCheckedChange={(v) =>
                    props.onDueDiligence({
                      ...props.dueDiligence,
                      [c.id]: v === true,
                    })
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium leading-tight">
                    {c.label}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {c.note}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={props.onBack} className="gap-1.5">
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button
          size="lg"
          disabled={!props.valid}
          onClick={props.onNext}
          className="gap-1.5"
        >
          Notification of intent
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </StageWrap>
  );
}

function ToggleCard({
  checked,
  onCheckedChange,
  title,
  note,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  title: string;
  note: string;
}) {
  return (
    <label
      className={cn(
        "rounded-lg border p-3 flex items-start gap-3 cursor-pointer transition-colors",
        checked ? "border-amber/60 bg-amber-soft/30" : "border-border hover:bg-muted/40",
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="mt-0.5"
      />
      <div>
        <div className="text-sm font-medium leading-tight">{title}</div>
        <div className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
          {note}
        </div>
      </div>
    </label>
  );
}

// =====================================================================
// Stage 4 – Notify & confirm
// =====================================================================

function Stage4(props: {
  contactName: string;
  onContactName: (s: string) => void;
  contactEmail: string;
  onContactEmail: (s: string) => void;
  notifyAt: string;
  onNotifyAt: (s: string) => void;
  earliest: string;
  valid: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <StageWrap
      n={4}
      title="Notify the FCA"
      subtitle="PS22/11: notification of intent at least 30 calendar days before the appointment takes effect."
    >
      <Card className="p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="cname">AR senior contact (name)</Label>
            <Input
              id="cname"
              value={props.contactName}
              onChange={(e) => props.onContactName(e.target.value)}
              placeholder="e.g. Imogen Pemberton"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cemail">Contact email</Label>
            <Input
              id="cemail"
              type="email"
              value={props.contactEmail}
              onChange={(e) => props.onContactEmail(e.target.value)}
              placeholder="senior@ar-firm.co.uk"
            />
          </div>
        </div>

        <div className="rounded-xl border border-amber/40 bg-amber-soft/30 p-5">
          <div className="flex items-center gap-2 text-amber-foreground">
            <CalendarClock className="size-4" />
            <span className="text-sm font-medium">
              Notification of intent — PS22/11
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="space-y-1.5">
              <Label htmlFor="notify" className="text-xs">
                Date FCA will be notified
              </Label>
              <Input
                id="notify"
                type="date"
                value={props.notifyAt}
                onChange={(e) => props.onNotifyAt(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Earliest appointment date</Label>
              <div className="h-9 px-3 py-1 rounded-md border border-border bg-muted/40 text-sm flex items-center font-mono tabular-nums">
                {formatLong(props.earliest)}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-amber-foreground/80 mt-3 leading-relaxed">
            The thirty-day window gives the FCA time to object. The platform
            opens the AR record on the register with status{" "}
            <span className="font-mono">pending-appointment</span>. The status
            flips to <span className="font-mono">active</span> on the
            appointment date provided no objection is raised.
          </p>
        </div>
      </Card>
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={props.onBack} className="gap-1.5">
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button
          size="lg"
          disabled={!props.valid}
          onClick={props.onSubmit}
          className="gap-1.5"
        >
          <Sparkles className="size-4" />
          Submit notification of intent
        </Button>
      </div>
    </StageWrap>
  );
}

// =====================================================================
// Submitted view
// =====================================================================

function SubmittedView({
  arType,
  tradingName,
  earliest,
  onDone,
}: {
  arType: ArType;
  tradingName: string;
  earliest: string;
  onDone: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-xl mx-auto py-12 text-center"
    >
      <motion.div
        initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto size-20 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 grid place-items-center"
      >
        <PartyPopper className="size-10" />
      </motion.div>
      <h2 className="font-display text-3xl font-medium mt-6 leading-tight">
        Notification submitted.
      </h2>
      <p className="text-muted-foreground mt-3 leading-relaxed">
        {tradingName || (arType === "AR" ? "Your AR" : "Your IAR")} is on the
        register with status{" "}
        <span className="font-mono text-foreground">pending-appointment</span>.
        The earliest appointment date is{" "}
        <span className="font-medium text-foreground">{formatLong(earliest)}</span>.
        We&apos;ve drafted the SUP 12.5 contract, attached the SUP 12.4
        evidence pack, and started the audit chain.
      </p>
      <div className="flex items-center justify-center gap-3 mt-8">
        <Button variant="outline" onClick={onDone}>
          Back to register
        </Button>
        <Button render={<Link href="/demo/principal/register/new" />}>
          Appoint another
        </Button>
      </div>
    </motion.div>
  );
}

// =====================================================================
// Sticky live contract preview
// =====================================================================

function ContractPreview({
  arType,
  tradingName,
  legalName,
  companyNumber,
  enrichment,
  permissions,
  isSelfEmployed,
  supportsIBS,
  contractRef,
  principalName,
  principalFrn,
  notifyAt,
  earliest,
  stage,
}: {
  arType: ArType;
  tradingName: string;
  legalName: string;
  companyNumber: string;
  enrichment: EnrichmentBundle | null;
  permissions: string[];
  isSelfEmployed: boolean;
  supportsIBS: boolean;
  contractRef: string;
  principalName: string;
  principalFrn: string;
  notifyAt: string;
  earliest: string;
  stage: 1 | 2 | 3 | 4;
}) {
  const filledFields = useMemo(() => {
    let n = 0;
    if (tradingName) n++;
    if (legalName) n++;
    if (companyNumber) n++;
    if (enrichment) n += 3;
    if (permissions.length > 0) n++;
    if (contractRef) n++;
    if (notifyAt) n++;
    return n;
  }, [
    tradingName,
    legalName,
    companyNumber,
    enrichment,
    permissions.length,
    contractRef,
    notifyAt,
  ]);
  const totalFields = 10;

  return (
    <Card className="lg:sticky lg:top-32 self-start overflow-hidden">
      <div className="px-5 py-3 bg-foreground text-background flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScrollText className="size-4" />
          <span className="text-sm font-medium tracking-tight">Draft contract</span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider opacity-70">
          {contractRef || "—"}
        </span>
      </div>
      <div className="p-5 space-y-4 text-sm">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
            Principal
          </div>
          <div className="font-medium leading-tight mt-0.5">{principalName}</div>
          <div className="text-[11px] text-muted-foreground font-mono">FRN {principalFrn}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
            Appointed Representative
          </div>
          <div className="font-medium leading-tight mt-0.5">
            {tradingName || <span className="text-muted-foreground/50 italic">— trading name —</span>}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {legalName || <span className="italic">— legal name —</span>}
            {companyNumber && <> · CRN {companyNumber}</>}
          </div>
          <Badge variant="outline" className="text-[10px] mt-1.5">
            {arType === "AR" ? "Full AR" : "IAR (introducer only)"}
          </Badge>
        </div>
        <Separator />
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
            Permitted activities (SUP 12.5)
          </div>
          {permissions.length === 0 ? (
            <p className="text-muted-foreground/50 italic text-xs mt-1">
              — selected on stage 3 —
            </p>
          ) : (
            <ul className="text-xs mt-1.5 space-y-1">
              {permissions.map((p) => (
                <li key={p} className="flex items-start gap-1.5">
                  <span className="text-muted-foreground">·</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {enrichment && stage >= 2 && (
          <>
            <Separator />
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                Controllers (Companies House)
              </div>
              <p className="text-xs mt-1 leading-relaxed">
                {enrichment.directors.join(", ")}
              </p>
            </div>
          </>
        )}
        {(isSelfEmployed || supportsIBS) && (
          <>
            <Separator />
            <div className="flex flex-wrap gap-1.5">
              {isSelfEmployed && (
                <Badge className="bg-amber-soft text-amber-foreground border-amber/30 text-[10px]">
                  Self-employed cohort
                </Badge>
              )}
              {supportsIBS && (
                <Badge className="bg-amber-soft text-amber-foreground border-amber/30 text-[10px]">
                  Important Business Service
                </Badge>
              )}
            </div>
          </>
        )}
        <Separator />
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <div className="text-muted-foreground">Notify FCA</div>
            <div className="font-mono tabular-nums">{notifyAt}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Earliest appointment</div>
            <div className="font-mono tabular-nums">{earliest}</div>
          </div>
        </div>
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Contract assembly</span>
            <span className="font-mono tabular-nums">
              {filledFields}/{totalFields}
            </span>
          </div>
          <div className="h-1 mt-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-foreground"
              initial={{ width: 0 }}
              animate={{ width: `${(filledFields / totalFields) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

// =====================================================================
// Stage wrapper – consistent motion + layout
// =====================================================================

function StageWrap({
  n,
  title,
  subtitle,
  children,
}: {
  n: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-4"
    >
      <div className="flex items-baseline gap-3">
        <span className="font-display text-4xl font-medium text-amber tabular-nums leading-none">
          0{n}
        </span>
        <div>
          <h2 className="font-display text-xl font-medium leading-tight">{title}</h2>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1 max-w-xl">
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

// =====================================================================
// Helpers
// =====================================================================

function formatLong(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function generateFrn(): string {
  const n = 700000 + Math.floor(Math.random() * 99999);
  return String(n);
}

function mockEnrichment(cn: string, name: string): EnrichmentBundle {
  const seed = (cn + name).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const score = 60 + (seed % 36);
  const directors = ["Imogen Pemberton", "Henry Pemberton"];
  const ratings = ["A — low risk", "B — average", "C — caution"];
  return {
    registeredOffice: "12 Albion Street, Manchester, M1 4XR",
    sicCodes: ["66220 — Activities of insurance agents and brokers"],
    directors,
    pscs: [directors[0]],
    charges: 0,
    confirmationStatementDue: "14 March 2027",
    creditRating: ratings[seed % ratings.length],
    creditScore: score,
    ccjsLast24Months: 0,
    fcaStatus: "Not yet authorised",
    fcaPermissions: [],
  };
}
