// Types for the Export Cost Simulator

export type TransportMode = 'maritime' | 'aerien' | 'routier' | 'ferroviaire';

export type Incoterm = 'EXW' | 'FCA' | 'FAS' | 'FOB' | 'CFR' | 'CIF' | 'CPT' | 'CIP' | 'DPU' | 'DAP' | 'DDP';

export type Currency = 'EUR' | 'USD' | 'XOF' | 'GBP' | 'MAD' | 'TND';

export interface Product {
  name: string;
  hsCode: string;
  netWeightKg: number;
  grossWeightKg: number;
  volumeM3: number;
  unitValue: number;
  currency: Currency;
}

export interface ExportParams {
  originCountry: string;
  destinationCountry: string;
  incoterm: Incoterm;
  transportMode: TransportMode;
  quantity: number;
  outputCurrency: Currency;
  marginRate: number;
  insuranceRate: number;
}

export interface CostBreakdown {
  // EXW Level
  productionCost: number;
  packagingCost: number;
  margin: number;
  exwTotal: number;
  
  // FOB Level
  localTransport: number;
  handling: number;
  exportCustoms: number;
  fobTotal: number;
  
  // CIF Level
  freight: number;
  insurance: number;
  cifTotal: number;
  
  // DDP Level
  customsDuty: number;
  importVat: number;
  finalDelivery: number;
  ddpTotal: number;
  
  // Meta
  chargeableWeight: number;
  exchangeRate: number;
  outputCurrency: Currency;
}

export interface SimulationResult {
  id: string;
  product: Product;
  params: ExportParams;
  breakdown: CostBreakdown;
  createdAt: Date;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  defaultCurrency: Currency;
}

export interface ExchangeRate {
  from: Currency;
  to: Currency;
  rate: number;
  updatedAt: Date;
}

// Incoterm descriptions - Incoterms® 2026
export const INCOTERM_INFO: Record<Incoterm, { name: string; description: string; level: number }> = {
  EXW: {
    name: 'Ex-Works',
    description: 'Prix départ usine - L\'acheteur supporte tous les frais à partir de l\'usine',
    level: 1,
  },
  FCA: {
    name: 'Free Carrier',
    description: 'Franco transporteur - Livraison au transporteur désigné par l\'acheteur',
    level: 2,
  },
  FAS: {
    name: 'Free Alongside Ship',
    description: 'Franco le long du navire - Marchandise placée le long du navire au port d\'embarquement',
    level: 2,
  },
  FOB: {
    name: 'Free On Board',
    description: 'Franco à bord - Transfert de risque au chargement sur le navire',
    level: 2,
  },
  CFR: {
    name: 'Cost and Freight',
    description: 'Coût et fret - Fret inclus jusqu\'au port de destination',
    level: 3,
  },
  CIF: {
    name: 'Cost, Insurance, Freight',
    description: 'Coût, assurance et fret inclus jusqu\'au port de destination',
    level: 3,
  },
  CPT: {
    name: 'Carriage Paid To',
    description: 'Port payé jusqu\'à - Fret payé jusqu\'au lieu de destination convenu',
    level: 3,
  },
  CIP: {
    name: 'Carriage and Insurance Paid To',
    description: 'Port payé, assurance comprise - Fret et assurance payés jusqu\'au lieu convenu',
    level: 3,
  },
  DPU: {
    name: 'Delivered at Place Unloaded',
    description: 'Rendu au lieu de destination déchargé - Marchandise déchargée à destination',
    level: 4,
  },
  DAP: {
    name: 'Delivered at Place',
    description: 'Rendu au lieu de destination - L\'acheteur paie les droits de douane et la détaxe à l\'arrivée',
    level: 4,
  },
  DDP: {
    name: 'Delivered Duty Paid',
    description: 'Rendu droits acquittés - Le vendeur supporte tous les frais',
    level: 4,
  },
};

export const TRANSPORT_MODES: Record<TransportMode, { name: string; icon: string; conversionFactor: number }> = {
  maritime: { name: 'Maritime', icon: 'Ship', conversionFactor: 1000 },
  aerien: { name: 'Aérien', icon: 'Plane', conversionFactor: 167 },
  routier: { name: 'Routier', icon: 'Truck', conversionFactor: 333 },
  ferroviaire: { name: 'Ferroviaire', icon: 'Train', conversionFactor: 500 },
};

export const CURRENCIES: Record<Currency, { name: string; symbol: string }> = {
  EUR: { name: 'Euro', symbol: '€' },
  USD: { name: 'Dollar US', symbol: '$' },
  XOF: { name: 'Franc CFA', symbol: 'FCFA' },
  GBP: { name: 'Livre Sterling', symbol: '£' },
  MAD: { name: 'Dirham Marocain', symbol: 'DH' },
  TND: { name: 'Dinar Tunisien', symbol: 'DT' },
};
