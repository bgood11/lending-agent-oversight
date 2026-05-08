"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { SectionHeader } from "./section-header";

const STEPS = [
  {
    number: "01",
    title: "Register every AR",
    description:
      "One row per AR. FRN, permissions, controllers, last review, supporting an Important Business Service, self-employed flag. The register the FCA expects you to keep, in a shape that doesn't go stale.",
    illustration: "/illustrations/step-register.svg",
  },
  {
    number: "02",
    title: "Detect risk early",
    description:
      "Composite risk scores from complaints, breaches, file reviews, MI returns, and the time since you last looked. Five bands, drillable to source. The amber and red bands surface before harm does.",
    illustration: "/illustrations/step-shield.svg",
  },
  {
    number: "03",
    title: "Evidence supervision",
    description:
      "Breach reports, file reviews, MI returns, annual fitness packets. Every step timestamped, every sign-off attributed, every record exportable. Hash-chained audit log, replayable for SUP 12.6A.",
    illustration: "/illustrations/step-evidence.svg",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28 bg-foreground/[0.04] border-y border-border/60 scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="How it works"
          title="Three steps. One supervision loop. Built for PS22/11."
          subtitle="Register every AR, detect risk early, evidence supervision. The job already exists. We just stop it living in spreadsheets."
        />

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-12">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="bg-background rounded-2xl border border-border p-6 aspect-[10/7] grid place-items-center overflow-hidden">
                <div
                  className="text-foreground"
                  style={{ color: "var(--brand-primary)" }}
                >
                  <Image
                    src={step.illustration}
                    alt=""
                    width={200}
                    height={140}
                    className="w-full h-auto"
                    unoptimized
                  />
                </div>
              </div>
              <div className="space-y-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold tabular-nums text-amber-foreground bg-amber-soft px-1.5 py-0.5 rounded">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-semibold leading-tight">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
