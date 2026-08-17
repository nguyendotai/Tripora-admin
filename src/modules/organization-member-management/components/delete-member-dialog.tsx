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
import { useRemoveOrganizationMemberMutation } from "@/features/organization-member/api/organization-member.api";
import type { OrganizationMember } from "@/features/organization-member/types/organization-member.types";

export function DeleteMemberDialog({
  open,
  onOpenChange,
  member,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: OrganizationMember | null;
}) {
  const [removeMember, { isLoading }] = useRemoveOrganizationMemberMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!member) return;
    setErrorMessage(null);
    try {
      await removeMember(member.id).unwrap();
      onOpenChange(false);
    } catch (error) {
      const message =
        error && typeof error === "object" && "data" in error
          ? ((error.data as { message?: string })?.message ?? null)
          : null;
      setErrorMessage(message ?? "Xoá thành viên thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setErrorMessage(null);
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xoá thành viên</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn gỡ{" "}
          <span className="font-medium text-foreground">{member?.user.email}</span> khỏi tổ
          chức? Người này sẽ mất toàn bộ quyền quản lý ngay lập tức.
        </p>

        {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

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
