"use client";

import { Compass, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDemoStore } from "@/lib/state";

export function ModeToggle() {
  const { mode, setMode, resetWalkthrough } = useDemoStore();

  if (mode === "scripted") {
    return (
      <TooltipProvider delay={250}>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => setMode("explore")}
              />
            }
          >
            <Compass className="size-4" />
            <span className="hidden md:inline">Free explore</span>
          </TooltipTrigger>
          <TooltipContent>Skip the walkthrough and poke around.</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delay={250}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={resetWalkthrough}
            />
          }
        >
          <PlayCircle className="size-4" />
          <span className="hidden md:inline">Restart walkthrough</span>
        </TooltipTrigger>
        <TooltipContent>Replay the scripted demo from the start.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
