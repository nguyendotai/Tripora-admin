"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import {
  useCreateTravelGuideMutation,
  useUpdateTravelGuideMutation,
} from "@/features/travel-guide/api/travel-guide.api";
import type { TravelGuide } from "@/features/travel-guide/types/travel-guide.types";

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Vui lòng nhập nội dung"),
  coverImage: z.string().optional(),
  destinationId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function GuideFormDialog({
  open,
  onOpenChange,
  guide,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guide?: TravelGuide | null;
}) {
  const isEdit = !!guide;
  const [createGuide, { isLoading: isCreating }] = useCreateTravelGuideMutation();
  const [updateGuide, { isLoading: isUpdating }] = useUpdateTravelGuideMutation();
  const { data: destinations } = useListDestinationsQuery({ limit: 100 });
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (open) {
      reset({
        title: guide?.title ?? "",
        excerpt: guide?.excerpt ?? "",
        content: guide?.content ?? "",
        coverImage: guide?.coverImage ?? "",
        destinationId: guide?.destinationId ?? "",
      });
    }
  }, [open, guide, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      title: values.title,
      excerpt: values.excerpt || undefined,
      content: values.content,
      coverImage: values.coverImage || undefined,
      destinationId: values.destinationId || undefined,
    };

    if (isEdit && guide) {
      await updateGuide({ id: guide.id, data: payload }).unwrap();
    } else {
      await createGuide(payload).unwrap();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa cẩm nang" : "Thêm cẩm nang"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="destinationId">Điểm đến liên quan (không bắt buộc)</Label>
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
            <Label htmlFor="excerpt">Mô tả ngắn</Label>
            <Input id="excerpt" {...register("excerpt")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="coverImage">Ảnh bìa (URL)</Label>
            <Input id="coverImage" placeholder="https://..." {...register("coverImage")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea id="content" rows={8} {...register("content")} />
            {errors.content && (
              <p className="text-xs text-destructive">{errors.content.message}</p>
            )}
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
