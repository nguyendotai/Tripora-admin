"use client";

import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  useListNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/features/notification/api/notification.api";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { useNotificationSocket } from "@/shared/services/socket";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

export function NotificationBell() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  useNotificationSocket();
  const { data } = useListNotificationsQuery(
    { limit: 10 },
    { skip: !accessToken, pollingInterval: 60000 },
  );
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsAsReadMutation();

  if (!accessToken) {
    return (
      <Button variant="ghost" size="icon" className="relative rounded-full" disabled>
        <Bell className="h-4 w-4" />
        <span className="sr-only">Thông báo</span>
      </Button>
    );
  }

  const unreadCount = data?.unreadCount ?? 0;
  const items = data?.items ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" className="relative rounded-full" />}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 rounded-full bg-destructive px-1 text-[10px] text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
        <span className="sr-only">Thông báo</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <p className="text-xs font-medium text-muted-foreground">Thông báo</p>
          {unreadCount > 0 && (
            <button
              type="button"
              disabled={isMarkingAll}
              onClick={() => markAllAsRead()}
              className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
            >
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            Chưa có thông báo nào.
          </p>
        ) : (
          items.map((item) => (
            <DropdownMenuItem
              key={item.id}
              closeOnClick={false}
              onClick={() => !item.isRead && markAsRead(item.id)}
              className={cn("flex-col items-start gap-0.5 whitespace-normal", !item.isRead && "bg-accent/50")}
            >
              <div className="flex w-full items-center gap-1.5">
                {!item.isRead && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                <p className="text-sm font-medium">{item.title}</p>
              </div>
              <p className="text-xs text-muted-foreground">{item.message}</p>
              <p className="text-[11px] text-muted-foreground/70">{timeAgo(item.createdAt)}</p>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
