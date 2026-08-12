"use client";

import { ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListUsersQuery } from "@/features/user/api/user.api";
import type { User } from "@/features/user/types/user.types";
import { UpdateStatusDialog } from "@/modules/user-management/components/update-status-dialog";
import { UserStatusBadge } from "@/modules/user-management/components/user-status-badge";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

function userName(user: User) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return name || "—";
}

export default function UsersManagementPage() {
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const [q, setQ] = useState("");
  const { data, isLoading, isError } = useListUsersQuery({ q: q || undefined, limit: 50 });
  const [editing, setEditing] = useState<User | null>(null);

  return (
    <>
      <Header title="Users" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border p-4">
            <p className="font-semibold">Danh sách người dùng</p>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo email hoặc tên..."
              className="max-w-xs"
            />
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách người dùng. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Không tìm thấy người dùng nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell className="text-muted-foreground">{userName(user)}</TableCell>
                    <TableCell className="text-muted-foreground">{user.role}</TableCell>
                    <TableCell>
                      <UserStatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        disabled={user.id === currentUserId}
                        title={
                          user.id === currentUserId
                            ? "Không thể tự đổi trạng thái của chính mình"
                            : "Đổi trạng thái"
                        }
                        onClick={() => setEditing(user)}
                      >
                        <ShieldAlert className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <UpdateStatusDialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        user={editing}
      />
    </>
  );
}
