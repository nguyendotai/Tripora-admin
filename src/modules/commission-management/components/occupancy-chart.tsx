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
import type { OccupancyDayPoint } from "@/features/occupancy/types/occupancy.types";

function formatAxisDate(value: string) {
  const [, month, day] = value.split("-");
  return `${day}/${month}`;
}

function formatTooltipDate(label: ReactNode) {
  if (typeof label !== "string") return label;
  return new Date(`${label}T00:00:00.000Z`).toLocaleDateString("vi-VN");
}

/** V9 vong 8 — GET /occupancy/mine, dispatch dung 1 trong 5 domain inventory theo Provider.type
 * (Room/Tour/Experience/Transport/Flight), quy ve cung 1 shape {date, capacity, booked, rate}. */
export function OccupancyChart({ data }: { data: OccupancyDayPoint[] }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">Tỷ lệ lấp đầy</p>
          <p className="text-xs text-muted-foreground">30 ngày gần nhất</p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          30 ngày
        </span>
      </div>

      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="occupancyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
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
              formatter={(value) => [`${Number(value).toFixed(1)}%`, "Lấp đầy"]}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="var(--chart-2)"
              strokeWidth={2}
              fill="url(#occupancyFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
