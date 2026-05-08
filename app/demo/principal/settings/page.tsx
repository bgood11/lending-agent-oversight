"use client";

import { useState, useEffect } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { SettingsRubricEditor } from "@/components/principal/settings-rubric-editor";
import { SettingsOversightCalendar } from "@/components/principal/settings-oversight-calendar";
import { SettingsConnectors } from "@/components/principal/settings-connectors";
import { useDemoStore } from "@/lib/state";
import { SKINS } from "@/lib/skins";

export default function SettingsPage() {
  const skin = useDemoStore((s) => s.skin);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  const skinDef = SKINS[skin];

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 space-y-5">
      <header>
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
          Settings · principal-admin
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-medium leading-tight tracking-tight mt-1">
          Tenant configuration
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-3xl">
          Customise the rubric, oversight calendar, and data connectors for {skinDef.shortName}.
          Every change is versioned. Historic file reviews stay scored against
          the rubric in force at the time, and earlier task cycles are not
          retroactively altered.
        </p>
      </header>

      <Tabs defaultValue="oversight">
        <TabsList variant="line" className="border-b border-border w-full justify-start rounded-none px-0 pb-2">
          <TabsTrigger value="oversight" className="px-4 py-2 text-sm">
            Oversight calendar
          </TabsTrigger>
          <TabsTrigger value="rubric" className="px-4 py-2 text-sm">
            Rubric editor
          </TabsTrigger>
          <TabsTrigger value="connectors" className="px-4 py-2 text-sm">
            Connectors &amp; enrichments
          </TabsTrigger>
        </TabsList>
        <TabsContent value="oversight" className="mt-5">
          <SettingsOversightCalendar />
        </TabsContent>
        <TabsContent value="rubric" className="mt-5">
          <SettingsRubricEditor />
        </TabsContent>
        <TabsContent value="connectors" className="mt-5">
          <SettingsConnectors />
        </TabsContent>
      </Tabs>
    </div>
  );
}
