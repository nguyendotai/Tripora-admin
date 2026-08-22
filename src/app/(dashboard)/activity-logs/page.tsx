"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListActivityLogsQuery } from "@/features/activity-log/api/activity-log.api";
import type { ActivityLog } from "@/features/activity-log/types/activity-log.types";
import { Header } from "@/shared/components/header";

function actorName(actor: ActivityLog["actor"]) {
  if (!actor) return "—";
  const name = [actor.firstName, actor.lastName].filter(Boolean).join(" ");
  return name || actor.email;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("vi-VN");
}

export default function ActivityLogsPage() {
  const { data, isLoading, isError } = useListActivityLogsQuery({ limit: 50 });

  return (
    <>
      <Header title="Nhật ký hoạt động" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="border-b border-border p-4">
            <p className="font-semibold">Audit log các thao tác nhạy cảm</p>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được nhật ký hoạt động. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có nhật ký nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Người thực hiện</TableHead>
                  <TableHead>Hành động</TableHead>
                  <TableHead>Đối tượng</TableHead>
                  <TableHead>Lý do</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(log.createdAt)}
                    </TableCell>
                    <TableCell className="font-medium">{actorName(log.actor)}</TableCell>
                    <TableCell className="text-muted-foreground">{log.action}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.entityType} #{log.entityId}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{log.reason ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </>
  );
}
