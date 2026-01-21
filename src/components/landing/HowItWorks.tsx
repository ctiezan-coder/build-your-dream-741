import { Link } from 'react-router-dom';
import { Package, Settings, BarChart3, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: Package,
    title: 'Décrivez votre produit',
    description: 'Renseignez le code SH, le poids, le volume et la valeur de votre marchandise.',
    link: '/simulator',
    linkText: 'Commencer',
  },
  {
    step: 2,
    icon: Settings,
    title: 'Configurez votre export',
    description: 'Choisissez les pays, l\'Incoterm, le mode de transport et la quantité.',
    link: '/incoterms',
    linkText: 'Guide Incoterms',
  },
  {
    step: 3,
    icon: BarChart3,
    title: 'Obtenez vos coûts',
    description: 'Visualisez la décomposition complète et exportez votre devis professionnel.',
    link: '/simulator',
    linkText: 'Lancer une simulation',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-muted-foreground">
            Trois étapes simples pour estimer vos coûts d'exportation
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-border hidden md:block" />
            
            <div className="space-y-8">
              {steps.map((step, index) => (
                <Link 
                  key={step.step} 
                  to={step.link}
                  className="relative flex gap-6 items-start group cursor-pointer"
                >
                  {/* Step number */}
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shrink-0 group-hover:scale-105 transition-transform">
                    <span className="text-2xl font-bold text-primary-foreground">{step.step}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <step.icon className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-3">{step.description}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {step.linkText}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
