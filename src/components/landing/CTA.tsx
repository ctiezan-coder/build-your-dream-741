import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTAProps {
  onStartSimulation: () => void;
}

export function CTA({ onStartSimulation }: CTAProps) {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-success/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm mb-6 backdrop-blur-sm">
          <Sparkles className="w-4 h-4" />
          Gratuit et sans inscription
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Prêt à simuler vos coûts ?
        </h2>
        <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
          Lancez votre première simulation en quelques clics et 
          maîtrisez vos prix d'exportation.
        </p>
        
        <Button 
          onClick={onStartSimulation}
          variant="glass"
          size="xl"
          className="group"
        >
          Commencer maintenant
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </section>
  );
}
