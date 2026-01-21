import { Globe, Ship, Plane, Truck, Train, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { ExportParams, Incoterm, TransportMode, Currency } from '@/types/simulation';
import { INCOTERM_INFO, TRANSPORT_MODES, CURRENCIES } from '@/types/simulation';
import { COUNTRIES } from '@/lib/countries';
import { getExchangeRate } from '@/lib/calculator';
import { cn } from '@/lib/utils';

interface ExportParamsFormProps {
  params: ExportParams;
  onChange: (params: ExportParams) => void;
  onNext: () => void;
  onBack: () => void;
}

const transportIcons: Record<TransportMode, React.ElementType> = {
  maritime: Ship,
  aerien: Plane,
  routier: Truck,
  ferroviaire: Train,
};

export function ExportParamsForm({ params, onChange, onNext, onBack }: ExportParamsFormProps) {
  const updateField = <K extends keyof ExportParams>(field: K, value: ExportParams[K]) => {
    onChange({ ...params, [field]: value });
  };

  const originCountry = COUNTRIES.find(c => c.code === params.originCountry);
  const destCountry = COUNTRIES.find(c => c.code === params.destinationCountry);

  // Exchange rate display
  const exchangeRate = getExchangeRate('EUR', params.outputCurrency);

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Paramètres d'Export</CardTitle>
            <CardDescription>Définissez la route et les conditions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Origin & Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Pays d'origine</Label>
            <Select
              value={params.originCountry}
              onValueChange={(v) => updateField('originCountry', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Pays de destination</Label>
            <Select
              value={params.destinationCountry}
              onValueChange={(v) => updateField('destinationCountry', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Route Preview */}
        {originCountry && destCountry && (
          <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-muted/50">
            <div className="text-center">
              <span className="text-2xl">{originCountry.flag}</span>
              <p className="text-sm font-medium mt-1">{originCountry.name}</p>
            </div>
            <ArrowRight className="w-6 h-6 text-primary" />
            <div className="text-center">
              <span className="text-2xl">{destCountry.flag}</span>
              <p className="text-sm font-medium mt-1">{destCountry.name}</p>
            </div>
          </div>
        )}

        {/* Incoterm Selection */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            Incoterm souhaité
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>L'Incoterm définit la répartition des frais et risques entre vendeur et acheteur.</p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(Object.keys(INCOTERM_INFO) as Incoterm[]).map((term) => {
              const info = INCOTERM_INFO[term];
              const isSelected = params.incoterm === term;
              return (
                <button
                  key={term}
                  type="button"
                  onClick={() => updateField('incoterm', term)}
                  className={cn(
                    'p-3 rounded-lg border-2 transition-all text-left',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  )}
                >
                  <p className={cn('font-bold text-sm', isSelected && 'text-primary')}>
                    {term}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{info.name}</p>
                </button>
              );
            })}
          </div>
          {params.incoterm && (
            <p className="text-sm text-muted-foreground p-3 rounded-lg bg-accent/50">
              {INCOTERM_INFO[params.incoterm].description}
            </p>
          )}
        </div>

        {/* Transport Mode */}
        <div className="space-y-3">
          <Label>Mode de transport</Label>
          <RadioGroup
            value={params.transportMode}
            onValueChange={(v) => updateField('transportMode', v as TransportMode)}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {(Object.keys(TRANSPORT_MODES) as TransportMode[]).map((mode) => {
              const info = TRANSPORT_MODES[mode];
              const Icon = transportIcons[mode];
              const isSelected = params.transportMode === mode;
              return (
                <Label
                  key={mode}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  )}
                >
                  <RadioGroupItem value={mode} className="sr-only" />
                  <Icon className={cn('w-6 h-6', isSelected ? 'text-primary' : 'text-muted-foreground')} />
                  <span className={cn('text-sm font-medium', isSelected && 'text-primary')}>
                    {info.name}
                  </span>
                </Label>
              );
            })}
          </RadioGroup>
        </div>

        {/* Quantity & Currency */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantité (unités)</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={params.quantity}
              onChange={(e) => updateField('quantity', parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="space-y-2">
            <Label>Devise de sortie</Label>
            <Select
              value={params.outputCurrency}
              onValueChange={(v) => updateField('outputCurrency', v as Currency)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CURRENCIES).map(([code, { name, symbol }]) => (
                  <SelectItem key={code} value={code}>
                    {symbol} - {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Exchange Rate Info */}
        <div className="p-3 rounded-lg bg-muted/50 text-sm flex items-center gap-2">
          <Info className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Taux : 1 EUR = {exchangeRate.toFixed(params.outputCurrency === 'XOF' ? 0 : 4)} {CURRENCIES[params.outputCurrency].symbol}
          </span>
        </div>

        {/* Margin & Insurance */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="margin">Taux de marge (%)</Label>
            <Input
              id="margin"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={(params.marginRate * 100).toFixed(0)}
              onChange={(e) => updateField('marginRate', (parseFloat(e.target.value) || 0) / 100)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insurance">Taux assurance (%)</Label>
            <Input
              id="insurance"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={(params.insuranceRate * 100).toFixed(2)}
              onChange={(e) => updateField('insuranceRate', (parseFloat(e.target.value) || 0) / 100)}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
            Retour
          </Button>
          <Button variant="hero" size="lg" onClick={onNext} className="flex-1">
            Calculer les coûts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
