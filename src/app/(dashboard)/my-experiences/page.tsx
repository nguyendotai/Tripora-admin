"use client";

import { CalendarRange, Pencil, Plus, Trash2 } from "lucide-react";
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
import { useListMyExperiencesQuery } from "@/features/experience/api/experience.api";
import type { Experience } from "@/features/experience/types/experience.types";
import { DeleteExperienceDialog } from "@/modules/experience-management/components/delete-experience-dialog";
import { ExperienceFormDialog } from "@/modules/experience-management/components/experience-form-dialog";
import { ExperienceScheduleDialog } from "@/modules/experience-management/components/experience-schedule-dialog";
import { ExperienceStatusBadge } from "@/modules/experience-management/components/experience-status-badge";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getProviderHomePath } from "@/shared/utils/provider-routes";

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

export default function MyExperiencesPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useListMyExperiencesQuery();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [deleting, setDeleting] = useState<Experience | null>(null);
  const [scheduleExperience, setScheduleExperience] = useState<Experience | null>(null);

  // V7 vòng 2: Booking/Finance Staff xem được (API cho phép), nhưng không quản lý được (403 nếu
  // gọi) — ẩn nút cho gọn, không phải lớp bảo mật thật (Backend đã chặn).
  const canManage = !user?.orgRole || user.orgRole === "OWNER" || user.orgRole === "MANAGER";

  useEffect(() => {
    if (user && (!user.providerId || user.providerType !== "ACTIVITY")) {
      router.replace(user.providerId ? getProviderHomePath(user.providerType) : "/");
    }
  }, [user, router]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (experience: Experience) => {
    setEditing(experience);
    setFormOpen(true);
  };

  return (
    <>
      <Header title="Experience của tôi" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Danh sách experience</p>
            {canManage && (
              <Button size="sm" className="rounded-full" onClick={openCreate}>
                <Plus className="mr-1.5 h-4 w-4" /> Thêm experience
              </Button>
            )}
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách experience. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Bạn chưa có experience nào</p>
              <p className="text-xs text-muted-foreground">
                Bấm &quot;Thêm experience&quot; để tạo experience đầu tiên. Experience mới sẽ ở
                trạng thái chờ duyệt trước khi hiển thị công khai.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên experience</TableHead>
                  <TableHead>Thời lượng</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((experience) => (
                  <TableRow key={experience.id}>
                    <TableCell className="font-medium">{experience.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {experience.durationLabel ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatPrice(experience.price, experience.currency)}
                    </TableCell>
                    <TableCell>
                      <ExperienceStatusBadge status={experience.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {canManage && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            title="Ngày khởi hành"
                            onClick={() => setScheduleExperience(experience)}
                          >
                            <CalendarRange className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => openEdit(experience)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-destructive hover:text-destructive"
                            onClick={() => setDeleting(experience)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <ExperienceFormDialog open={formOpen} onOpenChange={setFormOpen} experience={editing} />
      <DeleteExperienceDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        experience={deleting}
      />
      <ExperienceScheduleDialog
        open={!!scheduleExperience}
        onOpenChange={(open) => !open && setScheduleExperience(null)}
        experience={scheduleExperience}
      />
    </>
  );
}
