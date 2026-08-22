"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useListMyConversationsProviderQuery } from "@/features/conversation/api/conversation.api";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

function timeLabel(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" });
}

export default function MyConversationsPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useListMyConversationsProviderQuery();

  useEffect(() => {
    if (
      user &&
      (!user.providerId ||
        user.orgRole === "FINANCE_STAFF" ||
        !user.orgRole)
    ) {
      router.replace("/my-properties");
    }
  }, [user, router]);

  return (
    <>
      <Header title="Tin nhắn" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="border-b border-border p-4">
            <p className="font-semibold">Cuộc trò chuyện với khách hàng</p>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách tin nhắn. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-10 text-center">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Chưa có cuộc trò chuyện nào</p>
              <p className="text-xs text-muted-foreground">
                Khách hàng liên hệ từ trang chi tiết sản phẩm sẽ xuất hiện ở đây.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {data.map((conversation) => {
                const name =
                  [conversation.user.firstName, conversation.user.lastName]
                    .filter(Boolean)
                    .join(" ") || "Khách hàng";
                return (
                  <Link
                    key={conversation.id}
                    href={`/my-conversations/${conversation.id}`}
                    className="flex items-center gap-3 p-4 transition-colors hover:bg-accent/50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                      {name[0]?.toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`truncate text-sm ${
                            conversation.unreadCount > 0 ? "font-semibold" : "font-medium"
                          }`}
                        >
                          {name}
                        </p>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {timeLabel(conversation.lastMessageAt)}
                        </span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {conversation.lastMessage?.content ?? "Chưa có tin nhắn"}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] font-medium text-destructive-foreground">
                        {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
