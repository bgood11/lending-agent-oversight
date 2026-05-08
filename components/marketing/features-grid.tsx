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

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 sm:py-28 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Features"
          title="What makes the loop work"
          subtitle="Six choices that turn supervision from a quarterly scramble into a continuous, evidenced practice."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.35, delay: (i % 3) * 0.06 }}
            >
              <Card className="p-6 h-full hover:shadow-md transition-shadow">
                <div className="size-10 rounded-lg bg-amber-soft text-amber-foreground grid place-items-center mb-4">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="font-semibold leading-tight mb-2">
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
