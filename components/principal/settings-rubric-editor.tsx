"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useDemoStore } from "@/lib/state";
import { SKINS } from "@/lib/skins";
import { getRubric, IAR_RUBRIC, type RubricItem } from "@/lib/rubrics";
import { cn } from "@/lib/utils";

type RubricKey = "vertical" | "iar";

export function SettingsRubricEditor() {
  const skin = useDemoStore((s) => s.skin);
  const skinDef = SKINS[skin];
  const customItems = useDemoStore((s) => s.customRubricItems);
  const addCustom = useDemoStore((s) => s.addCustomRubricItem);
  const removeCustom = useDemoStore((s) => s.removeCustomRubricItem);
  const inapplicable = useDemoStore((s) => s.inapplicableRubricCodes);
  const toggle = useDemoStore((s) => s.toggleRubricCodeInapplicable);

  const verticalRubric = useMemo(() => getRubric(skinDef.rubric, "AR"), [
    skinDef.rubric,
  ]);
  const iarRubric = IAR_RUBRIC;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold leading-tight">Rubric editor</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Customise the file-review rubric for {skinDef.shortName}. Mark a
          canonical item as inapplicable for this permission profile, or add
          tenant-specific items (internal anti-bribery, source-of-funds,
          policy-quirk checks). Edits are versioned: a file review references
          the rubric version it was scored against, so historic findings are
          never retroactively altered.
        </p>
      </div>

      <Tabs defaultValue="vertical">
        <TabsList variant="line">
          <TabsTrigger value="vertical">{skinDef.rubric} (AR)</TabsTrigger>
          <TabsTrigger value="iar">IAR</TabsTrigger>
        </TabsList>
        <TabsContent value="vertical" className="mt-4">
          <RubricView
            rubricKey="vertical"
            items={verticalRubric}
            inapplicable={inapplicable}
            onToggle={toggle}
            customItems={customItems.filter((c) => c.rubricCode === skinDef.rubric)}
            onAddCustom={addCustom}
            onRemoveCustom={removeCustom}
            rubricCode={skinDef.rubric}
          />
        </TabsContent>
        <TabsContent value="iar" className="mt-4">
          <RubricView
            rubricKey="iar"
            items={iarRubric}
            inapplicable={inapplicable}
            onToggle={toggle}
            customItems={customItems.filter((c) => c.rubricCode === "IAR")}
            onAddCustom={addCustom}
            onRemoveCustom={removeCustom}
            rubricCode="IAR"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RubricView({
  rubricKey,
  items,
  inapplicable,
  onToggle,
  customItems,
  onAddCustom,
  onRemoveCustom,
  rubricCode,
}: {
  rubricKey: RubricKey;
  items: RubricItem[];
  inapplicable: string[];
  onToggle: (code: string) => void;
  customItems: Array<RubricItem & { id: string; rubricCode: string }>;
  onAddCustom: (item: {
    id: string;
    rubricCode: "MCOB" | "ICOBS" | "CONC" | "IAR";
    code: string;
    label: string;
    section: string;
    addedAt: string;
  }) => void;
  onRemoveCustom: (id: string) => void;
  rubricCode: "MCOB" | "ICOBS" | "CONC" | "IAR";
}) {
  const sections = Array.from(new Set(items.map((i) => i.section)));
  const customSections = Array.from(new Set(customItems.map((i) => i.section)));
  const allSections = Array.from(new Set([...sections, ...customSections]));

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="px-5 py-3 bg-muted/30 border-b border-border flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
            Canonical items ({items.length})
          </div>
          <span className="text-[11px] text-muted-foreground">
            {inapplicable.filter((c) => items.some((i) => i.code === c)).length} marked inapplicable
          </span>
        </div>
        <div className="divide-y divide-border">
          {allSections.map((section) => {
            const canonical = items.filter((i) => i.section === section);
            const custom = customItems.filter((i) => i.section === section);
            return (
              <div key={section}>
                <div className="px-5 pt-3 pb-1 text-[10px] uppercase tracking-wide font-medium text-muted-foreground">
                  {section}
                </div>
                <ul className="divide-y divide-border">
                  {canonical.map((item) => {
                    const off = inapplicable.includes(item.code);
                    return (
                      <li
                        key={item.code}
                        className={cn(
                          "px-5 py-3 flex items-center gap-3",
                          off && "opacity-50",
                        )}
                      >
                        <Checkbox
                          checked={!off}
                          onCheckedChange={() => onToggle(item.code)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-[11px] text-muted-foreground">
                            {item.code}
                          </div>
                          <div className="text-sm leading-snug">
                            {item.label}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          Canonical
                        </Badge>
                      </li>
                    );
                  })}
                  {custom.map((item) => (
                    <li
                      key={item.id}
                      className="px-5 py-3 flex items-center gap-3"
                    >
                      <Checkbox checked={true} disabled />
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-[11px] text-muted-foreground">
                          {item.code}
                        </div>
                        <div className="text-sm leading-snug">{item.label}</div>
                      </div>
                      <Badge className="bg-amber-soft text-amber-foreground border-amber/30 text-[10px]">
                        Custom
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => onRemoveCustom(item.id)}
                        aria-label={`Remove ${item.label}`}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Card>

      <AddCustomItemForm
        rubricCode={rubricCode}
        existingSections={allSections}
        onAdd={onAddCustom}
        rubricKey={rubricKey}
      />
    </div>
  );
}

function AddCustomItemForm({
  rubricCode,
  existingSections,
  onAdd,
  rubricKey,
}: {
  rubricCode: "MCOB" | "ICOBS" | "CONC" | "IAR";
  existingSections: string[];
  onAdd: (item: {
    id: string;
    rubricCode: "MCOB" | "ICOBS" | "CONC" | "IAR";
    code: string;
    label: string;
    section: string;
    addedAt: string;
  }) => void;
  rubricKey: RubricKey;
}) {
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [section, setSection] = useState(existingSections[0] ?? "Internal");

  const submit = () => {
    if (!code.trim() || !label.trim()) return;
    onAdd({
      id: `custom-${rubricKey}-${Date.now()}`,
      rubricCode,
      code: code.trim(),
      label: label.trim(),
      section,
      addedAt: new Date().toISOString(),
    });
    setCode("");
    setLabel("");
  };

  return (
    <Card className="p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Plus className="size-4 text-amber-foreground" />
        <h3 className="font-medium text-sm">Add custom item</h3>
      </div>
      <div className="grid sm:grid-cols-[140px_minmax(0,1fr)_160px] gap-2">
        <Input
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="font-mono"
        />
        <Input
          placeholder="Plain-language descriptor"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <Select value={section} onValueChange={(v) => setSection(v ?? "Internal")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {existingSections.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
            <SelectItem value="Internal">Internal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end">
        <Button size="sm" onClick={submit} disabled={!code.trim() || !label.trim()}>
          Add to rubric
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Custom items are appended to the rubric for {rubricCode}. Reviewers see them grouped under their section. The {rubricCode} rubric version increments and the change is captured as a `RubricChange` audit event. (Demo: removed via the X icon; production keeps the full version history.)
      </p>
    </Card>
  );
}
