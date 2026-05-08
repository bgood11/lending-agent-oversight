"use client";

/**
 * Demo state store. Tracks the active skin (principal firm), the
 * active persona (principal-compliance-officer or ar-user), the
 * scripted-walkthrough step, and any cross-persona state coherence
 * needed for the demo's central trick: a breach filed on the AR side
 * should appear on the principal-side triage queue immediately.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULT_SKIN_ID, type SkinId } from "./skins";
import type { Persona, BreachReport, MIReturn } from "./types";

export type DemoMode = "scripted" | "explore";

interface DemoState {
  skin: SkinId;
  setSkin: (skin: SkinId) => void;

  persona: Persona;
  setPersona: (persona: Persona) => void;

  /** The AR currently focused, used so the persona switch lands the AR
   *  on the right AR's view rather than guessing. */
  focusedArId: string | null;
  setFocusedArId: (id: string | null) => void;

  mode: DemoMode;
  setMode: (mode: DemoMode) => void;

  walkthroughStep: number;
  setWalkthroughStep: (step: number) => void;
  advanceWalkthrough: () => void;
  resetWalkthrough: () => void;

  /** Has the persona-switch confirmation modal been shown this session? */
  personaSwitchSeen: boolean;
  markPersonaSwitchSeen: () => void;

  /** Locally-filed breaches and MI returns from the demo session. They
   *  layer onto the fixture set so the AR-side action surfaces on the
   *  principal-side queue instantly. */
  liveBreaches: BreachReport[];
  appendLiveBreach: (b: BreachReport) => void;

  liveMIReturns: MIReturn[];
  appendLiveMIReturn: (m: MIReturn) => void;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      skin: DEFAULT_SKIN_ID,
      setSkin: (skin) => set({ skin }),

      persona: "principal-compliance-officer",
      setPersona: (persona) => set({ persona }),

      focusedArId: null,
      setFocusedArId: (focusedArId) => set({ focusedArId }),

      mode: "scripted",
      setMode: (mode) => set({ mode }),

      walkthroughStep: 0,
      setWalkthroughStep: (walkthroughStep) => set({ walkthroughStep }),
      advanceWalkthrough: () =>
        set((s) => ({ walkthroughStep: s.walkthroughStep + 1 })),
      resetWalkthrough: () =>
        set({ walkthroughStep: 0, mode: "scripted", personaSwitchSeen: false }),

      personaSwitchSeen: false,
      markPersonaSwitchSeen: () => set({ personaSwitchSeen: true }),

      liveBreaches: [],
      appendLiveBreach: (b) =>
        set((s) => ({ liveBreaches: [b, ...s.liveBreaches] })),

      liveMIReturns: [],
      appendLiveMIReturn: (m) =>
        set((s) => ({ liveMIReturns: [m, ...s.liveMIReturns] })),
    }),
    {
      name: "lao-demo-state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        skin: state.skin,
        // Persona, mode, walkthrough step, and live additions all reset
        // every session so the visitor always lands in scripted mode
        // with a clean fixture set.
      }),
    },
  ),
);
