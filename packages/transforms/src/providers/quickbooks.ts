import type { Transaction } from '@claremesh/schema';
import { type TransformContext, generateId, toISO, normalizeCurrency } from '../context';

export function transformQBJournalEntry(
  raw: Record<string, any>,
  ctx: TransformContext
): Transaction[] {
  const lines = raw.Line || [];
  const currency = normalizeCurrency(raw.CurrencyRef || 'USD');
  const date = toISO(raw.TxnDate || raw.MetaData?.CreateTime);

  return lines
    .filter((line: any) => line.DetailType === 'JournalEntryLineDetail')
    .map((line: any) => {
      const detail = line.JournalEntryLineDetail || {};
      const isDebit = detail.PostingType === 'Debit';
      return {
        id: generateId(),
        org_id: ctx.org_id,
        account_id: detail.AccountRef?.value || generateId(),
        provider_id: `${raw.Id}-${line.Id || generateId()}`,
        amount: isDebit ? Math.abs(line.Amount || 0) : -Math.abs(line.Amount || 0),
        currency,
        date,
        description: line.Description || raw.DocNumber || `JE ${raw.Id}`,
        status: 'posted' as const,
        entity_id: detail.Entity?.EntityRef?.value || ctx.entity_id,
        metadata: {
          quickbooks: {
            doc_number: raw.DocNumber,
            posting_type: detail.PostingType,
            account_ref: detail.AccountRef,
            class_ref: detail.ClassRef,
          },
        },
        created_at: new Date().toISOString(),
      };
    });
}

export function transformQBInvoice(
  raw: Record<string, any>,
  ctx: TransformContext
): Transaction {
  const currency = normalizeCurrency(raw.CurrencyRef || 'USD');
  return {
    id: generateId(),
    org_id: ctx.org_id,
    account_id: raw.DepositToAccountRef?.value || generateId(),
    provider_id: raw.Id,
    amount: raw.TotalAmt ?? 0,
    currency,
    date: toISO(raw.TxnDate || raw.MetaData?.CreateTime),
    description: `Invoice ${raw.DocNumber || raw.Id} — ${raw.CustomerRef?.name || 'Customer'}`,
    status: raw.Balance === 0 ? 'posted' : 'pending',
    entity_id: raw.CustomerRef?.value || ctx.entity_id,
    metadata: {
      quickbooks: {
        doc_number: raw.DocNumber,
        due_date: raw.DueDate,
        balance: raw.Balance,
        customer_ref: raw.CustomerRef,
      },
    },
    created_at: new Date().toISOString(),
  };
}

