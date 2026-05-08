"use client";

import Link from "next/link";
import { ArrowUpRight, Building2, User } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "./section-header";

const AUDIENCES = [
  {
    icon: Building2,
    label: "For principal firms",
    title: "If you supervise an AR network",
    body: "Mortgage broking, general insurance, investment advice, credit broking. PS22/11 turned 'you should supervise' into 'you must evidence supervision'. This is the operating system for that mandate.",
    href: "https://lending-agent-oversight-docs.vercel.app/implementation/principal/adoption-path/",
  },
  {
    icon: User,
    label: "For ARs",
    title: "If you carry on regulated activity under a principal",
    body: "Submit MI returns in seconds. File breaches with the SUP 15 clock visible. See your own risk score and your principal's recent comms. Designed so the AR's own life is easier, not just the principal's.",
    href: "https://lending-agent-oversight-docs.vercel.app/implementation/ar/adoption-path/",
  },
];

export function AudienceCards() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Who this is for"
          title="Two audiences, one shared surface"
          subtitle="Principal compliance and AR are both real users. Both surfaces are designed for daily use, not occasional inspection."
        />

        <div className="grid md:grid-cols-2 gap-4 mt-12">
          {AUDIENCES.map((aud, i) => (
            <motion.div
              key={aud.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
            >
              <Card className="p-7 h-full hover:shadow-md transition-shadow group relative overflow-hidden">
                <div
                  aria-hidden
                  className="absolute -top-12 -right-12 size-40 rounded-full bg-amber/10 group-hover:bg-amber/20 transition-colors"
                />
                <div className="relative">
                  <div className="size-11 rounded-xl bg-amber-soft text-amber-foreground grid place-items-center mb-5">
                    <aud.icon className="size-5" />
                  </div>
                  <div className="text-[11px] uppercase tracking-wide font-semibold text-amber-foreground/80 mb-1">
                    {aud.label}
                  </div>
                  <h3 className="text-xl font-semibold leading-tight">
                    {aud.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                    {aud.body}
                  </p>
                  <Link
                    href={aud.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-5 group-hover:underline"
                  >
                    Read the adoption path
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
