import { useState } from 'react';
import { Package, Weight, Box, DollarSign, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HSCodeSearch } from './HSCodeSearch';
import type { Product, Currency } from '@/types/simulation';
import { CURRENCIES } from '@/types/simulation';
import { calculateChargeableWeight } from '@/lib/calculator';

interface ProductFormProps {
  product: Product;
  onChange: (product: Product) => void;
  onNext: () => void;
}

export function ProductForm({ product, onChange, onNext }: ProductFormProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof Product, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Product, string>> = {};
    
    if (!product.name || product.name.length < 3) {
      newErrors.name = 'Le nom doit contenir au moins 3 caractères';
    }
    if (!product.hsCode || !/^\d{6,10}$/.test(product.hsCode)) {
      newErrors.hsCode = 'Code SH invalide (6-10 chiffres)';
    }
    if (product.netWeightKg <= 0) {
      newErrors.netWeightKg = 'Le poids doit être supérieur à 0';
    }
    if (product.grossWeightKg < product.netWeightKg) {
      newErrors.grossWeightKg = 'Le poids brut doit être ≥ au poids net';
    }
    if (product.volumeM3 <= 0) {
      newErrors.volumeM3 = 'Le volume doit être supérieur à 0';
    }
    if (product.unitValue <= 0) {
      newErrors.unitValue = 'La valeur doit être supérieure à 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onNext();
    }
  };

  const updateField = <K extends keyof Product>(field: K, value: Product[K]) => {
    onChange({ ...product, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  // Calculate chargeable weight preview (using maritime as default)
  const chargeableWeight = calculateChargeableWeight(
    product.grossWeightKg,
    product.volumeM3,
    'maritime'
  );

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Informations Produit</CardTitle>
            <CardDescription>Décrivez le produit à exporter</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            Nom du produit
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Ex: Beurre de karité bio"
            value={product.name}
            onChange={(e) => updateField('name', e.target.value)}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        {/* HS Code */}
        <div className="space-y-2">
          <Label htmlFor="hsCode" className="flex items-center gap-2">
            Code SH (douanier)
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Le code du Système Harmonisé (6-10 chiffres) détermine les droits de douane applicables. Tapez pour rechercher dans la base TEC CEDEAO.</p>
              </TooltipContent>
            </Tooltip>
            <span className="text-destructive">*</span>
          </Label>
          <HSCodeSearch
            value={product.hsCode}
            onChange={(code) => updateField('hsCode', code)}
            error={errors.hsCode}
          />
        </div>

        {/* Weight Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="netWeight" className="flex items-center gap-2">
              <Weight className="w-4 h-4" />
              Poids net (kg)
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="netWeight"
              type="number"
              step="0.001"
              placeholder="0.000"
              value={product.netWeightKg || ''}
              onChange={(e) => updateField('netWeightKg', parseFloat(e.target.value) || 0)}
              className={errors.netWeightKg ? 'border-destructive' : ''}
            />
            {errors.netWeightKg && <p className="text-xs text-destructive">{errors.netWeightKg}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="grossWeight" className="flex items-center gap-2">
              <Weight className="w-4 h-4" />
              Poids brut (kg)
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="grossWeight"
              type="number"
              step="0.001"
              placeholder="0.000"
              value={product.grossWeightKg || ''}
              onChange={(e) => updateField('grossWeightKg', parseFloat(e.target.value) || 0)}
              className={errors.grossWeightKg ? 'border-destructive' : ''}
            />
            {errors.grossWeightKg && <p className="text-xs text-destructive">{errors.grossWeightKg}</p>}
          </div>
        </div>

        {/* Volume */}
        <div className="space-y-2">
          <Label htmlFor="volume" className="flex items-center gap-2">
            <Box className="w-4 h-4" />
            Volume (m³)
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="volume"
            type="number"
            step="0.0001"
            placeholder="0.0000"
            value={product.volumeM3 || ''}
            onChange={(e) => updateField('volumeM3', parseFloat(e.target.value) || 0)}
            className={errors.volumeM3 ? 'border-destructive' : ''}
          />
          {errors.volumeM3 && <p className="text-xs text-destructive">{errors.volumeM3}</p>}
        </div>

        {/* Chargeable Weight Info */}
        {product.grossWeightKg > 0 && product.volumeM3 > 0 && (
          <div className="p-4 rounded-lg bg-accent/50 border border-accent flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Poids taxable estimé (maritime) : </span>
              <span className="font-semibold text-foreground">{chargeableWeight.toFixed(2)} kg</span>
            </div>
          </div>
        )}

        {/* Value and Currency */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="value" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Valeur unitaire
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={product.unitValue || ''}
              onChange={(e) => updateField('unitValue', parseFloat(e.target.value) || 0)}
              className={errors.unitValue ? 'border-destructive' : ''}
            />
            {errors.unitValue && <p className="text-xs text-destructive">{errors.unitValue}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Devise</Label>
            <Select
              value={product.currency}
              onValueChange={(v) => updateField('currency', v as Currency)}
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

        {/* Submit Button */}
        <div className="pt-4">
          <Button onClick={handleSubmit} variant="hero" size="lg" className="w-full">
            Continuer vers les paramètres d'export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
