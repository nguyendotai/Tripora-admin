"use client";

import { useListPopularDestinationsQuery } from "@/features/destination/api/destination.api";

/** V9 vong 4 — thay the RecentUsersCard (truoc chi hien empty-state tinh, chua tung goi API).
 * Tai dung thang GET /destinations/popular da co san (theo wishlist, dung cho Home tu V8) thay
 * vi viet query moi gop booking-count tu 5 domain. */
export function PopularDestinationsCard() {
  const { data, isLoading, isError } = useListPopularDestinationsQuery({ limit: 5 });

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
      <p className="font-semibold">Điểm đến nổi bật</p>

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Đang tải...</p>
      ) : isError || !data ? (
        <p className="mt-6 text-sm text-destructive">Không tải được dữ liệu.</p>
      ) : data.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Chưa có dữ liệu.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {data.map((destination, index) => (
            <li key={destination.id} className="flex items-center gap-3 py-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {index + 1}
              </span>
              <span className="text-sm font-medium">{destination.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
