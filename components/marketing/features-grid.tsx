"use client";

import {
  Activity,
  ClipboardCheck,
  ClipboardList,
  Layers,
  ScrollText,
  AlertTriangle,
} from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "./section-header";

const FEATURES = [
  {
    icon: Activity,
    title: "Composite risk scoring",
    description:
      "One score per AR, derived from the things you already track. Five bands. Drill into any score to see exactly how it was built. Tunable weights with a backtest.",
  },
  {
    icon: AlertTriangle,
    title: "Breach workflow with FCA timing",
    description:
      "SUP 15 notification clocks built in. The countdown is the centrepiece, because the deadline is the only thing that matters. Step-up auth on the Notify FCA action.",
  },
  {
    icon: ClipboardList,
    title: "File review with regulatory rubric",
    description:
      "MCOB, ICOBS, CONC checklists ship with the product. Score every case against the rule that actually applies, with handbook codes inline.",
  },
  {
    icon: ClipboardCheck,
    title: "AR self-service MI returns",
    description:
      "Quarterly returns submitted by the AR, visible to the principal the moment they land. No more spreadsheet email-tag, no more chase.",
  },
  {
    icon: ScrollText,
    title: "Annual fitness review packets",
    description:
      "Risk trajectory, breaches, reviews, MI, conduct events, Consumer Duty outcomes. One scrolling document. Director sign-off built in.",
  },
  {
    icon: Layers,
    title: "Multi-vertical skinning",
    description:
      "Mortgage, GI, credit broking. Each principal firm gets its own brand and its own rubric. The platform doesn't care which vertical you supervise.",
  },
];

function FeatureStat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display text-xl font-medium tabular-nums leading-none">
        {n}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
        {label}
      </div>
    </div>
  );
}

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 sm:py-28 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Features"
          title="What makes the loop work"
          subtitle="Six choices that turn supervision from a quarterly scramble into a continuous, evidenced practice."
        />

        {/* Editorial composition: lead feature occupies 2x2, supporting
            features fill the rest. The lead is the headline value
            proposition (composite risk scoring), so it earns the room. */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12 auto-rows-[1fr]">
          {/* Lead feature, 2x2 */}
          <motion.div
            key={FEATURES[0].title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.35 }}
            className="md:col-span-2 md:row-span-2"
          >
            <Card className="relative overflow-hidden p-7 lg:p-8 h-full flex flex-col">
              <div
                aria-hidden
                className="absolute -top-24 -right-24 size-72 rounded-full opacity-[0.10] blur-3xl bg-amber"
              />
              <div className="relative flex flex-col h-full">
                <div className="size-12 rounded-xl bg-amber text-amber-foreground grid place-items-center mb-5">
                  {(() => {
                    const Icon = FEATURES[0].icon;
                    return <Icon className="size-6" />;
                  })()}
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-medium leading-tight tracking-tight mb-3">
                  {FEATURES[0].title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {FEATURES[0].description}
                </p>
                <div className="mt-auto pt-5 border-t border-border/60 grid grid-cols-3 gap-3">
                  <FeatureStat n="5" label="bands" />
                  <FeatureStat n="5" label="inputs" />
                  <FeatureStat n="100%" label="explainable" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Supporting features, 1x1 each */}
          {FEATURES.slice(1).map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.35, delay: (i % 3) * 0.06 }}
            >
              <Card className="p-6 h-full hover:shadow-md transition-shadow flex flex-col">
                <div className="size-9 rounded-lg bg-amber-soft text-amber-foreground grid place-items-center mb-3">
                  <feature.icon className="size-4.5" />
                </div>
                <h3 className="font-semibold leading-tight mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
