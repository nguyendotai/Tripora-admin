"use client";

import { useEffect, useRef } from "react";
import { useListMessagesQuery, useMarkConversationAsReadMutation } from "../api/conversation.api";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

function timeLabel(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

export function MessageThread({ conversationId }: { conversationId: string }) {
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const { data, isLoading, isError } = useListMessagesQuery({ conversationId });
  const [markAsRead] = useMarkConversationAsReadMutation();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markAsRead(conversationId);
  }, [conversationId, markAsRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [data?.items.length]);

  if (isLoading) {
    return <p className="p-5 text-sm text-muted-foreground">Đang tải...</p>;
  }
  if (isError || !data) {
    return <p className="p-5 text-sm text-destructive">Không tải được cuộc trò chuyện.</p>;
  }

  const messages = [...data.items].reverse();

  return (
    <div className="flex min-h-[420px] flex-col-reverse gap-3 overflow-y-auto p-5">
      <div ref={bottomRef} />
      {messages.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">Chưa có tin nhắn nào.</p>
      ) : (
        messages.map((message) => {
          const isMine = message.senderId === currentUserId;
          return (
            <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-[var(--radius-lg)] px-4 py-2.5 text-sm ${
                  isMine
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`mt-1 text-[11px] ${
                    isMine ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {timeLabel(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
