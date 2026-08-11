import { Users } from "lucide-react";
import Link from "next/link";

export function RecentUsersCard() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Người dùng mới</p>
        <Link
          href="/users"
          className="text-xs font-medium text-primary hover:underline"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-2 py-8 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Users className="h-5 w-5" />
        </span>
        <p className="text-sm font-medium">Chưa có người dùng nào</p>
        <p className="text-xs text-muted-foreground">
          Danh sách sẽ hiển thị ngay khi có người đăng ký đầu tiên.
        </p>
      </div>
    </div>
  );
}
