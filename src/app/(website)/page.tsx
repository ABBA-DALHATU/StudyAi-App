import { WebsiteFeatures } from "@/components/pages/website/website-features";
import { WebsiteHeader } from "@/components/pages/website/website-header";
import { WebsiteHero } from "@/components/pages/website/website-hero";
import { WebsiteHowItWorks } from "@/components/pages/website/website-how-it-works";
import { WebsiteStats } from "@/components/pages/website/website-stats";
import { WebsiteTestimonials } from "@/components/pages/website/website-testimonials";

export default function WebsitePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <WebsiteHeader />
      <main>
        <WebsiteHero />
        <WebsiteStats />
        <WebsiteFeatures />
        <WebsiteHowItWorks />
        <WebsiteTestimonials />
        {/* <WebsitePricing />
        <WebsiteFAQ />
        <WebsiteCTA /> */}
      </main>
      {/* <WebsiteFooter /> */}
    </div>
  );
}
