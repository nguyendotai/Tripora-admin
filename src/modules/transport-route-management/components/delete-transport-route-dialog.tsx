"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteTransportRouteMutation } from "@/features/transport-route/api/transport-route.api";
import type { TransportRoute } from "@/features/transport-route/types/transport-route.types";

export function DeleteTransportRouteDialog({
  open,
  onOpenChange,
  route,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route: TransportRoute | null;
}) {
  const [deleteRoute, { isLoading }] = useDeleteTransportRouteMutation();

  const handleConfirm = async () => {
    if (!route) return;
    await deleteRoute(route.id).unwrap();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xoá tuyến đường</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn xoá tuyến{" "}
          <span className="font-medium text-foreground">
            {route?.origin} → {route?.destination}
          </span>
          ?
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
