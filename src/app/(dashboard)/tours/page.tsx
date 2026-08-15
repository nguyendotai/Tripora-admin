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
import { useListToursForModerationQuery } from "@/features/tour/api/tour.api";
import type { Tour, TourStatus } from "@/features/tour/types/tour.types";
import { ReviewTourDialog } from "@/modules/tour-management/components/review-tour-dialog";
import { TourStatusBadge } from "@/modules/tour-management/components/tour-status-badge";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; value: TourStatus | undefined }[] = [
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đã duyệt", value: "APPROVED" },
  { label: "Đã từ chối", value: "REJECTED" },
  { label: "Tất cả", value: undefined },
];

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

export default function ToursManagementPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [status, setStatus] = useState<TourStatus | undefined>("PENDING");
  const { data, isLoading, isError } = useListToursForModerationQuery({ status, limit: 50 });
  const [reviewing, setReviewing] = useState<Tour | null>(null);

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace(user.providerType === "TOUR" ? "/my-tours" : "/my-properties");
    }
  }, [user, router]);

  return (
    <>
      <Header title="Tour" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border p-4">
            <p className="font-semibold">Duyệt tour</p>
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
              Không tải được danh sách tour. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Không có tour nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên tour</TableHead>
                  <TableHead>Đối tác</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((tour) => (
                  <TableRow key={tour.id}>
                    <TableCell className="font-medium">{tour.title}</TableCell>
                    <TableCell className="text-muted-foreground">{tour.provider?.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatPrice(tour.price, tour.currency)}
                    </TableCell>
                    <TableCell>
                      <TourStatusBadge status={tour.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setReviewing(tour)}
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

      <ReviewTourDialog
        open={!!reviewing}
        onOpenChange={(open) => !open && setReviewing(null)}
        tour={reviewing}
      />
    </>
  );
}
