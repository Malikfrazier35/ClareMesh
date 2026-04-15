# @claremesh/schema

Canonical financial data schema — 5 objects, TypeScript types, Zod validation.

## Install

```bash
npm install @claremesh/schema zod
```

## Objects

- **Account** — bank accounts, GL accounts, investment accounts
- **Transaction** — debits, credits, payments, refunds
- **Entity** — vendors, customers, employees, institutions
- **Balance** — point-in-time account balances
- **Forecast** — projected balances with confidence intervals

## Usage

```typescript
import { TransactionSchema, type Transaction } from '@claremesh/schema';

// Validate a transaction
const result = TransactionSchema.safeParse(data);
if (result.success) {
  const txn: Transaction = result.data;
}
```

## Conventions

- **Amounts**: positive = inflow (debit), negative = outflow (credit)
- **Currency**: uppercase ISO 4217 (USD, EUR, GBP, JPY)
- **Dates**: ISO 8601 UTC (2026-04-15T00:00:00.000Z)
- **IDs**: UUID v4

## License

MIT — https://claremesh.com
