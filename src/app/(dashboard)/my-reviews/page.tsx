"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListMyReviewsQuery } from "@/features/review/api/review.api";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { cn } from "@/lib/utils";

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-3.5 w-3.5",
            star <= rating ? "fill-current text-amber-500" : "text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}

function reviewerName(review: { user?: { firstName?: string | null; lastName?: string | null } }) {
  const name = [review.user?.firstName, review.user?.lastName].filter(Boolean).join(" ");
  return name || "Người dùng Tripora";
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("vi-VN");
}

export default function MyReviewsPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useListMyReviewsQuery({ limit: 50 });

  useEffect(() => {
    if (user && (!user.providerId || user.providerType !== "HOTEL")) {
      router.replace(user.providerId ? "/my-properties" : "/");
    }
  }, [user, router]);

  const averageRating = useMemo(() => {
    if (!data || data.items.length === 0) return 0;
    return data.items.reduce((sum, r) => sum + r.rating, 0) / data.items.length;
  }, [data]);

  return (
    <>
      <Header title="Đánh giá của tôi" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
            <p className="font-semibold">Đánh giá từ khách hàng</p>
            {data && data.items.length > 0 && (
              <div className="flex items-center gap-2">
                <RatingStars rating={Math.round(averageRating)} />
                <span className="text-sm text-muted-foreground">
                  {averageRating.toFixed(1)} ({data.items.length} đánh giá)
                </span>
              </div>
            )}
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách đánh giá. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có đánh giá nào</p>
              <p className="text-xs text-muted-foreground">
                Đánh giá từ khách hàng đã đặt phòng sẽ xuất hiện ở đây.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{reviewerName(review)}</TableCell>
                    <TableCell>
                      <RatingStars rating={review.rating} />
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground" title={review.content ?? undefined}>
                      {review.content || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(review.createdAt)}
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
