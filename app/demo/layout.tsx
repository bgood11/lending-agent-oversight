import type { ReactNode } from "react";
import { DemoChrome } from "@/components/shell/demo-chrome";
import { PrincipalNav } from "@/components/shell/principal-nav";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <DemoChrome />
      <PrincipalNav />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
