import { z } from 'zod';

export const roomFormSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên').max(255),
  type: z.string().max(50).optional().or(z.literal('')),
  capacityAdults: z.number().int().min(1).max(50),
  capacityChildren: z.number().int().min(0).max(50),
  bedType: z.string().max(50).optional().or(z.literal('')),
  basePrice: z.number().min(0),
  currency: z.string().max(10).optional().or(z.literal('')),
});

export type RoomFormValues = z.infer<typeof roomFormSchema>;
