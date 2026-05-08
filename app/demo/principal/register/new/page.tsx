"use client";

import { useEffect, useState } from "react";
import { AppointAr } from "@/components/principal/appoint-ar";

export default function NewArPage() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
      </div>
    );
  }
  return <AppointAr />;
}
