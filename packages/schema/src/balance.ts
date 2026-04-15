import { z } from 'zod';

export const BalanceSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string(),
  account_id: z.string().uuid(),
  current: z.number(),
  available: z.number().optional(),
  currency: z.string().regex(/^[A-Z]{3}$/),
  as_of: z.string().datetime(),
  created_at: z.string().datetime(),
});

export type Balance = z.infer<typeof BalanceSchema>;

