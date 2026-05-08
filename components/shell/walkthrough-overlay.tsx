"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/state";
import { WALKTHROUGH_STEPS, WALKTHROUGH_LENGTH } from "@/lib/walkthrough";

export function WalkthroughOverlay() {
  const pathname = usePathname() ?? "";
  const mode = useDemoStore((s) => s.mode);
  const step = useDemoStore((s) => s.walkthroughStep);
  const advance = useDemoStore((s) => s.advanceWalkthrough);
  const setMode = useDemoStore((s) => s.setMode);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;

  if (mode !== "scripted") return null;
  if (step >= WALKTHROUGH_LENGTH) return null;
  if (pathname === "/") return null; // Hero CTA is the clearer call-to-action on the landing.

  const current = WALKTHROUGH_STEPS[step];
  if (!pathname.startsWith(current.surface)) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-4 inset-x-4 sm:right-4 sm:left-auto sm:bottom-6 sm:max-w-sm z-50"
        role="dialog"
        aria-label="Demo walkthrough"
      >
        <div className="bg-background rounded-2xl shadow-2xl ring-1 ring-border p-4 space-y-3 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-soft/50 via-background to-background"
          />
          <button
            type="button"
            onClick={() => setMode("explore")}
            className="absolute top-2 right-2 size-7 rounded-md grid place-items-center text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            aria-label="Skip walkthrough"
          >
            <X className="size-3.5" />
          </button>
          <div className="flex items-center gap-2 pr-7">
            <span className="size-6 rounded-full bg-amber-soft text-amber-foreground grid place-items-center shrink-0">
              <Sparkles className="size-3.5" />
            </span>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-foreground">
              Step {step + 1} of {WALKTHROUGH_LENGTH}
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold leading-tight">
              {current.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">
              {current.body}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={() => setMode("explore")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip the walkthrough
            </button>
            <Button size="sm" className="gap-1.5" onClick={advance}>
              {step === WALKTHROUGH_LENGTH - 1 ? "Finish" : current.cta}
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
          <div className="flex gap-1 pt-1">
            {WALKTHROUGH_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-amber" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
