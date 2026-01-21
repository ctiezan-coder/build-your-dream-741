import { 
  Package, 
  Globe, 
  Calculator, 
  FileText, 
  Layers, 
  RefreshCcw,
  ArrowRightLeft,
  Shield
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Calculator,
    title: 'Calcul dynamique Incoterms',
    description: 'Simulation complète de EXW à DDP, avec tous les coûts intermédiaires.',
  },
  {
    icon: Globe,
    title: 'Multi-destinations',
    description: 'Plus de 30 pays supportés avec droits de douane et TVA actualisés.',
  },
  {
    icon: ArrowRightLeft,
    title: 'Conversion multi-devises',
    description: 'EUR, USD, XOF, GBP et plus avec taux de change en temps réel.',
  },
  {
    icon: Layers,
    title: 'Poids taxable automatique',
    description: 'Calcul intelligent selon le mode de transport (maritime, aérien, routier).',
  },
  {
    icon: Shield,
    title: 'Accords préférentiels',
    description: 'Prise en compte des accords ZLECAF, APE, CEDEAO et bilatéraux.',
  },
  {
    icon: FileText,
    title: 'Export professionnel',
    description: 'Génération de devis PDF détaillés pour vos clients.',
  },
];

export function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tout pour simuler vos exports
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une plateforme complète pour maîtriser vos coûts logistiques internationaux
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="group glass-card glow-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
