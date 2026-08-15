"use client";

import { Users } from "lucide-react";
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
import { useListMyAssignedSchedulesQuery } from "@/features/tour-guide/api/tour-guide.api";
import type { GuideAssignedSchedule } from "@/features/tour-guide/types/tour-guide.types";
import { TravelersDialog } from "@/modules/tour-guide-management/components/travelers-dialog";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN");
}

export default function GuideSchedulePage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useListMyAssignedSchedulesQuery();
  const [viewing, setViewing] = useState<GuideAssignedSchedule | null>(null);

  useEffect(() => {
    if (user && !user.guideId) {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <>
      <Header title="Lịch dẫn tour của tôi" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Ngày khởi hành được phân công</p>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được lịch dẫn tour. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa được phân công dẫn tour nào</p>
              <p className="text-xs text-muted-foreground">
                Tour Operator sẽ phân công bạn cho 1 ngày khởi hành cụ thể.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tour</TableHead>
                  <TableHead>Ngày khởi hành</TableHead>
                  <TableHead>Số chỗ</TableHead>
                  <TableHead>Đã đặt</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.tour.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(row.departureDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.capacity}</TableCell>
                    <TableCell className="text-muted-foreground">{row.booked}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        title="Xem khách"
                        onClick={() => setViewing(row)}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <TravelersDialog
        open={!!viewing}
        onOpenChange={(open) => !open && setViewing(null)}
        schedule={viewing}
      />
    </>
  );
}
