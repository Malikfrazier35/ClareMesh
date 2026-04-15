import type { Transaction } from '@claremesh/schema';
import { type TransformContext, generateId, normalizeCurrency } from '../context';

function parseXeroDate(dateStr: string): string {
  const match = dateStr.match(/\/Date\((\d+)([+-]\d{4})?\)\//);
  if (match) return new Date(parseInt(match[1])).toISOString();
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.toISOString();
  throw new Error(`Unparseable Xero date: ${dateStr}`);
}

export function transformXeroInvoice(
  raw: Record<string, any>,
  ctx: TransformContext
): Transaction {
  const currency = normalizeCurrency(raw.CurrencyCode || 'USD');
  const isReceive = raw.Type === 'ACCREC';
  return {
    id: generateId(),
    org_id: ctx.org_id,
    account_id: generateId(),
    provider_id: raw.InvoiceID,
    amount: isReceive ? Math.abs(raw.Total || 0) : -Math.abs(raw.Total || 0),
    currency,
    date: parseXeroDate(raw.Date || raw.DateString),
    description: `Invoice ${raw.InvoiceNumber || raw.InvoiceID} — ${raw.Contact?.Name || 'Unknown'}`,
    status: raw.Status === 'PAID' ? 'posted' : raw.Status === 'VOIDED' ? 'void' : 'pending',
    entity_id: ctx.entity_id,
    metadata: {
      xero: {
        invoice_number: raw.InvoiceNumber,
        type: raw.Type,
        status: raw.Status,
        due_date: raw.DueDate ? parseXeroDate(raw.DueDate) : undefined,
        amount_due: raw.AmountDue,
        contact: raw.Contact?.Name,
      },
    },
    created_at: new Date().toISOString(),
  };
}

export function transformXeroBankTransaction(
  raw: Record<string, any>,
  ctx: TransformContext
): Transaction {
  const currency = normalizeCurrency(raw.CurrencyCode || 'USD');
  const isReceive = raw.Type === 'RECEIVE';
  return {
    id: generateId(),
    org_id: ctx.org_id,
    account_id: raw.BankAccount?.AccountID || generateId(),
    provider_id: raw.BankTransactionID,
    amount: isReceive ? Math.abs(raw.Total || 0) : -Math.abs(raw.Total || 0),
    currency,
    date: parseXeroDate(raw.Date || raw.DateString),
    description: raw.Reference || raw.Contact?.Name || `Bank txn ${raw.BankTransactionID}`,
    status: raw.IsReconciled ? 'posted' : 'pending',
    entity_id: ctx.entity_id,
    metadata: { xero: { type: raw.Type, reference: raw.Reference, is_reconciled: raw.IsReconciled } },
    created_at: new Date().toISOString(),
  };
}

