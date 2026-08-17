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
import {
  useCreateOrganizationMemberMutation,
  useUpdateOrganizationMemberRoleMutation,
} from "@/features/organization-member/api/organization-member.api";
import type {
  OrganizationMember,
  OrgMemberRole,
} from "@/features/organization-member/types/organization-member.types";

const ROLE_OPTIONS: { value: OrgMemberRole; label: string }[] = [
  { value: "OWNER", label: "Chủ sở hữu" },
  { value: "MANAGER", label: "Quản lý" },
  { value: "BOOKING_STAFF", label: "Nhân viên đặt chỗ" },
  { value: "FINANCE_STAFF", label: "Nhân viên tài chính" },
];

const formSchema = z.object({
  email: z.string().optional(),
  role: z.enum(["OWNER", "MANAGER", "BOOKING_STAFF", "FINANCE_STAFF"]),
});

type FormValues = z.infer<typeof formSchema>;

export function MemberFormDialog({
  open,
  onOpenChange,
  member,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: OrganizationMember | null;
}) {
  const isEdit = !!member;
  const [createMember, { isLoading: isCreating, error: createError }] =
    useCreateOrganizationMemberMutation();
  const [updateRole, { isLoading: isUpdating, error: updateError }] =
    useUpdateOrganizationMemberRoleMutation();
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (open) {
      reset({ email: member?.user.email ?? "", role: member?.role ?? "BOOKING_STAFF" });
    }
  }, [open, member, reset]);

  const error = createError ?? updateError;
  const errorMessage =
    error && typeof error === "object" && "data" in error
      ? ((error.data as { message?: string })?.message ?? null)
      : null;

  const onSubmit = async (values: FormValues) => {
    if (isEdit && member) {
      await updateRole({ id: member.id, role: values.role }).unwrap();
    } else {
      if (!values.email) {
        setError("email", { message: "Vui lòng nhập email" });
        return;
      }
      await createMember({ email: values.email, role: values.role }).unwrap();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Đổi vai trò thành viên" : "Mời thành viên"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email tài khoản Tripora</Label>
            <Input id="email" type="email" disabled={isEdit} {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            {!isEdit && (
              <p className="text-xs text-muted-foreground">
                Người này phải đã có tài khoản Tripora và chưa thuộc tổ chức nào khác.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role">Vai trò</Label>
            <select
              id="role"
              {...register("role")}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

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
            <Button type="submit" disabled={isLoading} className="rounded-full">
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
