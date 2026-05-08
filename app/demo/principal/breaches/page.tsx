"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useDemoStore } from "@/lib/state";
import { SKINS } from "@/lib/skins";
import { BreachTriageQueue } from "@/components/principal/breach-triage-queue";

export default function BreachesPage() {
  const skin = useDemoStore((s) => s.skin);
  const skinDef = SKINS[skin];

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 space-y-5">
      <Link
        href="/demo/principal"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Compliance home
      </Link>

      <div>
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
          {skinDef.shortName} · SUP 15 triage
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold leading-tight mt-1">
          Breach triage
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Every breach raised across the network. SUP 15 timing visible at a glance, overdue notifications surfaced first.
        </p>
      </div>

      <BreachTriageQueue />
    </div>
  );
}
