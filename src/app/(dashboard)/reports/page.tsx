"use client";

import {
  BookOpen,
  CalendarCheck,
  CircleDollarSign,
  Heart,
  MapPin,
  MessageSquareText,
  Newspaper,
  Percent,
  Route,
  ShieldCheck,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGenerateReportMutation,
  useGetReportOverviewQuery,
  useListGeneratedReportsQuery,
} from "@/features/report/api/report.api";
import type {
  GeneratedReport,
  GeneratedReportStatus,
} from "@/features/report/types/report.types";
import { StatCard } from "@/modules/dashboard/components/stat-card";
import { Header } from "@/shared/components/header";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<GeneratedReportStatus, string> = {
  PENDING: "bg-[#FFF3E0] text-[#B7791F] dark:bg-[#3A2A0F] dark:text-[#F5B94D]",
  COMPLETED: "bg-[#E6F7EC] text-[#16A34A] dark:bg-[#122B1B] dark:text-[#4ADE80]",
  FAILED: "bg-[#FDE9E9] text-[#DC2626] dark:bg-[#3A1518] dark:text-[#F87171]",
};

const STATUS_LABELS: Record<GeneratedReportStatus, string> = {
  PENDING: "Đang xử lý",
  COMPLETED: "Hoàn tất",
  FAILED: "Lỗi",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("vi-VN");
}

function GeneratedReportsSection() {
  const [viewing, setViewing] = useState<GeneratedReport | null>(null);
  const [generateReport, { isLoading: isGenerating }] = useGenerateReportMutation();
  // Poll nhẹ 5s trong lúc trang mở — report thường tạo xong dưới 1s, không cần logic bật/tắt
  // poll động theo trạng thái PENDING (over-engineer cho 1 trang Admin ít truy cập).
  const { data, isLoading, isError } = useListGeneratedReportsQuery(
    { limit: 20 },
    { pollingInterval: 5000 },
  );

  return (
    <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-border p-4">
        <p className="font-semibold">Báo cáo định kỳ</p>
        <Button
          size="sm"
          className="rounded-full"
          disabled={isGenerating}
          onClick={() => generateReport()}
        >
          {isGenerating ? "Đang tạo..." : "Tạo báo cáo mới"}
        </Button>
      </div>

      {isLoading ? (
        <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
      ) : isError ? (
        <p className="p-6 text-sm text-destructive">Không tải được danh sách báo cáo.</p>
      ) : !data || data.items.length === 0 ? (
        <div className="flex flex-col items-center gap-1 p-10 text-center">
          <p className="text-sm font-medium">Chưa có báo cáo nào</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời gian tạo</TableHead>
              <TableHead>Thời gian hoàn tất</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <Badge className={cn("rounded-full", STATUS_STYLES[report.status])}>
                    {STATUS_LABELS[report.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(report.createdAt)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {report.completedAt ? formatDate(report.completedAt) : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    disabled={report.status !== "COMPLETED"}
                    onClick={() => setViewing(report)}
                  >
                    Xem
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Báo cáo {viewing ? formatDate(viewing.createdAt) : ""}
            </DialogTitle>
          </DialogHeader>
          {viewing?.data && (
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard
                icon={CircleDollarSign}
                label="Doanh thu Platform"
                value={`${Number(viewing.data.revenue.total).toLocaleString("vi-VN")} VND`}
              />
              <StatCard
                icon={CalendarCheck}
                label="Tổng đơn đặt chỗ"
                value={viewing.data.bookings.total}
              />
              <StatCard
                icon={ShieldCheck}
                label="Đối tác đã duyệt"
                value={viewing.data.providers.approved}
              />
              <StatCard
                icon={Percent}
                label="Tỷ lệ chuyển đổi"
                value={`${viewing.data.conversion.rate.toFixed(1)}%`}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ReportsPage() {
  const { data, isLoading, isError } = useGetReportOverviewQuery();

  return (
    <>
      <Header title="Báo cáo" />

      <main className="p-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        ) : isError || !data ? (
          <p className="text-sm text-destructive">
            Không tải được báo cáo. Kiểm tra Backend/kết nối MySQL.
          </p>
        ) : (
          <>
            <p className="text-sm font-medium text-muted-foreground">Người dùng</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Users} label="Tổng người dùng" value={data.users.total} />
              <StatCard
                icon={UserCheck}
                label="Đang hoạt động"
                value={data.users.active}
                caption={`${data.users.inactive} ngừng hoạt động · ${data.users.banned} bị cấm`}
              />
              <StatCard icon={Users} label="Quản trị viên" value={data.users.admins} />
              <StatCard icon={Heart} label="Lượt yêu thích" value={data.wishlistItems} />
            </div>

            <p className="mt-6 text-sm font-medium text-muted-foreground">Nội dung</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={MapPin} label="Điểm đến" value={data.destinations} />
              <StatCard icon={BookOpen} label="Cẩm nang" value={data.travelGuides} />
              <StatCard icon={Newspaper} label="Bài viết Blog" value={data.blogPosts} />
              <StatCard icon={Route} label="Lịch trình" value={data.trips} />
            </div>

            <p className="mt-6 text-sm font-medium text-muted-foreground">Đánh giá</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={MessageSquareText} label="Tổng đánh giá" value={data.reviews.total} />
              <StatCard
                icon={Star}
                label="Điểm trung bình"
                value={data.reviews.averageRating.toFixed(1)}
              />
            </div>

            <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-card">
              <div className="border-b border-border p-4">
                <p className="font-semibold">Top điểm đến được yêu thích nhất</p>
              </div>
              {data.topDestinationsByWishlist.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">Chưa có dữ liệu.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {data.topDestinationsByWishlist.map((row, index) => (
                    <li
                      key={row.destination?.id ?? index}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium">{row.destination?.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {row.wishlistCount} lượt lưu
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        <GeneratedReportsSection />
      </main>
    </>
  );
}
