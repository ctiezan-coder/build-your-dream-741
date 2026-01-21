import { Building2, Ship, Briefcase, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const audiences = [
  {
    icon: Building2,
    title: 'PME exportatrices',
    description: 'Estimez rapidement vos prix de vente export et comparez différents scénarios.',
  },
  {
    icon: Ship,
    title: 'Transitaires',
    description: 'Générez des devis automatisés et professionnels pour vos clients.',
  },
  {
    icon: Briefcase,
    title: 'Responsables export',
    description: 'Analysez vos marges selon les Incoterms et optimisez votre stratégie.',
  },
  {
    icon: GraduationCap,
    title: 'Consultants',
    description: 'Accompagnez vos clients avec des simulations personnalisées.',
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
            <Card 
              key={audience.title}
              className="text-center glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center mx-auto mb-4">
                  <audience.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{audience.title}</h3>
                <p className="text-muted-foreground text-sm">{audience.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
