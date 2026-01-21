import { useState, useEffect } from 'react';
import { 
  Calculator, 
  Package, 
  Ship, 
  FileText, 
  ArrowLeft, 
  Download, 
  RefreshCcw,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Info,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { Product, ExportParams, CostBreakdown, Incoterm } from '@/types/simulation';
import { INCOTERM_INFO, CURRENCIES } from '@/types/simulation';
import { COUNTRIES } from '@/lib/countries';
import { formatCurrency, getTotalByIncoterm } from '@/lib/calculator';
import { generateSimulationPDF } from '@/lib/pdfExport';
import { SaveSimulationDialog } from './SaveSimulationDialog';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface ResultsViewProps {
  product: Product;
  params: ExportParams;
  breakdown: CostBreakdown;
  onBack: () => void;
  onReset: () => void;
}

interface CostLineProps {
  label: string;
  value: number;
  currency: typeof CURRENCIES[keyof typeof CURRENCIES] extends { symbol: string } ? keyof typeof CURRENCIES : never;
  isSubtotal?: boolean;
  isTotal?: boolean;
  delay?: number;
}

function CostLine({ label, value, currency, isSubtotal, isTotal, delay = 0 }: CostLineProps) {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div
      className={cn(
        'flex justify-between items-center py-2 transition-all duration-500',
        isSubtotal && 'border-t border-border pt-3 mt-1 font-semibold',
        isTotal && 'border-t-2 border-foreground pt-4 mt-2 font-bold text-lg',
        animated ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      )}
    >
      <span className={cn(isTotal ? 'text-foreground' : 'text-muted-foreground')}>
        {label}
      </span>
      <span className={cn('tabular-nums', isTotal && 'text-primary')}>
        {formatCurrency(value, currency)}
      </span>
    </div>
  );
}

interface LevelCardProps {
  level: number;
  title: string;
  subtitle: string;
  total: number;
  currency: keyof typeof CURRENCIES;
  items: { label: string; value: number }[];
  isActive: boolean;
  colorClass: string;
  delay?: number;
}

function LevelCard({ level, title, subtitle, total, currency, items, isActive, colorClass, delay = 0 }: LevelCardProps) {
  const [open, setOpen] = useState(isActive);
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div 
        className={cn(
          'rounded-xl border-2 overflow-hidden transition-all duration-500',
          isActive ? 'border-primary shadow-card' : 'border-border',
          animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}
      >
        <CollapsibleTrigger className="w-full">
          <div className={cn('p-4 flex items-center justify-between', isActive && 'bg-primary/5')}>
            <div className="flex items-center gap-3">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-primary-foreground', colorClass)}>
                {level}
              </div>
              <div className="text-left">
                <p className="font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn('font-bold tabular-nums', isActive && 'text-primary')}>
                {formatCurrency(total, currency)}
              </span>
              {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-2 bg-muted/30">
            {items.map((item, i) => (
              <CostLine 
                key={item.label} 
                label={item.label} 
                value={item.value} 
                currency={currency}
                delay={50 * i}
              />
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function ResultsView({ product, params, breakdown, onBack, onReset }: ResultsViewProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useAuth();
  const origin = COUNTRIES.find(c => c.code === params.originCountry);
  const dest = COUNTRIES.find(c => c.code === params.destinationCountry);
  const finalTotal = getTotalByIncoterm(breakdown, params.incoterm);
  const incotermLevel = INCOTERM_INFO[params.incoterm].level;

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Small delay for UX feedback
      await new Promise(resolve => setTimeout(resolve, 300));
      generateSimulationPDF({ product, params, breakdown });
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const levels: LevelCardProps[] = [
    {
      level: 1,
      title: 'Coût EXW',
      subtitle: 'Ex-Works (Départ usine)',
      total: breakdown.exwTotal,
      currency: params.outputCurrency,
      items: [
        { label: 'Prix de revient', value: breakdown.productionCost },
        { label: 'Emballage export', value: breakdown.packagingCost },
        { label: `Marge (${(params.marginRate * 100).toFixed(0)}%)`, value: breakdown.margin },
      ],
      isActive: incotermLevel >= 1,
      colorClass: 'bg-level-exw',
      delay: 100,
    },
    {
      level: 2,
      title: 'Pré-acheminement → FOB',
      subtitle: 'Jusqu\'au port de départ',
      total: breakdown.fobTotal,
      currency: params.outputCurrency,
      items: [
        { label: 'Transport local', value: breakdown.localTransport },
        { label: 'Manutention', value: breakdown.handling },
        { label: 'Douane export', value: breakdown.exportCustoms },
      ],
      isActive: incotermLevel >= 2,
      colorClass: 'bg-level-fob',
      delay: 200,
    },
    {
      level: 3,
      title: 'Transport principal → CIF',
      subtitle: 'Fret et assurance',
      total: breakdown.cifTotal,
      currency: params.outputCurrency,
      items: [
        { label: 'Fret', value: breakdown.freight },
        { label: `Assurance (${(params.insuranceRate * 100).toFixed(2)}%)`, value: breakdown.insurance },
      ],
      isActive: incotermLevel >= 3,
      colorClass: 'bg-level-cif',
      delay: 300,
    },
    {
      level: 4,
      title: 'Destination → DDP',
      subtitle: 'Droits et livraison finale',
      total: breakdown.ddpTotal,
      currency: params.outputCurrency,
      items: [
        { label: 'Droits de douane', value: breakdown.customsDuty },
        { label: 'TVA import', value: breakdown.importVat },
        { label: 'Livraison finale', value: breakdown.finalDelivery },
      ],
      isActive: incotermLevel >= 4,
      colorClass: 'bg-level-ddp',
      delay: 400,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Header */}
      <Card className="glass-card overflow-hidden">
        <div className="hero-gradient text-primary-foreground p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm">Coût total {params.incoterm}</p>
              <p className="text-4xl font-bold mt-1 tabular-nums">
                {formatCurrency(finalTotal, params.outputCurrency)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-primary-foreground/80 text-sm">
                {origin?.flag} {origin?.name} → {dest?.flag} {dest?.name}
              </p>
              <p className="font-medium mt-1">{product.name}</p>
              <p className="text-sm text-primary-foreground/80">
                {params.quantity} unité{params.quantity > 1 ? 's' : ''} • Poids taxable: {breakdown.chargeableWeight.toFixed(2)} kg
              </p>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 flex">
          <div className="flex-1 level-bar level-bar-exw" style={{ opacity: incotermLevel >= 1 ? 1 : 0.3 }} />
          <div className="flex-1 level-bar level-bar-fob" style={{ opacity: incotermLevel >= 2 ? 1 : 0.3 }} />
          <div className="flex-1 level-bar level-bar-cif" style={{ opacity: incotermLevel >= 3 ? 1 : 0.3 }} />
          <div className="flex-1 level-bar level-bar-ddp" style={{ opacity: incotermLevel >= 4 ? 1 : 0.3 }} />
        </div>
      </Card>

      {/* Cost Breakdown */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Décomposition des coûts
        </h3>
        {levels.map((level) => (
          <LevelCard key={level.level} {...level} />
        ))}
      </div>

      {/* Info Box */}
      <Card className="bg-accent/50 border-accent">
        <CardContent className="p-4 flex gap-3">
          <Info className="w-5 h-5 text-accent-foreground shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-accent-foreground">À propos de cette estimation</p>
            <p className="text-muted-foreground mt-1">
              Cette simulation est indicative. Les coûts réels peuvent varier selon les conditions du marché, 
              les transitaires et les accords commerciaux en vigueur.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Modifier les paramètres
        </Button>
        <Button variant="secondary" onClick={onReset} className="flex-1">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Nouvelle simulation
        </Button>
        {user && (
          <SaveSimulationDialog 
            product={product} 
            params={params} 
            breakdown={breakdown}
          />
        )}
        <Button variant="hero" className="flex-1" onClick={handleExportPDF} disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isExporting ? 'Génération...' : 'Exporter PDF'}
        </Button>
      </div>
    </div>
  );
}
