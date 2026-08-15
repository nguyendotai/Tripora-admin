"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2 } from "lucide-react";
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
import {
  useCreateTourItineraryMutation,
  useDeleteTourItineraryMutation,
  useListMyTourItineraryQuery,
  useUpdateTourItineraryMutation,
} from "@/features/tour-itinerary/api/tour-itinerary.api";
import type { TourItinerary } from "@/features/tour-itinerary/types/tour-itinerary.types";
import type { Tour } from "@/features/tour/types/tour.types";

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề ngày"),
  activities: z.string().optional(),
  meals: z.string().optional(),
  locations: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EMPTY_VALUES: FormValues = { title: "", activities: "", meals: "", locations: "" };

function ItineraryRow({
  day,
  tourId,
  onEdit,
}: {
  day: TourItinerary;
  tourId: string;
  onEdit: (day: TourItinerary) => void;
}) {
  const [deleteTourItinerary, { isLoading }] = useDeleteTourItineraryMutation();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="rounded-[var(--radius-md)] border border-border p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Ngày {day.dayNumber}</p>
          <p className="font-medium">{day.title}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {confirming ? (
            <>
              <span className="text-xs text-muted-foreground">Xoá?</span>
              <Button
                type="button"
                variant="destructive"
                size="xs"
                className="rounded-full"
                disabled={isLoading}
                onClick={() => deleteTourItinerary({ id: day.id, tourId })}
              >
                {isLoading ? "..." : "Xoá"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                className="rounded-full"
                onClick={() => setConfirming(false)}
              >
                Không
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                onClick={() => onEdit(day)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full text-destructive hover:text-destructive"
                onClick={() => setConfirming(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>
      <dl className="mt-2 grid grid-cols-3 gap-3 text-xs">
        <div>
          <dt className="text-muted-foreground">Hoạt động</dt>
          <dd>{day.activities || "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Bữa ăn</dt>
          <dd>{day.meals || "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Địa điểm</dt>
          <dd>{day.locations || "—"}</dd>
        </div>
      </dl>
    </div>
  );
}

export function TourItineraryDialog({
  open,
  onOpenChange,
  tour,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tour: Tour | null;
}) {
  const tourId = tour?.id ?? "";
  const { data: days, isLoading, isError } = useListMyTourItineraryQuery(tourId, { skip: !open || !tour });
  const [createTourItinerary, { isLoading: isCreating }] = useCreateTourItineraryMutation();
  const [updateTourItinerary, { isLoading: isUpdating }] = useUpdateTourItineraryMutation();
  const [editing, setEditing] = useState<TourItinerary | null>(null);
  const isSaving = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (open) {
      setEditing(null);
      reset(EMPTY_VALUES);
    }
  }, [open, reset]);

  const startEdit = (day: TourItinerary) => {
    setEditing(day);
    reset({
      title: day.title,
      activities: day.activities ?? "",
      meals: day.meals ?? "",
      locations: day.locations ?? "",
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    reset(EMPTY_VALUES);
  };

  const onSubmit = async (values: FormValues) => {
    const payload = {
      title: values.title,
      activities: values.activities || undefined,
      meals: values.meals || undefined,
      locations: values.locations || undefined,
    };

    if (editing) {
      await updateTourItinerary({ id: editing.id, tourId, data: payload }).unwrap();
    } else {
      await createTourItinerary({ tourId, ...payload }).unwrap();
    }
    setEditing(null);
    reset(EMPTY_VALUES);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[864px]">
        <DialogHeader>
          <DialogTitle>Lịch trình — {tour?.title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-[var(--radius-md)] border border-border p-4">
          <p className="text-sm font-medium">
            {editing ? `Sửa ngày ${editing.dayNumber}` : "Thêm ngày mới"}
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input id="title" placeholder="Đến Sapa, nhận phòng" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="activities">Hoạt động</Label>
              <Textarea id="activities" rows={2} {...register("activities")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="meals">Bữa ăn</Label>
              <Textarea id="meals" rows={2} placeholder="Sáng, trưa, tối" {...register("meals")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="locations">Địa điểm</Label>
              <Textarea id="locations" rows={2} {...register("locations")} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isSaving} className="rounded-full">
              {isSaving ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Thêm ngày"}
            </Button>
            {editing && (
              <Button type="button" size="sm" variant="ghost" className="rounded-full" onClick={cancelEdit}>
                Huỷ sửa
              </Button>
            )}
          </div>
        </form>

        <div className="space-y-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="text-sm text-destructive">Không tải được lịch trình.</p>
          ) : !days || days.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có ngày nào trong lịch trình.</p>
          ) : (
            days.map((day) => (
              <ItineraryRow key={day.id} day={day} tourId={tourId} onEdit={startEdit} />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
