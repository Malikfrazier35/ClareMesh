import { z } from 'zod';

export const EntitySchema = z.object({
  id: z.string().uuid(),
  org_id: z.string(),
  name: z.string().min(1),
  type: z.enum(['vendor', 'customer', 'employee', 'institution']),
  tax_id: z.string().optional(),
  aliases: z.array(z.string()).default([]),
  metadata: z.record(z.unknown()).default({}),
  created_at: z.string().datetime(),
});

export type Entity = z.infer<typeof EntitySchema>;

