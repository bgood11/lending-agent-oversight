"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.18c-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.27-1.7-1.27-1.7-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.94 10.94 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.12 3.04.73.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.37-5.25 5.65.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.55A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="size-6 rounded grid place-items-center text-amber" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-full">
                <path d="M12 2.5 4 5.5v6c0 4.5 3.4 8.6 8 10 4.6-1.4 8-5.5 8-10v-6L12 2.5Z" fill="currentColor" fillOpacity="0.18" />
                <path d="M12 2.5 4 5.5v6c0 4.5 3.4 8.6 8 10 4.6-1.4 8-5.5 8-10v-6L12 2.5Z" />
                <path d="M9 12h6" />
                <path d="M9 9h6" />
                <path d="M9 15h6" />
              </svg>
            </span>
            <span className="font-semibold text-sm">Lending Agent Oversight</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
            An AR/IAR network supervision tool for FCA-authorised principal firms.
            Part of the Lending Agent family of demos. Built independently as a
            portfolio piece, not a regulated service.
          </p>
        </div>

        <FooterColumn label="Principal surface">
          <FooterLink href="/demo/principal">Compliance home</FooterLink>
          <FooterLink href="/demo/principal/register">AR register</FooterLink>
          <FooterLink href="/demo/principal/register/new">Appoint a new AR</FooterLink>
          <FooterLink href="/demo/principal/breaches">Breach triage</FooterLink>
          <FooterLink href="/demo/principal/reviews">File reviews</FooterLink>
          <FooterLink href="/demo/principal/annual-reviews">Annual reviews</FooterLink>
          <FooterLink href="/demo/principal/settings">Settings</FooterLink>
        </FooterColumn>

        <FooterColumn label="AR surface &amp; docs">
          <FooterLink href="/demo/ar">AR home</FooterLink>
          <FooterLink href="/demo/ar/mi">Submit MI return</FooterLink>
          <FooterLink href="/demo/ar/breaches/new">File a breach</FooterLink>
          <FooterLink href="https://lending-agent-oversight-docs.vercel.app" external>
            Docs site
          </FooterLink>
          <FooterLink
            href="https://lending-agent-oversight-docs.vercel.app/architecture/connectors-and-enrichment/"
            external
          >
            Connectors architecture
          </FooterLink>
          <FooterLink
            href="https://lending-agent-oversight-docs.vercel.app/regulatory/overview/"
            external
          >
            Regulatory map
          </FooterLink>
        </FooterColumn>

        <FooterColumn label="Family">
          <FooterLink href="https://lending-agent.vercel.app" external>
            Lending Agent (waterfall)
          </FooterLink>
          <FooterLink href="https://lending-agent-presenter.vercel.app" external>
            Lending Agent Presenter (menu)
          </FooterLink>
          <FooterLink href="https://github.com/bgood11/lending-agent-oversight" external>
            <span className="inline-flex items-center gap-1">
              <GithubMark className="size-3.5" />
              GitHub
            </span>
          </FooterLink>
          <FooterLink href="https://github.com/bgood11/lending-agent-oversight-docs" external>
            <span className="inline-flex items-center gap-1">
              <GithubMark className="size-3.5" />
              GitHub (docs)
            </span>
          </FooterLink>
        </FooterColumn>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 text-[11px] text-muted-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p>
            © {new Date().getFullYear()} Lending Agent Oversight. A demo project by{" "}
            <a href="https://github.com/bgood11" className="underline hover:text-foreground">
              Barney Goodman
            </a>
            . No real personal data is processed.
          </p>
          <p>
            Each principal-firm skin is fictional. FCA register numbers shown in
            the demo are not real.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {label}
      </div>
      <ul className="space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  if (external) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          {children}
          <ExternalLink className="size-3 opacity-60" />
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className="text-muted-foreground hover:text-foreground">
        {children}
      </Link>
    </li>
  );
}
