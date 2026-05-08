"use client";

import { cn } from "@/lib/utils";
import type { SkinId } from "@/lib/skins";

/**
 * Inline-rendered skin logo SVGs. Each consumes currentColor so the
 * active skin's --brand-primary cascades down. Reuses the family
 * pattern from lending-agent-presenter where logo files in /public
 * exist for static use but components inline for runtime colour.
 */
export function SkinLogo({
  skinId,
  className,
}: {
  skinId: SkinId;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center justify-center", className)}
      style={{ color: "var(--brand-primary)" }}
      aria-hidden
    >
      {skinId === "heritage" && <HeritageMark />}
      {skinId === "crown" && <CrownMark />}
      {skinId === "pinpoint" && <PinpointMark />}
    </span>
  );
}

function HeritageMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M16 4 6 7v8c0 5.5 4 10 10 12 6-2 10-6.5 10-12V7L16 4Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M16 4 6 7v8c0 5.5 4 10 10 12 6-2 10-6.5 10-12V7L16 4Z" />
      <path d="M11 12h10" />
      <path d="M11 16h10" />
    </svg>
  );
}

function CrownMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M5 22V11l4 5 4-7 3 8 3-8 4 7 4-5v11Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M5 22V11l4 5 4-7 3 8 3-8 4 7 4-5v11Z" />
      <path d="M5 26h22" />
    </svg>
  );
}

function PinpointMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M16 5c-4.4 0-8 3.4-8 7.7 0 5.5 8 14.3 8 14.3s8-8.8 8-14.3C24 8.4 20.4 5 16 5Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M16 5c-4.4 0-8 3.4-8 7.7 0 5.5 8 14.3 8 14.3s8-8.8 8-14.3C24 8.4 20.4 5 16 5Z" />
      <circle cx="16" cy="13" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
