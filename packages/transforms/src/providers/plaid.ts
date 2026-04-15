import type { Transaction, Account } from '@claremesh/schema';
import { type TransformContext, generateId, toISO, normalizeCurrency } from '../context';

export function transformPlaidTransaction(
  raw: Record<string, any>,
  ctx: TransformContext
): Transaction {
  const currency = normalizeCurrency(raw.iso_currency_code || raw.unofficial_currency_code || 'USD');
  return {
    id: generateId(),
    org_id: ctx.org_id,
    account_id: raw.account_id || generateId(),
    provider_id: raw.transaction_id,
    amount: -(raw.amount ?? 0),
    currency,
    date: toISO(raw.date || raw.authorized_date),
    description: raw.merchant_name || raw.name || '',
    category: Array.isArray(raw.category) ? raw.category.join(' > ') : raw.category,
    status: raw.pending ? 'pending' : 'posted',
    entity_id: ctx.entity_id,
    metadata: {
      plaid: {
        payment_channel: raw.payment_channel,
        location: raw.location,
        personal_finance_category: raw.personal_finance_category,
        authorized_date: raw.authorized_date,
      },
    },
    created_at: new Date().toISOString(),
  };
}

export function transformPlaidAccount(
  raw: Record<string, any>,
  ctx: TransformContext
): Account {
  const typeMap: Record<string, Account['type']> = {
    depository: 'asset', credit: 'liability', loan: 'liability',
    investment: 'asset', other: 'asset', brokerage: 'asset',
  };
  const currency = normalizeCurrency(raw.balances?.iso_currency_code || 'USD');
  return {
    id: generateId(),
    org_id: ctx.org_id,
    provider_id: raw.account_id,
    name: raw.name || raw.official_name || 'Unknown',
    type: typeMap[raw.type] || 'asset',
    subtype: raw.subtype,
    currency,
    institution_name: raw.institution_name,
    metadata: { plaid: { mask: raw.mask, verification_status: raw.verification_status } },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

