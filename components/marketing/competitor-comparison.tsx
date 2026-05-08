"use client";

import { Check, X } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "./section-header";

const COMPARISON = [
  {
    other: "Network maintained as a spreadsheet, often two spreadsheets that disagree",
    ours: "Live register with composite risk scoring, drillable to source. Every change attributed and timestamped.",
  },
  {
    other: "Breach reporting via email, with a separate spreadsheet tracking SUP 15 deadlines",
    ours: "Breach workflow with the SUP 15 clock built in. Three timestamps per breach, FCA-notification countdown front and centre.",
  },
  {
    other: "File reviews on paper with a rubric photocopied from somebody's last pilot",
    ours: "Per-vertical regulatory rubric (MCOB, ICOBS, CONC) shipped with the product. Score per item, root-cause taxonomy aggregates.",
  },
  {
    other: "Quarterly MI returns chased by email, eventually transcribed into the master spreadsheet",
    ours: "AR-side self-service submission. The principal sees the return the moment it's submitted, anomaly-flagged automatically.",
  },
  {
    other: "Annual review packet is a 30-page Word document compiled the week before the deadline",
    ours: "Continuous aggregation. The packet is always one click away with risk trajectory, breaches, reviews, MI, and Consumer Duty outcomes pre-filled.",
  },
  {
    other: "Audit trail lives in email threads and inboxes that nobody can find when an FCA visit lands",
    ours: "Hash-chained immutable audit log, replayable for SUP 12.6A reviews. Every supervisory action recorded, attributed, retrievable.",
  },
];

export function CompetitorComparison() {
  return (
    <section className="py-20 sm:py-28 bg-foreground/[0.04] border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Compared to other tools"
          title="Same job. Done in code instead of in spreadsheets."
          subtitle="Principal-firm oversight is a real operating discipline. The way it's been delivered in market has not kept up with PS22/11."
        />

        <div className="mt-12 grid lg:grid-cols-2 gap-4">
          <ComparisonColumn
            label="How it tends to work today"
            tone="muted"
            items={COMPARISON.map((c) => c.other)}
            icon={X}
          />
          <ComparisonColumn
            label="How Lending Agent Oversight does it"
            tone="primary"
            items={COMPARISON.map((c) => c.ours)}
            icon={Check}
          />
        </div>

        <p className="text-xs text-muted-foreground mt-6 text-center max-w-2xl mx-auto leading-relaxed">
          We don&apos;t name competitors. The principle is widely shared across UK
          principal-firm tooling. The implementation choices vary, and the
          implementation choices are where this product earns its keep.
        </p>
      </div>
    </section>
  );
}

function ComparisonColumn({
  label,
  tone,
  items,
  icon: Icon,
}: {
  label: string;
  tone: "muted" | "primary";
  items: string[];
  icon: typeof Check;
}) {
  const isPrimary = tone === "primary";
  return (
    <Card
      className={
        isPrimary
          ? "p-6 ring-2 ring-amber/40 bg-amber-soft/20"
          : "p-6 bg-background"
      }
    >
      <div className="text-[11px] font-semibold uppercase tracking-wide mb-4 flex items-center gap-1.5">
        <span className={isPrimary ? "text-amber-foreground" : "text-muted-foreground"}>
          {label}
        </span>
      </div>
      <ul className="space-y-4">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: isPrimary ? -8 : 8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex gap-3"
          >
            <span
              className={`size-5 shrink-0 rounded-full grid place-items-center mt-0.5 ${
                isPrimary
                  ? "bg-amber text-amber-foreground"
                  : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              <Icon className="size-3" strokeWidth={3} />
            </span>
            <p className={`text-sm leading-relaxed ${isPrimary ? "text-foreground" : "text-muted-foreground"}`}>
              {item}
            </p>
          </motion.li>
        ))}
      </ul>
    </Card>
  );
}
