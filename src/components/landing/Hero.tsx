import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Calculator, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  const features = [
    { icon: Calculator, text: 'Calcul instantané EXW → DDP', link: '/incoterms' },
    { icon: Globe, text: '30+ pays et devises', link: '/simulator' },
    { icon: TrendingUp, text: 'Taux de change en temps réel', link: '/simulator' },
    { icon: Shield, text: 'Droits de douane intégrés', link: '/simulator' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-success/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <Link 
            to="/incoterms" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground/90 text-sm mb-8 backdrop-blur-sm border border-primary/30 hover:bg-primary/30 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Incoterms® 2026
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
            Simulez vos coûts
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-green-300">
              d'exportation
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Calculez instantanément le prix de vente export de vos produits, 
            de l'usine à la destination finale, selon les standards internationaux.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              asChild
              variant="glass" 
              size="xl"
              className="group"
            >
              <Link to="/simulator">
                Démarrer une simulation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="xl"
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Link to="/incoterms">
                Guide Incoterms
              </Link>
            </Button>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature) => (
              <Link 
                key={feature.text}
                to={feature.link}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-colors group"
              >
                <feature.icon className="w-6 h-6 text-primary-foreground/80 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-primary-foreground/70 text-center">{feature.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" 
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </div>
  );
}
