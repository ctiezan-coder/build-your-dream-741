import { Hero } from './Hero';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { TargetAudience } from './TargetAudience';
import { CTA } from './CTA';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      <HowItWorks />
      <TargetAudience />
      <CTA />
      <Footer />
    </div>
  );
}
