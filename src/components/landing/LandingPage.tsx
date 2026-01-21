import { Hero } from './Hero';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { TargetAudience } from './TargetAudience';
import { CTA } from './CTA';
import { Footer } from './Footer';

interface LandingPageProps {
  onStartSimulation: () => void;
}

export function LandingPage({ onStartSimulation }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Hero onStartSimulation={onStartSimulation} />
      <Features />
      <HowItWorks />
      <TargetAudience />
      <CTA onStartSimulation={onStartSimulation} />
      <Footer />
    </div>
  );
}
