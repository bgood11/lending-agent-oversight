"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  AlertTriangle,
  ClipboardList,
  ScrollText,
  Settings as SettingsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/demo/principal", label: "Home", Icon: Home, exact: true },
  { href: "/demo/principal/register", label: "AR register", Icon: Users },
  { href: "/demo/principal/breaches", label: "Breaches", Icon: AlertTriangle },
  { href: "/demo/principal/reviews", label: "File reviews", Icon: ClipboardList },
  { href: "/demo/principal/annual-reviews", label: "Annual reviews", Icon: ScrollText },
  { href: "/demo/principal/settings", label: "Settings", Icon: SettingsIcon },
];

/**
 * Principal-side section nav. Renders only on /demo/principal/* paths.
 * Sticky under the demo chrome; horizontally scrollable on mobile.
 */
export function PrincipalNav() {
  const pathname = usePathname() ?? "";
  if (!pathname.startsWith("/demo/principal")) return null;

  return (
    <nav
      className="sticky top-14 z-30 bg-background/85 backdrop-blur-md border-b border-border"
      aria-label="Principal sections"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-11 flex items-center gap-1 overflow-x-auto">
        {ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors",
                active
                  ? "bg-amber-soft text-amber-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
              )}
            >
              <item.Icon className="size-3.5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
