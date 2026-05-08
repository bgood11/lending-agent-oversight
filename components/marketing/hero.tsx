"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { HeroPreview } from "./hero-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_15%_0%,theme(colors.amber.500/0.18),transparent),radial-gradient(ellipse_60%_60%_at_85%_30%,theme(colors.amber.500/0.10),transparent)]"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-soft text-amber-foreground">
              <Sparkles className="size-3" />
              Demo · part of the Lending Agent family
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium leading-[0.98] tracking-tight">
              Your AR network,
              <br />
              <em className="not-italic bg-gradient-to-br from-amber-500 to-orange-600 bg-clip-text text-transparent">
                supervised properly.
              </em>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              An operating system for principal firms. Register every AR. Detect risk early. Evidence supervision the way the FCA expects, with PS22/11 baked in.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="gap-2 h-12 text-base"
                render={<Link href="/demo/principal" />}
              >
                See it in action
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 h-12"
                render={
                  <a
                    href="https://lending-agent-oversight-docs.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                Read the docs
                <ExternalLink className="size-4" />
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground pt-2">
              <BulletPoint>No sign-up</BulletPoint>
              <BulletPoint>Three principal-firm skins</BulletPoint>
              <BulletPoint>PS22/11-aligned</BulletPoint>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <HeroPreview />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BulletPoint({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-1 rounded-full bg-amber" aria-hidden />
      {children}
    </span>
  );
}
