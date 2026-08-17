"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useListCommissionsQuery } from "@/features/commission/api/commission.api";
import type { BookingDomain } from "@/features/payment/types/payment.types";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

const DOMAIN_LABELS: Record<BookingDomain, string> = {
  HOTEL: "Khách sạn",
  TOUR: "Tour",
  EXPERIENCE: "Trải nghiệm",
  TRANSPORT: "Vận chuyển",
  FLIGHT: "Chuyến bay",
};

function formatPrice(price: string) {
  return `${Number(price).toLocaleString("vi-VN")} VND`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("vi-VN");
}

export default function CommissionsPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [providerId, setProviderId] = useState("");
  const { data, isLoading, isError } = useListCommissionsQuery({
    providerId: providerId || undefined,
    limit: 50,
  });

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace("/my-properties");
    }
  }, [user, router]);

  return (
    <>
      <Header title="Hoa hồng" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
            <p className="font-semibold">Hoa hồng theo từng Provider</p>
            <div className="flex items-center gap-2">
              <Label htmlFor="providerId" className="text-xs text-muted-foreground">
                Lọc theo Provider ID
              </Label>
              <Input
                id="providerId"
                className="h-8 w-28"
                placeholder="VD: 12"
                value={providerId}
                onChange={(event) => setProviderId(event.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách hoa hồng. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có hoa hồng nào</p>
              <p className="text-xs text-muted-foreground">
                Hoa hồng tự sinh 1 dòng cho mỗi Payment thanh toán thành công.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Đặt chỗ</TableHead>
                  <TableHead>Doanh thu</TableHead>
                  <TableHead>Tỉ lệ</TableHead>
                  <TableHead>Platform nhận</TableHead>
                  <TableHead>Provider nhận</TableHead>
                  <TableHead>Thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell>
                      <p className="font-medium">{commission.provider.name}</p>
                      <p className="text-xs text-muted-foreground">#{commission.providerId}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {DOMAIN_LABELS[commission.bookingDomain]} #{commission.bookingId}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatPrice(commission.grossAmount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {(Number(commission.rate) * 100).toFixed(0)}%
                    </TableCell>
                    <TableCell className="font-medium text-primary">
                      {formatPrice(commission.platformAmount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatPrice(commission.providerAmount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(commission.createdAt)}
                    </TableCell>
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
