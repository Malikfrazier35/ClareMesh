export interface TransformContext {
  org_id: string;
  entity_id?: string;
}

const ZERO_DECIMAL_CURRENCIES = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
  'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF',
]);

export function minorToMajor(amount: number, currency: string): number {
  return ZERO_DECIMAL_CURRENCIES.has(currency.toUpperCase()) ? amount : amount / 100;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function toISO(date: string | number | Date): string {
  const d = new Date(typeof date === 'number' ? date * 1000 : date);
  if (isNaN(d.getTime())) throw new Error(`Invalid date: ${date}`);
  return d.toISOString();
}

export function normalizeCurrency(currency: string | { value?: string; name?: string }): string {
  if (typeof currency === 'object') {
    return (currency.value || currency.name || 'USD').toUpperCase().slice(0, 3);
  }
  return currency.toUpperCase().slice(0, 3);
}

