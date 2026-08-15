"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useListDestinationsQuery } from "@/features/destination/api/destination.api";
import { useCreateExperienceMutation, useUpdateExperienceMutation } from "@/features/experience/api/experience.api";
import type { Experience } from "@/features/experience/types/experience.types";
import { ImageUploadField } from "@/shared/components/image-upload-field";

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tên experience"),
  destinationId: z.string().optional(),
  description: z.string().optional(),
  durationLabel: z.string().optional(),
  price: z.string().min(1, "Vui lòng nhập giá"),
  maxParticipants: z.string().optional(),
  included: z.string().optional(),
  excluded: z.string().optional(),
  cancellationPolicy: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ExperienceFormDialog({
  open,
  onOpenChange,
  experience,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience?: Experience | null;
}) {
  const isEdit = !!experience;
  const [createExperience, { isLoading: isCreating }] = useCreateExperienceMutation();
  const [updateExperience, { isLoading: isUpdating }] = useUpdateExperienceMutation();
  const { data: destinations } = useListDestinationsQuery({ limit: 100 });
  const isLoading = isCreating || isUpdating;
  const [images, setImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (open) {
      reset({
        title: experience?.title ?? "",
        destinationId: experience?.destinationId ?? "",
        description: experience?.description ?? "",
        durationLabel: experience?.durationLabel ?? "",
        price: experience?.price ?? "",
        maxParticipants: experience?.maxParticipants ? String(experience.maxParticipants) : "",
        included: experience?.included ?? "",
        excluded: experience?.excluded ?? "",
        cancellationPolicy: experience?.cancellationPolicy ?? "",
      });
      setImages(experience?.images ?? []);
    }
  }, [open, experience, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      title: values.title,
      destinationId: values.destinationId || undefined,
      description: values.description || undefined,
      durationLabel: values.durationLabel || undefined,
      price: values.price,
      maxParticipants: values.maxParticipants ? Number(values.maxParticipants) : undefined,
      included: values.included || undefined,
      excluded: values.excluded || undefined,
      cancellationPolicy: values.cancellationPolicy || undefined,
      images: images.length > 0 ? images : undefined,
    };

    if (isEdit && experience) {
      await updateExperience({ id: experience.id, data: payload }).unwrap();
    } else {
      await createExperience(payload).unwrap();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[864px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa experience" : "Thêm experience"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Tên experience</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="destinationId">Điểm đến</Label>
              <select
                id="destinationId"
                {...register("destinationId")}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <option value="">— Không chọn —</option>
                {destinations?.items.map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="durationLabel">Thời lượng</Label>
              <Input id="durationLabel" placeholder="3 giờ" {...register("durationLabel")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price">Giá (VND)</Label>
              <Input id="price" inputMode="numeric" placeholder="500000" {...register("price")} />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="maxParticipants">Số người tối đa</Label>
              <Input id="maxParticipants" inputMode="numeric" placeholder="10" {...register("maxParticipants")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="included">Bao gồm</Label>
              <Textarea id="included" rows={3} placeholder="Dụng cụ, HDV" {...register("included")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="excluded">Không bao gồm</Label>
              <Textarea id="excluded" rows={3} placeholder="Chi phí cá nhân" {...register("excluded")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cancellationPolicy">Chính sách huỷ</Label>
            <Textarea
              id="cancellationPolicy"
              rows={2}
              placeholder="Huỷ trước 1 ngày hoàn 100%"
              {...register("cancellationPolicy")}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Hình ảnh</Label>
            <ImageUploadField images={images} onChange={setImages} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea id="description" rows={4} {...register("description")} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Huỷ
            </Button>
            <Button type="submit" disabled={isLoading} className="rounded-full">
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
