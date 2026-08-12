"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useUpdateUserStatusMutation } from "@/features/user/api/user.api";
import type { User, UserStatus } from "@/features/user/types/user.types";

const STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: "ACTIVE", label: "Hoạt động" },
  { value: "INACTIVE", label: "Ngừng hoạt động" },
  { value: "BANNED", label: "Đã cấm" },
];

export function UpdateStatusDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}) {
  const [updateStatus, { isLoading }] = useUpdateUserStatusMutation();
  const [status, setStatus] = useState<UserStatus>(user?.status ?? "ACTIVE");

  const handleOpenChange = (next: boolean) => {
    if (next && user) setStatus(user.status);
    onOpenChange(next);
  };

  const handleConfirm = async () => {
    if (!user) return;
    await updateStatus({ id: user.id, status }).unwrap();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đổi trạng thái tài khoản</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Tài khoản{" "}
          <span className="font-medium text-foreground">{user?.email}</span>.
          Tài khoản bị <span className="font-medium">Đã cấm</span>/
          <span className="font-medium">Ngừng hoạt động</span> sẽ không thể đăng
          nhập.
        </p>

        <div className="space-y-1.5">
          <Label htmlFor="status">Trạng thái mới</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
          <Button
            type="button"
            variant={status === "BANNED" ? "destructive" : "default"}
            disabled={isLoading || status === user?.status}
            className="rounded-full"
            onClick={handleConfirm}
          >
            {isLoading ? "Đang lưu..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
