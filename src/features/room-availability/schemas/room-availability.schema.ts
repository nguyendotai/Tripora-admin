import { z } from 'zod';

export const upsertAvailabilityFormSchema = z.object({
  date: z.string().min(1, 'Vui lòng chọn ngày'),
  total: z.number().int().min(0),
  price: z.number().min(0),
});

export type UpsertAvailabilityFormValues = z.infer<typeof upsertAvailabilityFormSchema>;
