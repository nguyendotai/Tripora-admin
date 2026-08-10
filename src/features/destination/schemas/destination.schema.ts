import { z } from 'zod';

export const destinationFormSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên điểm đến').max(255),
  country: z.string().max(100).optional().or(z.literal('')),
  description: z.string().max(2000).optional().or(z.literal('')),
});

export type DestinationFormValues = z.infer<typeof destinationFormSchema>;
