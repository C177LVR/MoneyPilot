import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { SuccessStories } from "@/components/marketing/success-stories";
import { FeatureCards } from "@/components/marketing/feature-cards";
import { LearningRoadmap } from "@/components/marketing/learning-roadmap";
import { HealthScorePreview } from "@/components/marketing/health-score-preview";
import { AppMockup } from "@/components/marketing/app-mockup";
import { Testimonials } from "@/components/marketing/testimonials";
import { FAQ } from "@/components/marketing/faq";
import { CTA } from "@/components/marketing/cta";
import { Footer } from "@/components/marketing/footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Money Pilot",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  description:
    "An interactive personal finance learning platform with a live dashboard, budget builder, calculators, and an AI money coach.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "50000",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <SuccessStories />
        <FeatureCards />
        <LearningRoadmap />
        <HealthScorePreview />
        <AppMockup />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
