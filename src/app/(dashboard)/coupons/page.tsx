"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListCouponsQuery } from "@/features/coupon/api/coupon.api";
import type { Coupon } from "@/features/coupon/types/coupon.types";
import { CouponFormDialog } from "@/modules/coupon-management/components/coupon-form-dialog";
import { DeleteCouponDialog } from "@/modules/coupon-management/components/delete-coupon-dialog";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getProviderHomePath } from "@/shared/utils/provider-routes";

function formatDiscount(coupon: Coupon) {
  return coupon.discountType === "PERCENT"
    ? `${Number(coupon.discountValue)}%`
    : `${Number(coupon.discountValue).toLocaleString("vi-VN")} VND`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN");
}

export default function CouponsManagementPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useListCouponsQuery({ limit: 100 });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState<Coupon | null>(null);

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace(getProviderHomePath(user.providerType));
    }
  }, [user, router]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    setFormOpen(true);
  };

  return (
    <>
      <Header title="Mã giảm giá" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Danh sách mã giảm giá</p>
            <Button size="sm" className="rounded-full" onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" /> Thêm mã
            </Button>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách mã giảm giá. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có mã giảm giá nào</p>
              <p className="text-xs text-muted-foreground">
                Bấm &quot;Thêm mã&quot; để tạo mã giảm giá khách hàng có thể nhập lúc đặt chỗ.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Giảm giá</TableHead>
                  <TableHead>Lượt dùng</TableHead>
                  <TableHead>Hiệu lực</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-medium">{coupon.code}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDiscount(coupon)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {coupon.usedCount}
                      {coupon.usageLimit != null ? ` / ${coupon.usageLimit}` : ""}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(coupon.validFrom)} — {formatDate(coupon.validUntil)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={coupon.status === "ACTIVE" ? "default" : "secondary"}>
                        {coupon.status === "ACTIVE" ? "Đang hoạt động" : "Ngừng hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => openEdit(coupon)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-destructive hover:text-destructive"
                        onClick={() => setDeleting(coupon)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <CouponFormDialog open={formOpen} onOpenChange={setFormOpen} coupon={editing} />
      <DeleteCouponDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        coupon={deleting}
      />
    </>
  );
}
