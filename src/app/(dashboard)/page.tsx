"use client";

import { CircleDollarSign, Percent, Receipt, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetReportAnalyticsQuery } from "@/features/report/api/report.api";
import { PlatformRevenueChart } from "@/modules/dashboard/components/platform-revenue-chart";
import { PopularDestinationsCard } from "@/modules/dashboard/components/popular-destinations-card";
import { StatCard } from "@/modules/dashboard/components/stat-card";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getProviderHomePath } from "@/shared/utils/provider-routes";
import { GUIDE_HOME_PATH } from "@/shared/utils/guide-routes";

function formatPrice(price: string) {
  return `${Number(price).toLocaleString("vi-VN")} VND`;
}

export default function DashboardPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useGetReportAnalyticsQuery();

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace(user.providerId ? getProviderHomePath(user.providerType) : user.guideId ? GUIDE_HOME_PATH : "/my-properties");
    }
  }, [user, router]);

  return (
    <>
      <Header title="Dashboard" />

      <main className="p-6">
        {isError ? (
          <p className="text-sm text-destructive">
            Không tải được số liệu tổng quan. Kiểm tra Backend/kết nối MySQL.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={CircleDollarSign}
              label="Doanh thu"
              value={isLoading ? "..." : formatPrice(data?.revenue.total ?? "0")}
            />
            <StatCard
              icon={Receipt}
              label="Đơn đặt chỗ"
              value={isLoading ? "..." : (data?.bookings.total ?? 0)}
            />
            <StatCard
              icon={Store}
              label="Đối tác đã duyệt"
              value={isLoading ? "..." : (data?.providers.approved ?? 0)}
              caption={
                isLoading ? undefined : `${data?.providers.pending ?? 0} đang chờ duyệt`
              }
            />
            <StatCard
              icon={Percent}
              label="Tỷ lệ chuyển đổi"
              value={isLoading ? "..." : `${(data?.conversion.rate ?? 0).toFixed(1)}%`}
              caption="Xem sản phẩm → đặt chỗ, 30 ngày"
            />
          </div>
        )}

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {!isLoading && data && <PlatformRevenueChart data={data.revenue.last30d} />}
          </div>
          <PopularDestinationsCard />
        </div>
      </main>
    </>
  );
}
