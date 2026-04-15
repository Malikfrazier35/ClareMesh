import { z } from 'zod';

export const ForecastSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string(),
  account_id: z.string().uuid(),
  period_start: z.string().datetime(),
  period_end: z.string().datetime(),
  projected_balance: z.number(),
  confidence: z.number().min(0).max(1),
  method: z.enum(['linear', 'ema', 'monte_carlo']),
  metadata: z.record(z.unknown()).default({}),
  created_at: z.string().datetime(),
});

export type Forecast = z.infer<typeof ForecastSchema>;

