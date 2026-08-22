"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import type { RevenueDayPoint } from "@/features/report/types/report.types";

function formatAxisDate(value: string) {
  const [, month, day] = value.split("-");
  return `${day}/${month}`;
}

function formatTooltipDate(label: ReactNode) {
  if (typeof label !== "string") return label;
  return new Date(`${label}T00:00:00.000Z`).toLocaleDateString("vi-VN");
}

function formatPrice(price: number) {
  return `${price.toLocaleString("vi-VN")} VND`;
}

/** V9 vong 4 — mirror dung RevenueChart cua Provider (my-overview), doi nguon du lieu sang
 * GET /reports/analytics (revenue.last30d, tinh tren platformAmount toan san). */
export function PlatformRevenueChart({ data }: { data: RevenueDayPoint[] }) {
  const chartData = data.map((point) => ({
    ...point,
    totalRevenue: Number(point.totalRevenue),
  }));

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">Doanh thu toàn sàn theo ngày</p>
          <p className="text-xs text-muted-foreground">30 ngày gần nhất</p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          30 ngày
        </span>
      </div>

      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ left: -20, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="platformRevenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tickFormatter={formatAxisDate}
              axisLine={false}
              tickLine={false}
              fontSize={12}
              stroke="var(--muted-foreground)"
              interval={4}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelFormatter={formatTooltipDate}
              formatter={(value) => [formatPrice(Number(value)), "Doanh thu"]}
            />
            <Area
              type="monotone"
              dataKey="totalRevenue"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#platformRevenueFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
