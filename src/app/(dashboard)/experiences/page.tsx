"use client";

import { ShieldCheck } from "lucide-react";
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
import { useListExperiencesForModerationQuery } from "@/features/experience/api/experience.api";
import type { Experience, ExperienceStatus } from "@/features/experience/types/experience.types";
import { ReviewExperienceDialog } from "@/modules/experience-management/components/review-experience-dialog";
import { ExperienceStatusBadge } from "@/modules/experience-management/components/experience-status-badge";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getProviderHomePath } from "@/shared/utils/provider-routes";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; value: ExperienceStatus | undefined }[] = [
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đã duyệt", value: "APPROVED" },
  { label: "Đã từ chối", value: "REJECTED" },
  { label: "Tất cả", value: undefined },
];

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

export default function ExperiencesManagementPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [status, setStatus] = useState<ExperienceStatus | undefined>("PENDING");
  const { data, isLoading, isError } = useListExperiencesForModerationQuery({ status, limit: 50 });
  const [reviewing, setReviewing] = useState<Experience | null>(null);

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace(getProviderHomePath(user.providerType));
    }
  }, [user, router]);

  return (
    <>
      <Header title="Experience" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border p-4">
            <p className="font-semibold">Duyệt experience</p>
            <div className="flex gap-1.5">
              {FILTERS.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => setStatus(filter.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    status === filter.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách experience. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Không có experience nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên experience</TableHead>
                  <TableHead>Đối tác</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((experience) => (
                  <TableRow key={experience.id}>
                    <TableCell className="font-medium">{experience.title}</TableCell>
                    <TableCell className="text-muted-foreground">{experience.provider?.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatPrice(experience.price, experience.currency)}
                    </TableCell>
                    <TableCell>
                      <ExperienceStatusBadge status={experience.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setReviewing(experience)}
                      >
                        <ShieldCheck className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <ReviewExperienceDialog
        open={!!reviewing}
        onOpenChange={(open) => !open && setReviewing(null)}
        experience={reviewing}
      />
    </>
  );
}
