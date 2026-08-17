"use client";

import { Pencil, Trash2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListOrganizationMembersQuery } from "@/features/organization-member/api/organization-member.api";
import type { OrganizationMember } from "@/features/organization-member/types/organization-member.types";
import { DeleteMemberDialog } from "@/modules/organization-member-management/components/delete-member-dialog";
import { MemberFormDialog } from "@/modules/organization-member-management/components/member-form-dialog";
import { MemberRoleBadge } from "@/modules/organization-member-management/components/member-role-badge";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function OrganizationMembersPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useListOrganizationMembersQuery();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<OrganizationMember | null>(null);
  const [deleting, setDeleting] = useState<OrganizationMember | null>(null);

  const canManage = user?.orgRole === "OWNER" || user?.orgRole === "MANAGER";
  const isOwner = user?.orgRole === "OWNER";

  useEffect(() => {
    if (user && !user.providerId) {
      router.replace("/");
    }
  }, [user, router]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (member: OrganizationMember) => {
    setEditing(member);
    setFormOpen(true);
  };

  return (
    <>
      <Header title="Thành viên tổ chức" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Danh sách thành viên</p>
            {canManage && (
              <Button size="sm" className="rounded-full" onClick={openCreate}>
                <UserPlus className="mr-1.5 h-4 w-4" /> Mời thành viên
              </Button>
            )}
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách thành viên. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có thành viên nào</p>
              <p className="text-xs text-muted-foreground">
                Bấm &quot;Mời thành viên&quot; và nhập email tài khoản Tripora họ đã đăng ký.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tài khoản</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Tham gia</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <p className="font-medium">
                        {[member.user.firstName, member.user.lastName].filter(Boolean).join(" ") ||
                          member.user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">{member.user.email}</p>
                    </TableCell>
                    <TableCell>
                      <MemberRoleBadge role={member.role} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(member.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {isOwner && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          title="Đổi vai trò"
                          onClick={() => openEdit(member)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {canManage && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full text-destructive hover:text-destructive"
                          onClick={() => setDeleting(member)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <MemberFormDialog open={formOpen} onOpenChange={setFormOpen} member={editing} />
      <DeleteMemberDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        member={deleting}
      />
    </>
  );
}
