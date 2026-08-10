'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { useListDestinationsQuery } from '@/features/destination';
import {
  propertyFormSchema,
  type PropertyFormValues,
  type Property,
  PROPERTY_TYPES,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
} from '@/features/property';

interface PropertyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property | null;
}

const EMPTY_VALUES: PropertyFormValues = {
  name: '',
  type: 'HOTEL',
  destinationId: '',
  description: '',
  address: '',
  city: '',
  country: '',
  checkInTime: '',
  checkOutTime: '',
  cancellationPolicy: '',
};

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  HOTEL: 'Khách sạn',
  RESORT: 'Resort',
  VILLA: 'Villa',
  APARTMENT: 'Căn hộ',
  HOSTEL: 'Hostel',
  HOMESTAY: 'Homestay',
};

export function PropertyFormDialog({ open, onOpenChange, property }: PropertyFormDialogProps) {
  const isEdit = Boolean(property);
  const { data: destinations } = useListDestinationsQuery();
  const [createProperty, { isLoading: isCreating, error: createError }] = useCreatePropertyMutation();
  const [updateProperty, { isLoading: isUpdating, error: updateError }] = useUpdatePropertyMutation();
  const isSubmitting = isCreating || isUpdating;
  const submitError = createError || updateError;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(
        property
          ? {
              name: property.name,
              type: property.type as PropertyFormValues['type'],
              destinationId: property.destinationId,
              description: property.description ?? '',
              address: property.address ?? '',
              city: property.city ?? '',
              country: property.country ?? '',
              checkInTime: property.checkInTime ?? '',
              checkOutTime: property.checkOutTime ?? '',
              cancellationPolicy: property.cancellationPolicy ?? '',
            }
          : EMPTY_VALUES,
      );
    }
  }, [open, property, reset]);

  const onSubmit = async (values: PropertyFormValues) => {
    const body = {
      name: values.name,
      type: values.type,
      destinationId: values.destinationId,
      ...(values.description ? { description: values.description } : {}),
      ...(values.address ? { address: values.address } : {}),
      ...(values.city ? { city: values.city } : {}),
      ...(values.country ? { country: values.country } : {}),
      ...(values.checkInTime ? { checkInTime: values.checkInTime } : {}),
      ...(values.checkOutTime ? { checkOutTime: values.checkOutTime } : {}),
      ...(values.cancellationPolicy ? { cancellationPolicy: values.cancellationPolicy } : {}),
    };

    if (isEdit && property) {
      await updateProperty({ id: property.id, body }).unwrap();
    } else {
      await createProperty(body).unwrap();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Sửa Property' : 'Thêm Property'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="property-name">Tên Property</Label>
            <Input id="property-name" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="property-type">Loại hình</Label>
              <select
                id="property-type"
                {...register('type')}
                className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {PROPERTY_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="property-destination">Điểm đến</Label>
              <select
                id="property-destination"
                {...register('destinationId')}
                className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">— Chọn —</option>
                {destinations?.items.map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name}
                  </option>
                ))}
              </select>
              {errors.destinationId && (
                <p className="text-xs text-destructive">{errors.destinationId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="property-city">Thành phố</Label>
              <Input id="property-city" {...register('city')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="property-country">Quốc gia</Label>
              <Input id="property-country" {...register('country')} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="property-address">Địa chỉ</Label>
            <Input id="property-address" {...register('address')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="property-checkin">Giờ nhận phòng</Label>
              <Input id="property-checkin" placeholder="14:00" {...register('checkInTime')} />
              {errors.checkInTime && <p className="text-xs text-destructive">{errors.checkInTime.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="property-checkout">Giờ trả phòng</Label>
              <Input id="property-checkout" placeholder="12:00" {...register('checkOutTime')} />
              {errors.checkOutTime && (
                <p className="text-xs text-destructive">{errors.checkOutTime.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="property-description">Mô tả</Label>
            <Textarea id="property-description" rows={3} {...register('description')} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="property-policy">Chính sách hủy phòng</Label>
            <Textarea id="property-policy" rows={2} {...register('cancellationPolicy')} />
          </div>

          {submitError && (
            <p className="text-sm text-destructive">
              Không thể lưu Property. Kiểm tra lại thông tin đã nhập.
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Huỷ
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
