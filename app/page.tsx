import { MarketingNav } from "@/components/marketing/marketing-nav";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { CompetitorComparison } from "@/components/marketing/competitor-comparison";
import { AudienceCards } from "@/components/marketing/audience-cards";
import { Faq } from "@/components/marketing/faq";
import { SiteFooter } from "@/components/marketing/site-footer";

export default function HomePage() {
  return (
    <>
      <MarketingNav />
      <Hero />
      <HowItWorks />
      <FeaturesGrid />
      <CompetitorComparison />
      <AudienceCards />
      <Faq />
      <SiteFooter />
    </>
  );
}
