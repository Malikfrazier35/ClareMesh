import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string(),
  account_id: z.string().uuid(),
  provider_id: z.string(),
  amount: z.number(),
  currency: z.string().regex(/^[A-Z]{3}$/),
  date: z.string().datetime(),
  description: z.string(),
  category: z.string().optional(),
  status: z.enum(['pending', 'posted', 'void']),
  entity_id: z.string().uuid().optional(),
  metadata: z.record(z.unknown()).default({}),
  created_at: z.string().datetime(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

