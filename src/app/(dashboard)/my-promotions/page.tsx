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
import { useListMyPromotionsQuery } from "@/features/promotion/api/promotion.api";
import type { Promotion } from "@/features/promotion/types/promotion.types";
import { DeletePromotionDialog } from "@/modules/promotion-management/components/delete-promotion-dialog";
import { PromotionFormDialog } from "@/modules/promotion-management/components/promotion-form-dialog";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

function formatDiscount(promotion: Promotion) {
  return promotion.discountType === "PERCENT"
    ? `${Number(promotion.discountValue)}%`
    : `${Number(promotion.discountValue).toLocaleString("vi-VN")} VND`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN");
}

export default function MyPromotionsPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useListMyPromotionsQuery({ limit: 100 });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [deleting, setDeleting] = useState<Promotion | null>(null);

  useEffect(() => {
    if (
      user &&
      (!user.providerId || (user.orgRole !== "OWNER" && user.orgRole !== "MANAGER"))
    ) {
      router.replace("/my-properties");
    }
  }, [user, router]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (promotion: Promotion) => {
    setEditing(promotion);
    setFormOpen(true);
  };

  return (
    <>
      <Header title="Khuyến mãi của tôi" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Chương trình khuyến mãi tự động cho sản phẩm của bạn</p>
            <Button size="sm" className="rounded-full" onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" /> Thêm khuyến mãi
            </Button>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách khuyến mãi. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có chương trình khuyến mãi nào</p>
              <p className="text-xs text-muted-foreground">
                Khuyến mãi tự động áp dụng cho khách không nhập mã, khi đặt đúng sản phẩm của bạn.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên chương trình</TableHead>
                  <TableHead>Giảm giá</TableHead>
                  <TableHead>Ưu tiên</TableHead>
                  <TableHead>Hiệu lực</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell className="font-medium">{promotion.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDiscount(promotion)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{promotion.priority}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(promotion.validFrom)} — {formatDate(promotion.validUntil)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={promotion.status === "ACTIVE" ? "default" : "secondary"}>
                        {promotion.status === "ACTIVE" ? "Đang hoạt động" : "Ngừng hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => openEdit(promotion)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-destructive hover:text-destructive"
                        onClick={() => setDeleting(promotion)}
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

      <PromotionFormDialog open={formOpen} onOpenChange={setFormOpen} promotion={editing} mine />
      <DeletePromotionDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        promotion={deleting}
        mine
      />
    </>
  );
}
