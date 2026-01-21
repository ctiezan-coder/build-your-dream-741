import { Link } from 'react-router-dom';
import { Building2, Ship, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const audiences = [
  {
    icon: Building2,
    title: 'PME exportatrices',
    description: 'Estimez rapidement vos prix de vente export et comparez différents scénarios.',
    link: '/simulator',
  },
  {
    icon: Ship,
    title: 'Transitaires',
    description: 'Générez des devis automatisés et professionnels pour vos clients.',
    link: '/simulator',
  },
  {
    icon: Briefcase,
    title: 'Responsables export',
    description: 'Analysez vos marges selon les Incoterms et optimisez votre stratégie.',
    link: '/incoterms',
  },
  {
    icon: GraduationCap,
    title: 'Consultants',
    description: 'Accompagnez vos clients avec des simulations personnalisées.',
    link: '/simulator',
  },
];

export function TargetAudience() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pour qui ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Que vous soyez une PME, un transitaire ou un consultant, 
            ACIEXSimul simplifie vos calculs export.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((audience) => (
            <Link to={audience.link} key={audience.title}>
              <Card 
                className="text-center glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer group"
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                    <audience.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{audience.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{audience.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Découvrir
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
