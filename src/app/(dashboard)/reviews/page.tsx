"use client";

import { Star, Trash2 } from "lucide-react";
import { useState } from "react";
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
import { useListDestinationsQuery } from "@/features/destination/api/destination.api";
import { useListReviewsQuery } from "@/features/review/api/review.api";
import type { Review } from "@/features/review/types/review.types";
import { DeleteReviewDialog } from "@/modules/review-management/components/delete-review-dialog";
import { Header } from "@/shared/components/header";
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

function reviewerName(review: Review) {
  const name = [review.user?.firstName, review.user?.lastName].filter(Boolean).join(" ");
  return name || `User #${review.userId}`;
}

export default function ReviewsManagementPage() {
  const { data, isLoading, isError } = useListReviewsQuery({ limit: 50 });
  const { data: destinations } = useListDestinationsQuery({ limit: 100 });
  const [deleting, setDeleting] = useState<Review | null>(null);

  const destinationNameById = new Map(
    (destinations?.items ?? []).map((d) => [d.id, d.name]),
  );

  return (
    <>
      <Header title="Đánh giá" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Kiểm duyệt đánh giá</p>
            {data && (
              <Badge variant="secondary" className="rounded-full">
                {data.pagination.totalItems} đánh giá
              </Badge>
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
                Đánh giá từ Traveler sẽ xuất hiện ở đây để kiểm duyệt.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Điểm đến</TableHead>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">
                      {destinationNameById.get(review.destinationId) ?? `#${review.destinationId}`}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {reviewerName(review)}
                    </TableCell>
                    <TableCell>
                      <RatingStars rating={review.rating} />
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground" title={review.content ?? undefined}>
                      {review.content || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-destructive hover:text-destructive"
                        onClick={() => setDeleting(review)}
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

      <DeleteReviewDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        review={deleting}
      />
    </>
  );
}
