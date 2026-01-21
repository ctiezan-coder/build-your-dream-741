import { useState } from 'react';
import { StepIndicator } from './StepIndicator';
import { ProductForm } from './ProductForm';
import { ExportParamsForm } from './ExportParamsForm';
import { ResultsView } from './ResultsView';
import type { Product, ExportParams, CostBreakdown } from '@/types/simulation';
import { calculateExportCost } from '@/lib/calculator';

const initialProduct: Product = {
  name: '',
  hsCode: '',
  netWeightKg: 0,
  grossWeightKg: 0,
  volumeM3: 0,
  unitValue: 0,
  currency: 'EUR',
};

const initialParams: ExportParams = {
  originCountry: 'CI',
  destinationCountry: 'FR',
  incoterm: 'DDP',
  transportMode: 'maritime',
  quantity: 1,
  outputCurrency: 'EUR',
  marginRate: 0.15,
  insuranceRate: 0.005,
};

export function SimulatorPage() {
  const [step, setStep] = useState(0);
  const [product, setProduct] = useState<Product>(initialProduct);
  const [params, setParams] = useState<ExportParams>(initialParams);
  const [breakdown, setBreakdown] = useState<CostBreakdown | null>(null);

  const handleCalculate = () => {
    const result = calculateExportCost(product, params);
    setBreakdown(result);
    setStep(2);
  };

  const handleReset = () => {
    setProduct(initialProduct);
    setParams(initialParams);
    setBreakdown(null);
    setStep(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <span className="text-xl">📦</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">ACIEXSimul</h1>
                <p className="text-xs text-muted-foreground">Simulateur de coûts export</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <StepIndicator currentStep={step} totalSteps={3} />

        {step === 0 && (
          <ProductForm
            product={product}
            onChange={setProduct}
            onNext={() => setStep(1)}
          />
        )}

        {step === 1 && (
          <ExportParamsForm
            params={params}
            onChange={setParams}
            onNext={handleCalculate}
            onBack={() => setStep(0)}
          />
        )}

        {step === 2 && breakdown && (
          <ResultsView
            product={product}
            params={params}
            breakdown={breakdown}
            onBack={() => setStep(1)}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>ACIEXSimul — Plateforme de simulation des coûts à l'exportation</p>
          <p className="mt-1">Basé sur les Incoterms® 2026</p>
        </div>
      </footer>
    </div>
  );
}
