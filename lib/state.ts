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
import type {
  Persona,
  BreachReport,
  MIReturn,
  OversightTaskOverride,
  TaskFrequency,
  ConnectorStatus,
} from "./types";
import type { RubricItem } from "./rubrics";

export type DemoMode = "scripted" | "explore";

/** Custom rubric item added by principal-admin via Settings. Layered
 *  on top of the canonical rubric. */
export interface CustomRubricItem extends RubricItem {
  id: string;
  rubricCode: "MCOB" | "ICOBS" | "CONC" | "IAR";
  /** When was it added; used in the rubric version string. */
  addedAt: string;
}

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

  /** Per-tenant oversight task overrides. Keyed by task id. */
  taskOverrides: Record<string, OversightTaskOverride>;
  setTaskFrequency: (taskId: string, frequency: TaskFrequency) => void;
  setTaskEnabled: (taskId: string, enabled: boolean) => void;
  resetTaskOverrides: () => void;

  /** Custom rubric items added by principal-admin. */
  customRubricItems: CustomRubricItem[];
  addCustomRubricItem: (item: CustomRubricItem) => void;
  removeCustomRubricItem: (id: string) => void;

  /** Canonical rubric item codes the principal-admin has marked as
   *  inapplicable for this tenant. Layers over the shipped rubric. */
  inapplicableRubricCodes: string[];
  toggleRubricCodeInapplicable: (code: string) => void;

  /** Connector status overrides for the demo. The default fixtures
   *  ship with everything connected; toggling "disconnect" in the
   *  demo simulates a disconnection event. */
  connectorStatusOverrides: Record<string, ConnectorStatus>;
  setConnectorStatus: (id: string, status: ConnectorStatus) => void;
  resetConnectorStatuses: () => void;
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

      taskOverrides: {},
      setTaskFrequency: (taskId, frequency) =>
        set((s) => ({
          taskOverrides: {
            ...s.taskOverrides,
            [taskId]: {
              taskId,
              frequency,
              enabled: s.taskOverrides[taskId]?.enabled ?? true,
              notes: s.taskOverrides[taskId]?.notes ?? null,
            },
          },
        })),
      setTaskEnabled: (taskId, enabled) =>
        set((s) => ({
          taskOverrides: {
            ...s.taskOverrides,
            [taskId]: {
              taskId,
              frequency: s.taskOverrides[taskId]?.frequency ?? null,
              enabled,
              notes: s.taskOverrides[taskId]?.notes ?? null,
            },
          },
        })),
      resetTaskOverrides: () => set({ taskOverrides: {} }),

      customRubricItems: [],
      addCustomRubricItem: (item) =>
        set((s) => ({
          customRubricItems: [...s.customRubricItems, item],
        })),
      removeCustomRubricItem: (id) =>
        set((s) => ({
          customRubricItems: s.customRubricItems.filter((i) => i.id !== id),
        })),

      inapplicableRubricCodes: [],
      toggleRubricCodeInapplicable: (code) =>
        set((s) => ({
          inapplicableRubricCodes: s.inapplicableRubricCodes.includes(code)
            ? s.inapplicableRubricCodes.filter((c) => c !== code)
            : [...s.inapplicableRubricCodes, code],
        })),

      connectorStatusOverrides: {},
      setConnectorStatus: (id, status) =>
        set((s) => ({
          connectorStatusOverrides: {
            ...s.connectorStatusOverrides,
            [id]: status,
          },
        })),
      resetConnectorStatuses: () => set({ connectorStatusOverrides: {} }),
    }),
    {
      name: "lao-demo-state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        skin: state.skin,
        // Persona, mode, walkthrough step, and live additions all reset
        // every session so the visitor always lands in scripted mode
        // with a clean fixture set.
        // Settings overrides persist so a customisation made in one
        // session is visible on return.
        taskOverrides: state.taskOverrides,
        customRubricItems: state.customRubricItems,
        inapplicableRubricCodes: state.inapplicableRubricCodes,
        connectorStatusOverrides: state.connectorStatusOverrides,
      }),
    },
  ),
);
