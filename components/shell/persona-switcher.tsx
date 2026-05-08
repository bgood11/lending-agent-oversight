"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/lib/state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Two-state segmented control flipping between principal and AR
 * personas. The first crossing in scripted mode opens a confirmation
 * modal explaining the boundary; subsequent switches are silent
 * (toast handled by the demo chrome). The architectural showpiece.
 */
export function PersonaSwitcher() {
  const persona = useDemoStore((s) => s.persona);
  const setPersona = useDemoStore((s) => s.setPersona);
  const personaSwitchSeen = useDemoStore((s) => s.personaSwitchSeen);
  const markPersonaSwitchSeen = useDemoStore((s) => s.markPersonaSwitchSeen);
  const advance = useDemoStore((s) => s.advanceWalkthrough);
  const mode = useDemoStore((s) => s.mode);

  const router = useRouter();
  const pathname = usePathname() ?? "";
  const [confirmTarget, setConfirmTarget] = useState<"principal-compliance-officer" | "ar-user" | null>(null);

  const isPrincipalSide = pathname.startsWith("/demo/principal");
  const isArSide = pathname.startsWith("/demo/ar");
  const activeKey: "principal" | "ar" = isArSide
    ? "ar"
    : isPrincipalSide
      ? "principal"
      : persona === "ar-user"
        ? "ar"
        : "principal";

  function commit(target: "principal-compliance-officer" | "ar-user") {
    setPersona(target);
    if (target === "ar-user") {
      router.push("/demo/ar");
      if (mode === "scripted") advance();
    } else {
      router.push("/demo/principal");
    }
  }

  function attempt(target: "principal-compliance-officer" | "ar-user") {
    if (mode === "scripted" && !personaSwitchSeen && target === "ar-user") {
      setConfirmTarget(target);
    } else {
      commit(target);
    }
  }

  return (
    <>
      <div
        className="inline-flex items-center gap-0.5 rounded-md border border-border bg-muted/40 p-0.5"
        role="tablist"
        aria-label="Persona"
        data-walkthrough="persona-switcher"
      >
        <PersonaPill
          active={activeKey === "principal"}
          icon={Briefcase}
          label="Principal"
          mobileLabel="P"
          onClick={() => attempt("principal-compliance-officer")}
        />
        <PersonaPill
          active={activeKey === "ar"}
          icon={User}
          label="AR"
          mobileLabel="AR"
          onClick={() => attempt("ar-user")}
        />
      </div>

      <Dialog
        open={confirmTarget !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmTarget(null);
        }}
      >
        {/* Bottom sheet on mobile (sm:bottom-auto removes the bottom
            anchoring at the sm breakpoint), centred dialog on
            tablet/desktop. The persona switch is the demo's
            architectural showpiece — on mobile a sheet from the
            bottom is closer to the cinematic "different shoes"
            metaphor than a small centred modal. */}
        <DialogContent className="max-w-md sm:max-w-md max-sm:rounded-t-2xl max-sm:rounded-b-none max-sm:bottom-0 max-sm:top-auto max-sm:left-0 max-sm:right-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:w-full max-sm:max-w-none max-sm:px-5 max-sm:pt-6 max-sm:pb-6 max-sm:data-[state=closed]:slide-out-to-bottom max-sm:data-[state=open]:slide-in-from-bottom">
          <div className="mx-auto sm:hidden mb-2 h-1 w-10 rounded-full bg-muted" aria-hidden />
          <DialogHeader>
            <DialogTitle>You are now the AR</DialogTitle>
            <DialogDescription className="leading-relaxed">
              Same skin, same network, different shoes. You&apos;ll see what
              the AR sees on their own dashboard. The principal-side
              state is preserved in the background, you can flip back at
              any time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 max-sm:flex-col-reverse max-sm:gap-2 max-sm:[&>*]:w-full">
            <Button
              variant="outline"
              onClick={() => setConfirmTarget(null)}
            >
              Stay as the principal
            </Button>
            <Button
              className="gap-1.5"
              onClick={() => {
                if (!confirmTarget) return;
                markPersonaSwitchSeen();
                commit(confirmTarget);
                setConfirmTarget(null);
              }}
            >
              Got it, take me there
              <ArrowRight className="size-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PersonaPill({
  active,
  icon: Icon,
  label,
  mobileLabel,
  onClick,
}: {
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  mobileLabel?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-1.5 rounded px-2 sm:px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {active && (
        <motion.div
          layoutId="persona-active"
          className="absolute inset-0 rounded bg-background shadow-xs ring-1 ring-border"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative flex items-center gap-1.5">
        <Icon className="size-3.5" />
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">{mobileLabel ?? label}</span>
      </span>
    </button>
  );
}
