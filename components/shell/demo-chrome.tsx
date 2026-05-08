"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useDemoStore } from "@/lib/state";
import { SKINS } from "@/lib/skins";
import { SkinLogo } from "./skin-logo";
import { SkinSwitcher } from "./skin-switcher";
import { PersonaSwitcher } from "./persona-switcher";
import { ModeToggle } from "./mode-toggle";

/**
 * Shared demo chrome. The top strip carries the principal-firm
 * branding, persona switcher, skin switcher, and mode toggle.
 * Persona-specific differences are subtle: AR-side gets a slightly
 * taller strip and a Fraunces-set greeting (handled per-page).
 */
export function DemoChrome() {
  const skin = useDemoStore((s) => s.skin);
  const skinDef = SKINS[skin];

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">Lending Agent Oversight</span>
        </Link>

        <div className="h-6 w-px bg-border mx-1" aria-hidden />

        <div className="flex items-center gap-2 min-w-0">
          <span
            className="inline-grid place-items-center rounded-md ring-1 ring-[color:var(--brand-primary)]/20 bg-[color:var(--brand-primary)]/5 size-7 shrink-0 transition-shadow hover:ring-[color:var(--brand-primary)]/40"
            aria-hidden
          >
            <SkinLogo skinId={skin} className="size-5" />
          </span>
          <span className="font-medium text-sm truncate hidden sm:inline">
            {skinDef.shortName}
          </span>
          <span className="hidden lg:inline text-[11px] text-muted-foreground tabular-nums font-mono">
            FRN {skinDef.frn}
          </span>
        </div>

        <div className="flex-1" />

        <PersonaSwitcher />
        <SkinSwitcher />
        <ModeToggle />
      </div>
      {/* Per-skin brand rail — proves the tenant skin is in effect at a
          glance and gives every surface an unambiguous brand presence. */}
      <div
        aria-hidden
        className="h-[2px] w-full"
        style={{ background: "var(--brand-primary)" }}
      />
    </header>
  );
}
