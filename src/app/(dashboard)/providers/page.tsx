"use client";

import { Lock, ShieldCheck, Unlock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListProvidersQuery } from "@/features/provider/api/provider.api";
import type { Provider, ProviderStatus } from "@/features/provider/types/provider.types";
import { ProviderStatusBadge } from "@/modules/provider-management/components/provider-status-badge";
import { ReviewProviderDialog } from "@/modules/provider-management/components/review-provider-dialog";
import { SuspendProviderDialog } from "@/modules/provider-management/components/suspend-provider-dialog";
import { Header } from "@/shared/components/header";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; value: ProviderStatus | undefined }[] = [
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đã duyệt", value: "APPROVED" },
  { label: "Đã từ chối", value: "REJECTED" },
  { label: "Đã khoá", value: "SUSPENDED" },
  { label: "Tất cả", value: undefined },
];

export default function ProvidersManagementPage() {
  const [status, setStatus] = useState<ProviderStatus | undefined>("PENDING");
  const { data, isLoading, isError } = useListProvidersQuery({ status, limit: 50 });
  const [reviewing, setReviewing] = useState<Provider | null>(null);
  const [suspending, setSuspending] = useState<Provider | null>(null);

  return (
    <>
      <Header title="Đối tác" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border p-4">
            <p className="font-semibold">Hồ sơ đối tác khách sạn</p>
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
              Không tải được danh sách đối tác. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Không có hồ sơ nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên doanh nghiệp</TableHead>
                  <TableHead>Người nộp</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell className="font-medium">{provider.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {provider.user?.email}
                    </TableCell>
                    <TableCell>
                      <ProviderStatusBadge status={provider.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {(provider.status === "PENDING" || provider.status === "REJECTED") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          title="Duyệt hồ sơ"
                          onClick={() => setReviewing(provider)}
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </Button>
                      )}
                      {(provider.status === "APPROVED" || provider.status === "SUSPENDED") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          title={provider.status === "APPROVED" ? "Khoá đối tác" : "Mở khoá đối tác"}
                          onClick={() => setSuspending(provider)}
                        >
                          {provider.status === "APPROVED" ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <ReviewProviderDialog
        open={!!reviewing}
        onOpenChange={(open) => !open && setReviewing(null)}
        provider={reviewing}
      />
      <SuspendProviderDialog
        open={!!suspending}
        onOpenChange={(open) => !open && setSuspending(null)}
        provider={suspending}
      />
    </>
  );
}
