import type { ReactNode } from "react";
import { DemoChrome } from "@/components/shell/demo-chrome";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <DemoChrome />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
