"use client";

import { useEffect } from "react";
import { useDemoStore } from "@/lib/state";

/**
 * Writes the active skin id and persona onto <body> so globals.css
 * can swap --brand-primary and components can adapt chrome via the
 * data attributes.
 */
export function SkinAttribute() {
  const skin = useDemoStore((s) => s.skin);
  const persona = useDemoStore((s) => s.persona);

  useEffect(() => {
    document.body.dataset.skin = skin;
    document.body.dataset.persona = persona;
  }, [skin, persona]);

  return null;
}
