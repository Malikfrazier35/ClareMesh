# @claremesh/transforms

Provider-specific financial data transforms. Raw API responses in, clean ClareMesh schema out.

## Install

```bash
npm install @claremesh/transforms @claremesh/schema zod
```

## Providers

| Provider | Functions | Edge cases handled |
|---|---|---|
| Plaid | `transformPlaidTransaction`, `transformPlaidAccount` | Sign flip, pending/posted, category arrays |
| Stripe | `transformStripeCharge`, `transformStripeRefund` | Cents→dollars, JPY exception, Unix timestamps |
| QuickBooks | `transformQBJournalEntry`, `transformQBInvoice` | Multi-line explosion, PostingType, CurrencyRef |
| Xero | `transformXeroInvoice`, `transformXeroBankTransaction` | /Date() parsing, ACCREC/ACCPAY, reconciliation |
| CSV | `transformCSV` | Custom column mapping, type coercion |

## Usage

```typescript
import { transformPlaidTransaction } from '@claremesh/transforms/plaid';
import type { Transaction } from '@claremesh/schema';

const txn: Transaction = transformPlaidTransaction(plaidData, {
  org_id: 'org_d8afc85d',
  entity_id: 'ent_acme_01',
});
```

## License

MIT — https://claremesh.com
