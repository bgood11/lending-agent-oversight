"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/state";
import { SKINS } from "@/lib/skins";
import { ArRegisterTable } from "@/components/principal/ar-register-table";

export default function ArRegisterPage() {
  const skin = useDemoStore((s) => s.skin);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;

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

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
            {skinDef.shortName} · {skinDef.rubric} rubric
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold leading-tight mt-1">
            AR register
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Filter, sort, and drill into any AR. The register the FCA expects
            you to keep, in a shape that doesn&apos;t go stale.
          </p>
        </div>
        <Button
          render={<Link href="/demo/principal/register/new" />}
          className="gap-1.5 self-start sm:self-end"
          size="lg"
        >
          <Plus className="size-4" />
          Appoint a new AR or IAR
        </Button>
      </div>

      <ArRegisterTable />
    </div>
  );
}
