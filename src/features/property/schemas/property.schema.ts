import { z } from 'zod';
import { PROPERTY_TYPES } from '../types/property.types';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export const propertyFormSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên').max(255),
  type: z.enum(PROPERTY_TYPES, { message: 'Vui lòng chọn loại hình' }),
  destinationId: z.string().min(1, 'Vui lòng chọn điểm đến'),
  description: z.string().max(2000).optional().or(z.literal('')),
  address: z.string().max(255).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
  checkInTime: z.string().regex(TIME_PATTERN, 'Định dạng HH:mm').optional().or(z.literal('')),
  checkOutTime: z.string().regex(TIME_PATTERN, 'Định dạng HH:mm').optional().or(z.literal('')),
  cancellationPolicy: z.string().max(2000).optional().or(z.literal('')),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
