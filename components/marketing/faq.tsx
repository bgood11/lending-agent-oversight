"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "./section-header";

const QUESTIONS = [
  {
    q: "Does this cover PS22/11 enhanced principal oversight?",
    a: "Yes, end to end. The annual self-assessment, director sign-off, annual AR review, REP025 underlying record set, 30-day pre-appointment notification window, and self-employed AR scrutiny all map to specific surfaces or doc pages. The Regulatory section in the docs walks each enhancement and where the product surfaces it.",
  },
  {
    q: "Will it fit a vertical that isn't mortgage, GI, or credit broking?",
    a: "The rubric format is open. Adding a new vertical (investment advice, pension transfers, equity release) is a configuration job, not a code job. The docs include a skin definition format reference page that walks the schema.",
  },
  {
    q: "How do you get ARs to actually use it?",
    a: "The AR-side surface is built so the AR's own life is easier. MI submission, breach reporting, and required-actions visibility all save the AR time, not just the principal. The persona switch in the demo shows the AR home, MI return form, and breach report flow.",
  },
  {
    q: "What's the retention story?",
    a: "Seven years on supervision records (the SYSC 9 floor, with margin), ten years on the audit chain (SYSC 9 with extra margin for hash-chain integrity). UK GDPR right-to-erasure requests against AR-user PII are honoured by tombstoning the user; supervision records are retained under Article 6(1)(c) legal obligation.",
  },
  {
    q: "Does it integrate with our existing CRM or compliance system?",
    a: "Read-only API stubs are documented in the Reference section. Two-way sync with case management or CRM (Worksmart, Risical, Compliance Cubed) is on the roadmap, not in v1. Most pilots go production with CSV export plus a periodic Excel reconciliation.",
  },
  {
    q: "How is it priced?",
    a: "Per-principal-firm subscription with an AR-count band. Demo doesn't carry a price; the buyer conversation does. Get in touch via the GitHub repo to discuss.",
  },
  {
    q: "How does this relate to Lending Agent and Lending Agent Presenter?",
    a: "Same family, different jobs. Lending Agent is the broker. Lending Agent Presenter is the menu. Lending Agent Oversight is the supervisor. Cross-links in the footer; same brand, same docs structure.",
  },
];

export function Faq() {
  return (
    <section className="py-20 sm:py-28 bg-foreground/[0.04] border-y border-border/60">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="FAQ"
          title="Things people ask"
          subtitle="Pulled from the questions that came up while designing the product."
        />

        <Accordion className="mt-10">
          {QUESTIONS.map((item, i) => (
            <AccordionItem key={i} value={`q${i}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
