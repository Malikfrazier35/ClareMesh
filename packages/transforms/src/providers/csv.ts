import type { Transaction } from '@claremesh/schema';
import { type TransformContext, generateId, toISO, normalizeCurrency } from '../context';

interface CSVMapping {
  amount: string;
  date: string;
  description: string;
  currency?: string;
  category?: string;
  status?: string;
}

export function transformCSV(
  rows: Record<string, string>[],
  ctx: TransformContext & { mapping: CSVMapping }
): Transaction[] {
  return rows.map((row, i) => {
    const amount = parseFloat(row[ctx.mapping.amount] || '0');
    if (isNaN(amount)) throw new Error(`Row ${i}: invalid amount "${row[ctx.mapping.amount]}"`);

    const dateRaw = row[ctx.mapping.date];
    if (!dateRaw) throw new Error(`Row ${i}: missing date`);

    const currency = ctx.mapping.currency ? normalizeCurrency(row[ctx.mapping.currency] || 'USD') : 'USD';

    return {
      id: generateId(),
      org_id: ctx.org_id,
      account_id: generateId(),
      provider_id: `csv-${i}-${Date.now()}`,
      amount,
      currency,
      date: toISO(dateRaw),
      description: row[ctx.mapping.description] || '',
      category: ctx.mapping.category ? row[ctx.mapping.category] : undefined,
      status: (ctx.mapping.status ? row[ctx.mapping.status] : 'posted') as 'pending' | 'posted' | 'void',
      entity_id: ctx.entity_id,
      metadata: { csv: { row_index: i, raw: row } },
      created_at: new Date().toISOString(),
    };
  });
}

