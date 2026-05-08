"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useDemoStore } from "@/lib/state";
import {
  DEFAULT_OVERSIGHT_TASKS,
  FREQUENCY_LABEL,
  SOURCE_LABEL,
  CATEGORY_LABEL,
} from "@/lib/oversight-tasks";
import type {
  OversightTask,
  TaskFrequency,
  TaskCategory,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const FREQUENCY_VALUES: TaskFrequency[] = [
  "weekly",
  "monthly",
  "quarterly",
  "half-yearly",
  "annual",
  "ad-hoc",
];

const CATEGORY_ORDER: TaskCategory[] = [
  "review",
  "data-collection",
  "attestation",
  "filing",
  "training",
  "other",
];

export function SettingsOversightCalendar() {
  const overrides = useDemoStore((s) => s.taskOverrides);
  const setFrequency = useDemoStore((s) => s.setTaskFrequency);
  const setEnabled = useDemoStore((s) => s.setTaskEnabled);
  const reset = useDemoStore((s) => s.resetTaskOverrides);

  const grouped = useMemo(() => {
    return CATEGORY_ORDER.map((cat) => ({
      category: cat,
      tasks: DEFAULT_OVERSIGHT_TASKS.filter((t) => t.category === cat),
    })).filter((g) => g.tasks.length > 0);
  }, []);

  const customisedCount = Object.values(overrides).filter(
    (o) => o.frequency !== null || !o.enabled,
  ).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold leading-tight">
            Oversight calendar
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Every supervisory task the principal firm is expected to run
            against its AR network. Each task ships with a default frequency
            tied to the regulatory source. Change a frequency to override
            for this tenant, or disable a task that doesn&apos;t apply.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {customisedCount > 0
              ? `${customisedCount} customised`
              : "Default configuration"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            disabled={customisedCount === 0}
          >
            Reset to defaults
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        {grouped.map((g) => (
          <Card key={g.category} className="overflow-hidden">
            <div className="px-5 py-3 bg-muted/30 border-b border-border">
              <div className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
                {CATEGORY_LABEL[g.category]}
              </div>
            </div>
            <ul className="divide-y divide-border">
              {g.tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  frequency={overrides[task.id]?.frequency ?? task.defaultFrequency}
                  enabled={overrides[task.id]?.enabled ?? true}
                  customised={
                    overrides[task.id] !== undefined &&
                    (overrides[task.id].frequency !== null ||
                      !overrides[task.id].enabled)
                  }
                  onFrequency={(f) => setFrequency(task.id, f)}
                  onEnabled={(e) => setEnabled(task.id, e)}
                />
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TaskRow({
  task,
  frequency,
  enabled,
  customised,
  onFrequency,
  onEnabled,
}: {
  task: OversightTask;
  frequency: TaskFrequency;
  enabled: boolean;
  customised: boolean;
  onFrequency: (f: TaskFrequency) => void;
  onEnabled: (e: boolean) => void;
}) {
  return (
    <li
      className={cn(
        "px-5 py-4 flex flex-col lg:flex-row gap-4 lg:items-center",
        !enabled && "opacity-50",
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-medium text-sm leading-tight">{task.title}</h3>
          <Badge variant="outline" className="font-mono text-[10px]">
            {SOURCE_LABEL[task.source]}
          </Badge>
          {task.appliesTo !== "all" && (
            <Badge variant="secondary" className="text-[10px]">
              {task.appliesTo} only
            </Badge>
          )}
          {task.scope === "firm-level" && (
            <Badge variant="secondary" className="text-[10px]">
              Firm-level
            </Badge>
          )}
          {customised && (
            <Badge className="bg-amber-soft text-amber-foreground border-amber/30 text-[10px]">
              Customised
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {task.description}
        </p>
        <div className="text-[11px] text-muted-foreground mt-1.5">
          Owner: <span className="font-medium">{ownerLabel(task.ownerRole)}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 lg:w-56 lg:flex-none">
        <Select
          value={frequency}
          onValueChange={(v) => onFrequency(v as TaskFrequency)}
          disabled={!enabled}
        >
          <SelectTrigger className="h-9 flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FREQUENCY_VALUES.map((f) => (
              <SelectItem key={f} value={f}>
                {FREQUENCY_LABEL[f]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Checkbox
            checked={enabled}
            onCheckedChange={(v) => onEnabled(v === true)}
          />
          On
        </label>
      </div>
    </li>
  );
}

function ownerLabel(role: string): string {
  switch (role) {
    case "principal-admin":
      return "Principal admin";
    case "principal-compliance-officer":
      return "Compliance officer";
    case "ar-user":
      return "AR";
    case "fca-auditor":
      return "FCA auditor";
    default:
      return role;
  }
}
