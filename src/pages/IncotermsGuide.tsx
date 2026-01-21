import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Ship, Truck, Plane, Package, Shield, FileCheck, AlertTriangle, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { INCOTERM_INFO, Incoterm } from '@/types/simulation';

interface IncotermDetail {
  code: Incoterm;
  seller: string[];
  buyer: string[];
  riskTransfer: string;
  bestFor: string[];
  transport: ('any' | 'maritime')[];
}

const INCOTERM_DETAILS: IncotermDetail[] = [
  {
    code: 'EXW',
    seller: ['Mettre la marchandise à disposition dans ses locaux'],
    buyer: ['Tous les frais de transport', 'Dédouanement export & import', 'Assurance', 'Tous les risques'],
    riskTransfer: 'À la sortie de l\'usine du vendeur',
    bestFor: ['Acheteur expérimenté', 'Contrôle total souhaité'],
    transport: ['any'],
  },
  {
    code: 'FCA',
    seller: ['Livraison au transporteur désigné', 'Dédouanement export'],
    buyer: ['Transport principal', 'Assurance', 'Dédouanement import'],
    riskTransfer: 'À la remise au transporteur',
    bestFor: ['Transport multimodal', 'Conteneurs'],
    transport: ['any'],
  },
  {
    code: 'FAS',
    seller: ['Livraison le long du navire', 'Dédouanement export'],
    buyer: ['Chargement', 'Fret maritime', 'Assurance', 'Dédouanement import'],
    riskTransfer: 'Le long du navire au port de départ',
    bestFor: ['Vracs', 'Marchandises lourdes'],
    transport: ['maritime'],
  },
  {
    code: 'FOB',
    seller: ['Livraison à bord du navire', 'Dédouanement export'],
    buyer: ['Fret maritime', 'Assurance', 'Dédouanement import'],
    riskTransfer: 'À bord du navire au port de départ',
    bestFor: ['Commerce maritime classique', 'Vracs'],
    transport: ['maritime'],
  },
  {
    code: 'CFR',
    seller: ['Livraison à bord du navire', 'Fret jusqu\'au port de destination', 'Dédouanement export'],
    buyer: ['Assurance', 'Déchargement', 'Dédouanement import'],
    riskTransfer: 'À bord du navire au port de départ',
    bestFor: ['Vente maritime sans assurance'],
    transport: ['maritime'],
  },
  {
    code: 'CIF',
    seller: ['Livraison à bord du navire', 'Fret + Assurance', 'Dédouanement export'],
    buyer: ['Déchargement', 'Dédouanement import'],
    riskTransfer: 'À bord du navire au port de départ',
    bestFor: ['Commerce international classique', 'Lettres de crédit'],
    transport: ['maritime'],
  },
  {
    code: 'CPT',
    seller: ['Transport jusqu\'à destination', 'Dédouanement export'],
    buyer: ['Assurance', 'Dédouanement import', 'Livraison finale'],
    riskTransfer: 'À la remise au premier transporteur',
    bestFor: ['Transport multimodal', 'Aérien'],
    transport: ['any'],
  },
  {
    code: 'CIP',
    seller: ['Transport + Assurance jusqu\'à destination', 'Dédouanement export'],
    buyer: ['Dédouanement import', 'Livraison finale'],
    riskTransfer: 'À la remise au premier transporteur',
    bestFor: ['Marchandises de valeur', 'Transport multimodal'],
    transport: ['any'],
  },
  {
    code: 'DPU',
    seller: ['Transport complet', 'Déchargement à destination', 'Dédouanement export'],
    buyer: ['Dédouanement import', 'Livraison finale'],
    riskTransfer: 'Après déchargement à destination',
    bestFor: ['Vendeur contrôlant le déchargement'],
    transport: ['any'],
  },
  {
    code: 'DAP',
    seller: ['Transport complet jusqu\'au lieu convenu', 'Dédouanement export'],
    buyer: ['Déchargement', 'Dédouanement import'],
    riskTransfer: 'À l\'arrivée, avant déchargement',
    bestFor: ['Livraison porte-à-porte partielle'],
    transport: ['any'],
  },
  {
    code: 'DDP',
    seller: ['Tous les frais', 'Tous les dédouanements', 'Livraison complète'],
    buyer: ['Aucune responsabilité de transport'],
    riskTransfer: 'À la livraison finale chez l\'acheteur',
    bestFor: ['Service complet', 'Acheteur sans expérience'],
    transport: ['any'],
  },
];

const GROUPS = [
  { id: 'E', name: 'Départ', color: 'bg-level-exw', codes: ['EXW'] },
  { id: 'F', name: 'Transport principal non payé', color: 'bg-level-fob', codes: ['FCA', 'FAS', 'FOB'] },
  { id: 'C', name: 'Transport principal payé', color: 'bg-level-cif', codes: ['CFR', 'CIF', 'CPT', 'CIP'] },
  { id: 'D', name: 'Arrivée', color: 'bg-level-ddp', codes: ['DPU', 'DAP', 'DDP'] },
];

function RiskDiagram({ incoterm }: { incoterm: IncotermDetail }) {
  const level = INCOTERM_INFO[incoterm.code].level;
  const steps = [
    { label: 'Usine', icon: Package },
    { label: 'Port départ', icon: Ship },
    { label: 'Transport', icon: incoterm.transport.includes('maritime') ? Ship : Truck },
    { label: 'Port arrivée', icon: Ship },
    { label: 'Destination', icon: FileCheck },
  ];

  return (
    <div className="relative py-6">
      {/* Timeline */}
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-muted rounded-full -translate-y-1/2" />
      
      {/* Seller portion */}
      <div 
        className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-primary to-primary/70 rounded-l-full -translate-y-1/2 transition-all duration-500"
        style={{ width: `${(level / 4) * 100}%` }}
      />
      
      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, i) => {
          const isSellerResponsible = i < level + 1;
          const Icon = step.icon;
          
          return (
            <div key={step.label} className="flex flex-col items-center gap-2">
              <div 
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  isSellerResponsible 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-center text-muted-foreground">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Risk transfer point */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
        style={{ left: `${(level / 4) * 100}%` }}
      >
        <Tooltip>
          <TooltipTrigger>
            <div className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-3 h-3" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">Transfert de risque</p>
            <p className="text-xs">{incoterm.riskTransfer}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span>Responsabilité vendeur</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted" />
          <span>Responsabilité acheteur</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-destructive" />
          <span>Transfert de risque</span>
        </div>
      </div>
    </div>
  );
}

function IncotermCard({ detail, isSelected, onClick }: { 
  detail: IncotermDetail; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const info = INCOTERM_INFO[detail.code];
  const group = GROUPS.find(g => g.codes.includes(detail.code));

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-300 hover:shadow-card',
        isSelected && 'ring-2 ring-primary shadow-card'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white', group?.color)}>
              {detail.code.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-lg">{detail.code}</CardTitle>
              <CardDescription className="text-xs">{info.name}</CardDescription>
            </div>
          </div>
          <div className="flex gap-1">
            {detail.transport.includes('any') && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="text-xs">
                    <Truck className="w-3 h-3" />
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Tout mode de transport</TooltipContent>
              </Tooltip>
            )}
            {detail.transport.includes('maritime') && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="text-xs">
                    <Ship className="w-3 h-3" />
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Maritime uniquement</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{info.description}</p>
        {isSelected && (
          <ChevronRight className="w-5 h-5 text-primary mt-2 ml-auto" />
        )}
      </CardContent>
    </Card>
  );
}

export default function IncotermsGuide() {
  const [selectedIncoterm, setSelectedIncoterm] = useState<Incoterm>('FOB');
  const selectedDetail = INCOTERM_DETAILS.find(d => d.code === selectedIncoterm)!;
  const selectedInfo = INCOTERM_INFO[selectedIncoterm];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div>
                <h1 className="font-bold text-lg">Guide Incoterms® 2026</h1>
                <p className="text-xs text-muted-foreground">Comprendre les règles du commerce international</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Intro */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h2 className="font-semibold text-lg mb-2">Qu'est-ce qu'un Incoterm ?</h2>
                <p className="text-muted-foreground">
                  Les <strong>Incoterms® 2026</strong> sont des règles internationales publiées par la Chambre de Commerce Internationale (ICC). 
                  Ils définissent précisément <strong>qui paie quoi</strong> et <strong>où le risque est transféré</strong> entre le vendeur et l'acheteur.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Groups Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {GROUPS.map((group) => (
            <Card key={group.id} className="text-center">
              <CardContent className="pt-4">
                <div className={cn('w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold', group.color)}>
                  {group.id}
                </div>
                <p className="font-medium text-sm">{group.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {group.codes.join(', ')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-[350px,1fr] gap-8">
          {/* Incoterms List */}
          <div className="space-y-3">
            <h3 className="font-semibold mb-4">Sélectionnez un Incoterm</h3>
            {INCOTERM_DETAILS.map((detail) => (
              <IncotermCard
                key={detail.code}
                detail={detail}
                isSelected={selectedIncoterm === detail.code}
                onClick={() => setSelectedIncoterm(detail.code)}
              />
            ))}
          </div>

          {/* Detail View */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white',
                    GROUPS.find(g => g.codes.includes(selectedIncoterm))?.color
                  )}>
                    {selectedIncoterm}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{selectedInfo.name}</CardTitle>
                    <CardDescription>{selectedInfo.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Risk Diagram */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    Transfert de risque et responsabilités
                  </h4>
                  <RiskDiagram incoterm={selectedDetail} />
                </div>

                {/* Responsibilities */}
                <Tabs defaultValue="seller" className="mt-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="seller">Vendeur</TabsTrigger>
                    <TabsTrigger value="buyer">Acheteur</TabsTrigger>
                  </TabsList>
                  <TabsContent value="seller" className="mt-4">
                    <Card>
                      <CardContent className="pt-4">
                        <ul className="space-y-2">
                          {selectedDetail.seller.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                <Shield className="w-3 h-3" />
                              </div>
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="buyer" className="mt-4">
                    <Card>
                      <CardContent className="pt-4">
                        <ul className="space-y-2">
                          {selectedDetail.buyer.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0 mt-0.5">
                                <Package className="w-3 h-3" />
                              </div>
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Best For */}
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Idéal pour</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDetail.bestFor.map((item) => (
                      <Badge key={item} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Risk Transfer */}
                <Card className="mt-6 bg-destructive/5 border-destructive/20">
                  <CardContent className="p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Point de transfert de risque</p>
                      <p className="text-sm text-muted-foreground">{selectedDetail.riskTransfer}</p>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="hero-gradient text-primary-foreground">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Prêt à simuler vos coûts ?</h3>
                <p className="text-primary-foreground/80 mb-4">
                  Utilisez notre simulateur pour calculer vos coûts d'export avec l'Incoterm {selectedIncoterm}
                </p>
                <Button variant="secondary" asChild>
                  <Link to="/">
                    Lancer une simulation
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>ACIEXSimul — Guide basé sur les Incoterms® 2026 de l'ICC</p>
        </div>
      </footer>
    </div>
  );
}
