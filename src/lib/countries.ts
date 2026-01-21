import type { Country, Currency } from '@/types/simulation';

export const COUNTRIES: Country[] = [
  // Europe
  { code: 'FR', name: 'France', flag: '🇫🇷', defaultCurrency: 'EUR' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', defaultCurrency: 'EUR' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪', defaultCurrency: 'EUR' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸', defaultCurrency: 'EUR' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹', defaultCurrency: 'EUR' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱', defaultCurrency: 'EUR' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', defaultCurrency: 'EUR' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', defaultCurrency: 'GBP' },
  
  // Africa
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', defaultCurrency: 'XOF' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', defaultCurrency: 'XOF' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', defaultCurrency: 'XOF' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', defaultCurrency: 'XOF' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', defaultCurrency: 'XOF' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', defaultCurrency: 'XOF' },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯', defaultCurrency: 'XOF' },
  { code: 'GN', name: 'Guinée', flag: '🇬🇳', defaultCurrency: 'XOF' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', defaultCurrency: 'MAD' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', defaultCurrency: 'TND' },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿', defaultCurrency: 'EUR' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', defaultCurrency: 'USD' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', defaultCurrency: 'USD' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', defaultCurrency: 'XOF' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', defaultCurrency: 'XOF' },
  
  // Americas
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', defaultCurrency: 'USD' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', defaultCurrency: 'USD' },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷', defaultCurrency: 'USD' },
  
  // Asia
  { code: 'CN', name: 'Chine', flag: '🇨🇳', defaultCurrency: 'USD' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵', defaultCurrency: 'USD' },
  { code: 'AE', name: 'Émirats Arabes Unis', flag: '🇦🇪', defaultCurrency: 'USD' },
  { code: 'IN', name: 'Inde', flag: '🇮🇳', defaultCurrency: 'USD' },
  { code: 'TR', name: 'Turquie', flag: '🇹🇷', defaultCurrency: 'EUR' },
];

export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find(c => c.code === code);
};

export const getCountryName = (code: string): string => {
  return getCountryByCode(code)?.name ?? code;
};

export const getCountryFlag = (code: string): string => {
  return getCountryByCode(code)?.flag ?? '🏳️';
};
