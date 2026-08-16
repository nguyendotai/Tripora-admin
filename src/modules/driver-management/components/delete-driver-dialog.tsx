"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteDriverMutation } from "@/features/driver/api/driver.api";
import type { Driver } from "@/features/driver/types/driver.types";

export function DeleteDriverDialog({
  open,
  onOpenChange,
  driver,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: Driver | null;
}) {
  const [deleteDriver, { isLoading }] = useDeleteDriverMutation();

  const handleConfirm = async () => {
    if (!driver) return;
    await deleteDriver(driver.id).unwrap();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xoá tài xế</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn xoá <span className="font-medium text-foreground">{driver?.name}</span> khỏi
          danh sách tài xế? Người này sẽ bị gỡ khỏi mọi đơn đặt xe đang được phân công.
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
