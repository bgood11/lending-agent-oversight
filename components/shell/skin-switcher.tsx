"use client";

import { Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/state";
import { ALL_SKIN_IDS, SKINS, type SkinId } from "@/lib/skins";
import { SkinLogo } from "./skin-logo";

export function SkinSwitcher() {
  const { skin, setSkin } = useDemoStore();
  const current = SKINS[skin];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" className="gap-2" />}
      >
        <span
          className="inline-block size-3.5 rounded-full border"
          style={{ backgroundColor: current.swatchHex }}
          aria-hidden
        />
        <span className="hidden sm:inline font-medium">
          {current.shortName}
        </span>
        <span className="sm:hidden">Skin</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
          Principal firm
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ALL_SKIN_IDS.map((id) => (
          <SkinOption
            key={id}
            id={id}
            isActive={id === skin}
            onSelect={() => setSkin(id)}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SkinOption({
  id,
  isActive,
  onSelect,
}: {
  id: SkinId;
  isActive: boolean;
  onSelect: () => void;
}) {
  const skin = SKINS[id];
  return (
    <DropdownMenuItem onSelect={onSelect} className="flex items-start gap-3 py-2.5">
      <SkinLogo skinId={id} className="size-7 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-medium leading-tight">{skin.shortName}</div>
        <div className="text-xs text-muted-foreground leading-tight mt-0.5">
          {skin.rubric} · {skin.arCount} ARs · FRN {skin.frn}
        </div>
      </div>
      {isActive && <Check className="size-4 text-foreground/70 mt-0.5" />}
    </DropdownMenuItem>
  );
}
