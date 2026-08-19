"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useDeleteMyPromotionMutation,
  useDeletePromotionMutation,
} from "@/features/promotion/api/promotion.api";
import type { Promotion } from "@/features/promotion/types/promotion.types";

export function DeletePromotionDialog({
  open,
  onOpenChange,
  promotion,
  mine = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promotion: Promotion | null;
  mine?: boolean;
}) {
  const [deletePromotion, { isLoading: isDeletingAdmin }] = useDeletePromotionMutation();
  const [deleteMyPromotion, { isLoading: isDeletingMine }] = useDeleteMyPromotionMutation();
  const isLoading = mine ? isDeletingMine : isDeletingAdmin;

  const handleConfirm = async () => {
    if (!promotion) return;
    if (mine) {
      await deleteMyPromotion(promotion.id).unwrap();
    } else {
      await deletePromotion(promotion.id).unwrap();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xoá khuyến mãi</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn xoá chương trình{" "}
          <span className="font-medium text-foreground">{promotion?.name}</span>?
        </p>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => onOpenChange(false)}
          >
            Huỷ
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoading}
            className="rounded-full"
            onClick={handleConfirm}
          >
            {isLoading ? "Đang xoá..." : "Xoá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
