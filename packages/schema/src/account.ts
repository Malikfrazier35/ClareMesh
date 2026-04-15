import { z } from 'zod';

export const AccountSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string(),
  provider_id: z.string(),
  name: z.string().min(1),
  type: z.enum(['asset', 'liability', 'equity', 'revenue', 'expense']),
  subtype: z.string().optional(),
  currency: z.string().regex(/^[A-Z]{3}$/),
  parent_id: z.string().uuid().optional(),
  institution_name: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Account = z.infer<typeof AccountSchema>;

