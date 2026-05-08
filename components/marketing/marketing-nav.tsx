"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.18c-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.27-1.7-1.27-1.7-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.94 10.94 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.12 3.04.73.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.37-5.25 5.65.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.55A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="size-6 rounded grid place-items-center"
            style={{ color: "var(--brand-primary)" }}
            aria-hidden
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-full">
              <path
                d="M12 2.5 4 5.5v6c0 4.5 3.4 8.6 8 10 4.6-1.4 8-5.5 8-10v-6L12 2.5Z"
                fill="currentColor"
                fillOpacity="0.18"
              />
              <path d="M12 2.5 4 5.5v6c0 4.5 3.4 8.6 8 10 4.6-1.4 8-5.5 8-10v-6L12 2.5Z" />
              <path d="M9 12h6" />
              <path d="M9 9h6" />
              <path d="M9 15h6" />
            </svg>
          </span>
          <span className="font-semibold text-sm">Lending Agent Oversight</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          <a
            href="#how-it-works"
            className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            How it works
          </a>
          <a
            href="#features"
            className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="https://lending-agent-oversight-docs.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            Docs
            <ExternalLink className="size-3" />
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            render={
              <a
                href="https://github.com/bgood11/lending-agent-oversight"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              />
            }
          >
            <GithubMark className="size-4" />
          </Button>
          <Button
            size="sm"
            render={<Link href="/demo/principal" />}
            className="gap-1.5"
          >
            Open demo
          </Button>
        </div>
      </div>
    </header>
  );
}
