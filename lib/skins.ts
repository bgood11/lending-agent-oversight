/**
 * Three principal-firm skins. Each is a fictional FCA-authorised
 * principal supervising a network of Appointed Representatives in a
 * specific vertical. The skin determines brand colour, FCA register
 * number, file-review rubric, and the AR fixtures rendered.
 */

import type { Vertical, RubricCode } from "./types";

export type SkinId = "heritage" | "crown" | "pinpoint";

export interface PrincipalFirmSkin {
  id: SkinId;
  legalName: string;
  shortName: string;
  vertical: Vertical;
  rubric: RubricCode;
  /** Fictional FCA Firm Reference Number, footer-only. */
  frn: string;
  /** Headquarters city for the demo. */
  city: string;
  /** Number of ARs in the demo's fixture set. */
  arCount: number;
  /** Tagline for the marketing landing skin selector. */
  tagline: string;
  /** Brand swatch hex for the skin switcher chip. */
  swatchHex: string;
}

export const SKINS: Record<SkinId, PrincipalFirmSkin> = {
  heritage: {
    id: "heritage",
    legalName: "Heritage Mortgage Network Ltd",
    shortName: "Heritage Mortgage Network",
    vertical: "mortgage",
    rubric: "MCOB",
    frn: "412803",
    city: "Manchester",
    arCount: 124,
    tagline: "Mortgage AR network supervising 124 brokers across England, Scotland, and Wales.",
    swatchHex: "#312E81",
  },
  crown: {
    id: "crown",
    legalName: "Crown GI Collective Ltd",
    shortName: "Crown GI Collective",
    vertical: "general-insurance",
    rubric: "ICOBS",
    frn: "528471",
    city: "Bristol",
    arCount: 87,
    tagline: "General insurance AR network covering commercial, personal, and specialist lines.",
    swatchHex: "#064E3B",
  },
  pinpoint: {
    id: "pinpoint",
    legalName: "Pinpoint Credit Network Ltd",
    shortName: "Pinpoint Credit Network",
    vertical: "credit-broking",
    rubric: "CONC",
    frn: "631920",
    city: "Edinburgh",
    arCount: 198,
    tagline: "Consumer credit AR network supervising retail finance, motor finance, and home improvement brokers.",
    swatchHex: "#581C87",
  },
};

export const DEFAULT_SKIN_ID: SkinId = "heritage";

export function getSkin(id: SkinId): PrincipalFirmSkin {
  return SKINS[id];
}

export function isValidSkinId(id: string): id is SkinId {
  return id === "heritage" || id === "crown" || id === "pinpoint";
}

export const ALL_SKIN_IDS: SkinId[] = ["heritage", "crown", "pinpoint"];
