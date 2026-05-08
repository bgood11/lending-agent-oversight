import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl space-y-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-soft text-amber-foreground">
          Demo · part of the Lending Agent family
        </div>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium leading-[0.98] tracking-tight">
          Your AR network,
          <br />
          <em className="not-italic bg-gradient-to-br from-amber-500 to-orange-600 bg-clip-text text-transparent">
            supervised properly.
          </em>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
          An operating system for principal firms. Register every AR. See
          risk early. Evidence supervision the way the FCA expects.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            size="lg"
            className="gap-2 h-12 text-base"
            render={<Link href="/demo/principal" />}
          >
            See it in action
            <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12"
            render={
              <a
                href="https://lending-agent-oversight-docs.vercel.app"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            Read the docs
          </Button>
        </div>
        <p className="text-xs text-muted-foreground pt-8">
          Marketing landing, principal-side surfaces, AR-side surfaces, and
          scripted walkthrough are under construction. Check back shortly,
          or follow the build at{" "}
          <a
            href="https://github.com/bgood11/lending-agent-oversight"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-foreground"
          >
            github.com/bgood11/lending-agent-oversight
          </a>
          .
        </p>
      </div>
    </main>
  );
}
