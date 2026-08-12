"use client";

import {
  BookOpen,
  Heart,
  MapPin,
  MessageSquareText,
  Newspaper,
  Route,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import { useGetReportOverviewQuery } from "@/features/report/api/report.api";
import { StatCard } from "@/modules/dashboard/components/stat-card";
import { Header } from "@/shared/components/header";

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
      </main>
    </>
  );
}
