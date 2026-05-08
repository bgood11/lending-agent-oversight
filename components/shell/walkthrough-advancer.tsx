"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDemoStore } from "@/lib/state";

/**
 * Watches surface transitions and bumps the walkthrough step floor.
 * Pure side-effect, no UI.
 */
const SURFACE_FLOORS: Array<{ prefix: string; floor: number }> = [
  { prefix: "/demo/principal/annual-reviews", floor: 9 },
  { prefix: "/demo/principal/reviews", floor: 8 },
  { prefix: "/demo/principal/breaches", floor: 7 },
  { prefix: "/demo/ar/breaches/new", floor: 6 },
  { prefix: "/demo/ar/mi", floor: 5 },
  { prefix: "/demo/ar", floor: 4 },
  { prefix: "/demo/principal/register", floor: 2 },
  { prefix: "/demo/principal", floor: 1 },
  { prefix: "/", floor: 0 },
];

export function WalkthroughAdvancer() {
  const pathname = usePathname() ?? "/";
  const mode = useDemoStore((s) => s.mode);
  const step = useDemoStore((s) => s.walkthroughStep);
  const setWalkthroughStep = useDemoStore((s) => s.setWalkthroughStep);

  useEffect(() => {
    if (mode !== "scripted") return;
    const match = SURFACE_FLOORS.find((s) => pathname.startsWith(s.prefix));
    if (!match) return;
    if (step < match.floor) {
      setWalkthroughStep(match.floor);
    }
  }, [pathname, mode, step, setWalkthroughStep]);

  return null;
}
