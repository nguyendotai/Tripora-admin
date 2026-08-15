"use client";

import { Pencil, Power, Trash2, UserPlus } from "lucide-react";
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
import { useListMyGuidesQuery, useUpdateGuideMutation } from "@/features/tour-guide/api/tour-guide.api";
import type { TourGuide } from "@/features/tour-guide/types/tour-guide.types";
import { DeleteGuideDialog } from "@/modules/tour-guide-management/components/delete-guide-dialog";
import { GuideFormDialog } from "@/modules/tour-guide-management/components/guide-form-dialog";
import { TourGuideStatusBadge } from "@/modules/tour-guide-management/components/tour-guide-status-badge";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getProviderHomePath } from "@/shared/utils/provider-routes";

export default function MyGuidesPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useListMyGuidesQuery();
  const [updateGuide] = useUpdateGuideMutation();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TourGuide | null>(null);
  const [deleting, setDeleting] = useState<TourGuide | null>(null);

  useEffect(() => {
    if (user && (!user.providerId || user.providerType !== "TOUR")) {
      router.replace(user.providerId ? getProviderHomePath(user.providerType) : "/");
    }
  }, [user, router]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (guide: TourGuide) => {
    setEditing(guide);
    setFormOpen(true);
  };

  const toggleStatus = (guide: TourGuide) => {
    updateGuide({
      id: guide.id,
      data: { status: guide.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" },
    });
  };

  return (
    <>
      <Header title="Hướng dẫn viên" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Danh sách hướng dẫn viên</p>
            <Button size="sm" className="rounded-full" onClick={openCreate}>
              <UserPlus className="mr-1.5 h-4 w-4" /> Thêm hướng dẫn viên
            </Button>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách hướng dẫn viên. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Bạn chưa có hướng dẫn viên nào</p>
              <p className="text-xs text-muted-foreground">
                Bấm &quot;Thêm hướng dẫn viên&quot; và nhập email tài khoản Tripora họ đã đăng ký.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tài khoản</TableHead>
                  <TableHead>SĐT</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((guide) => (
                  <TableRow key={guide.id}>
                    <TableCell>
                      <p className="font-medium">
                        {[guide.user.firstName, guide.user.lastName].filter(Boolean).join(" ") ||
                          guide.user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">{guide.user.email}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{guide.phone ?? "—"}</TableCell>
                    <TableCell>
                      <TourGuideStatusBadge status={guide.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        title={guide.status === "ACTIVE" ? "Tạm ngừng" : "Kích hoạt lại"}
                        onClick={() => toggleStatus(guide)}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => openEdit(guide)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-destructive hover:text-destructive"
                        onClick={() => setDeleting(guide)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <GuideFormDialog open={formOpen} onOpenChange={setFormOpen} guide={editing} />
      <DeleteGuideDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        guide={deleting}
      />
    </>
  );
}
