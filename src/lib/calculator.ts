import type { 
  Product, 
  ExportParams, 
  CostBreakdown, 
  TransportMode,
  Incoterm,
  Currency 
} from '@/types/simulation';
import { TRANSPORT_MODES } from '@/types/simulation';

// Exchange rates (mock data - in production, fetch from API)
const EXCHANGE_RATES: Record<string, number> = {
  'EUR_EUR': 1,
  'EUR_USD': 1.08,
  'EUR_XOF': 655.957,
  'EUR_GBP': 0.86,
  'EUR_MAD': 10.85,
  'EUR_TND': 3.38,
  'USD_EUR': 0.93,
  'USD_USD': 1,
  'USD_XOF': 607.37,
  'XOF_EUR': 0.00152,
  'XOF_USD': 0.00165,
  'XOF_XOF': 1,
};

export function getExchangeRate(from: Currency, to: Currency): number {
  const key = `${from}_${to}`;
  return EXCHANGE_RATES[key] ?? 1;
}

export function convertCurrency(amount: number, from: Currency, to: Currency): number {
  return amount * getExchangeRate(from, to);
}

export function formatCurrency(amount: number, currency: Currency): string {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  const symbols: Record<Currency, string> = {
    EUR: '€',
    USD: '$',
    XOF: ' FCFA',
    GBP: '£',
    MAD: ' DH',
    TND: ' DT',
  };
  
  const symbol = symbols[currency];
  const formatted = formatter.format(Math.round(amount));
  
  if (currency === 'EUR' || currency === 'GBP') {
    return `${formatted} ${symbol}`;
  }
  
  return `${formatted}${symbol}`;
}

export function calculateChargeableWeight(
  grossWeightKg: number,
  volumeM3: number,
  transportMode: TransportMode
): number {
  const factor = TRANSPORT_MODES[transportMode].conversionFactor;
  const volumetricWeight = volumeM3 * factor;
  return Math.max(grossWeightKg, volumetricWeight);
}

// Freight cost estimation (simplified mock)
function getFreightCost(
  originCountry: string,
  destCountry: string,
  chargeableWeight: number,
  transportMode: TransportMode
): number {
  // Base rates per kg by transport mode (in EUR)
  const baseRates: Record<TransportMode, number> = {
    aerien: 4.5,
    maritime: 0.8,
    routier: 1.2,
    ferroviaire: 1.0,
  };
  
  // Distance multipliers (simplified)
  const distanceMultiplier = getDistanceMultiplier(originCountry, destCountry);
  
  return chargeableWeight * baseRates[transportMode] * distanceMultiplier;
}

function getDistanceMultiplier(origin: string, dest: string): number {
  // Simplified distance estimation
  const sameRegion = ['FR', 'DE', 'BE', 'ES', 'IT', 'NL', 'PT'];
  const africa = ['CI', 'SN', 'ML', 'BF', 'NE', 'TG', 'BJ', 'GN', 'MA', 'TN', 'DZ', 'NG', 'GH', 'CM', 'GA'];
  
  if (sameRegion.includes(origin) && sameRegion.includes(dest)) return 0.5;
  if (africa.includes(origin) && africa.includes(dest)) return 0.6;
  if ((sameRegion.includes(origin) && africa.includes(dest)) || 
      (africa.includes(origin) && sameRegion.includes(dest))) return 1.0;
  return 1.5;
}

// Customs duty rates by HS code prefix and destination (simplified)
function getCustomsDutyRate(hsCode: string, destCountry: string): number {
  // Simplified duty rates - in production, fetch from customs database
  const chapter = hsCode.substring(0, 2);
  const euCountries = ['FR', 'DE', 'BE', 'ES', 'IT', 'NL', 'PT'];
  
  // EU countries with no duty for EU origin
  if (euCountries.includes(destCountry)) {
    return 0.05; // 5% average
  }
  
  // Simplified rates by product category
  const rates: Record<string, number> = {
    '01': 0.10, // Live animals
    '02': 0.12, // Meat
    '03': 0.08, // Fish
    '08': 0.15, // Fruits
    '09': 0.05, // Coffee, tea
    '18': 0.08, // Cocoa
    '61': 0.12, // Apparel knitted
    '62': 0.12, // Apparel not knitted
    '84': 0.03, // Machinery
    '85': 0.03, // Electronics
    '87': 0.10, // Vehicles
  };
  
  return rates[chapter] ?? 0.08; // Default 8%
}

function getImportVatRate(destCountry: string): number {
  const vatRates: Record<string, number> = {
    FR: 0.20,
    DE: 0.19,
    BE: 0.21,
    ES: 0.21,
    IT: 0.22,
    NL: 0.21,
    PT: 0.23,
    GB: 0.20,
    CI: 0.18,
    SN: 0.18,
    MA: 0.20,
    TN: 0.19,
    US: 0,
  };
  
  return vatRates[destCountry] ?? 0.18;
}

export function calculateExportCost(
  product: Product,
  params: ExportParams
): CostBreakdown {
  const { quantity, transportMode, incoterm, originCountry, destinationCountry, outputCurrency, marginRate, insuranceRate } = params;
  
  // Convert product value to EUR for calculations
  const productValueEur = convertCurrency(product.unitValue, product.currency, 'EUR');
  
  // === LEVEL 1: EXW ===
  const productionCost = productValueEur * quantity;
  const packagingCost = productionCost * 0.05; // 5% for packaging
  const margin = (productionCost + packagingCost) * marginRate;
  const exwTotal = productionCost + packagingCost + margin;
  
  // === LEVEL 2: FOB ===
  const localTransport = 80 + (quantity * product.grossWeightKg * 0.1); // Base + weight-based
  const handling = 45 + (quantity * product.grossWeightKg * 0.05);
  const exportCustoms = 25;
  const fobTotal = exwTotal + localTransport + handling + exportCustoms;
  
  // === LEVEL 3: CIF ===
  const chargeableWeight = calculateChargeableWeight(
    product.grossWeightKg * quantity,
    product.volumeM3 * quantity,
    transportMode
  );
  const freight = getFreightCost(originCountry, destinationCountry, chargeableWeight, transportMode);
  const insurance = fobTotal * insuranceRate;
  const cifTotal = fobTotal + freight + insurance;
  
  // === LEVEL 4: DDP ===
  const dutyRate = getCustomsDutyRate(product.hsCode, destinationCountry);
  const customsDuty = cifTotal * dutyRate;
  const vatRate = getImportVatRate(destinationCountry);
  const importVat = (cifTotal + customsDuty) * vatRate;
  const finalDelivery = 60 + (quantity * product.grossWeightKg * 0.08);
  const ddpTotal = cifTotal + customsDuty + importVat + finalDelivery;
  
  // Exchange rate for output
  const exchangeRate = getExchangeRate('EUR', outputCurrency);
  
  // Convert all values to output currency
  const convert = (val: number) => val * exchangeRate;
  
  return {
    productionCost: convert(productionCost),
    packagingCost: convert(packagingCost),
    margin: convert(margin),
    exwTotal: convert(exwTotal),
    
    localTransport: convert(localTransport),
    handling: convert(handling),
    exportCustoms: convert(exportCustoms),
    fobTotal: convert(fobTotal),
    
    freight: convert(freight),
    insurance: convert(insurance),
    cifTotal: convert(cifTotal),
    
    customsDuty: convert(customsDuty),
    importVat: convert(importVat),
    finalDelivery: convert(finalDelivery),
    ddpTotal: convert(ddpTotal),
    
    chargeableWeight,
    exchangeRate,
    outputCurrency,
  };
}

export function getTotalByIncoterm(breakdown: CostBreakdown, incoterm: Incoterm): number {
  switch (incoterm) {
    case 'EXW':
      return breakdown.exwTotal;
    case 'FCA':
    case 'FOB':
      return breakdown.fobTotal;
    case 'CFR':
    case 'CIF':
      return breakdown.cifTotal;
    case 'DAP':
    case 'DDP':
      return breakdown.ddpTotal;
    default:
      return breakdown.ddpTotal;
  }
}
