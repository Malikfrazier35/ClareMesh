import type { Transaction } from '@claremesh/schema';
import { type TransformContext, generateId, toISO, minorToMajor, normalizeCurrency } from '../context';

export function transformStripeCharge(
  raw: Record<string, any>,
  ctx: TransformContext
): Transaction {
  const currency = normalizeCurrency(raw.currency || 'usd');
  return {
    id: generateId(),
    org_id: ctx.org_id,
    account_id: raw.destination || generateId(),
    provider_id: raw.id,
    amount: minorToMajor(raw.amount ?? 0, currency),
    currency,
    date: toISO(raw.created),
    description: raw.description || raw.statement_descriptor || `Charge ${raw.id}`,
    status: raw.status === 'succeeded' ? 'posted' : raw.status === 'pending' ? 'pending' : 'void',
    entity_id: ctx.entity_id,
    metadata: {
      stripe: {
        customer: raw.customer,
        payment_method: raw.payment_method_details?.type,
        receipt_url: raw.receipt_url,
        fee: raw.balance_transaction ? minorToMajor(raw.balance_transaction.fee || 0, currency) : undefined,
      },
    },
    created_at: new Date().toISOString(),
  };
}

export function transformStripeRefund(
  raw: Record<string, any>,
  ctx: TransformContext
): Transaction {
  const currency = normalizeCurrency(raw.currency || 'usd');
  return {
    id: generateId(),
    org_id: ctx.org_id,
    account_id: generateId(),
    provider_id: raw.id,
    amount: -minorToMajor(raw.amount ?? 0, currency),
    currency,
    date: toISO(raw.created),
    description: raw.reason || `Refund for ${raw.charge}`,
    status: raw.status === 'succeeded' ? 'posted' : 'pending',
    entity_id: ctx.entity_id,
    metadata: { stripe: { charge_id: raw.charge, reason: raw.reason } },
    created_at: new Date().toISOString(),
  };
}

