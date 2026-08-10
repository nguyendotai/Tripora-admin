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
import {
  destinationFormSchema,
  type DestinationFormValues,
  type Destination,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
} from '@/features/destination';

interface DestinationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination?: Destination | null;
}

const EMPTY_VALUES: DestinationFormValues = { name: '', country: '', description: '' };

export function DestinationFormDialog({ open, onOpenChange, destination }: DestinationFormDialogProps) {
  const isEdit = Boolean(destination);
  const [createDestination, { isLoading: isCreating }] = useCreateDestinationMutation();
  const [updateDestination, { isLoading: isUpdating }] = useUpdateDestinationMutation();
  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(
        destination
          ? {
              name: destination.name,
              country: destination.country ?? '',
              description: destination.description ?? '',
            }
          : EMPTY_VALUES,
      );
    }
  }, [open, destination, reset]);

  const onSubmit = async (values: DestinationFormValues) => {
    const body = {
      name: values.name,
      ...(values.country ? { country: values.country } : {}),
      ...(values.description ? { description: values.description } : {}),
    };

    if (isEdit && destination) {
      await updateDestination({ id: destination.id, body }).unwrap();
    } else {
      await createDestination(body).unwrap();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Sửa điểm đến' : 'Thêm điểm đến'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="destination-name">Tên điểm đến</Label>
            <Input id="destination-name" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="destination-country">Quốc gia</Label>
            <Input id="destination-country" {...register('country')} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="destination-description">Mô tả</Label>
            <Textarea id="destination-description" rows={3} {...register('description')} />
          </div>

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
