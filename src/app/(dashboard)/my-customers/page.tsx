"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useListMyCustomersQuery } from "@/features/customer/api/customer.api";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

function formatPrice(price: string) {
  return `${Number(price).toLocaleString("vi-VN")} VND`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("vi-VN");
}

export default function MyCustomersPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useListMyCustomersQuery(user?.providerType);

  useEffect(() => {
    if (
      user &&
      (!user.providerId || user.orgRole === "FINANCE_STAFF" || !user.orgRole)
    ) {
      router.replace("/my-properties");
    }
  }, [user, router]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((customer) => {
      const name = [customer.firstName, customer.lastName].filter(Boolean).join(" ");
      return (
        name.toLowerCase().includes(q) || customer.email.toLowerCase().includes(q)
      );
    });
  }, [data, search]);

  return (
    <>
      <Header title="Khách hàng" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
            <p className="font-semibold">Khách hàng đã từng đặt chỗ</p>
            <Input
              className="h-8 w-56"
              placeholder="Tìm theo tên/email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách khách hàng. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có khách hàng nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Số lần đặt</TableHead>
                  <TableHead>Tổng chi tiêu</TableHead>
                  <TableHead>Lần đặt gần nhất</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((customer) => (
                  <TableRow key={customer.userId}>
                    <TableCell>
                      <p className="font-medium">
                        {[customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
                          customer.email}
                      </p>
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.totalBookings}
                    </TableCell>
                    <TableCell className="font-medium text-primary">
                      {formatPrice(customer.totalSpent)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(customer.lastBookingAt)}
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
