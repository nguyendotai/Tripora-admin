"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { useListMyConversationsProviderQuery } from "@/features/conversation/api/conversation.api";
import { MessageComposer } from "@/features/conversation/components/message-composer";
import { MessageThread } from "@/features/conversation/components/message-thread";
import { Header } from "@/shared/components/header";

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data } = useListMyConversationsProviderQuery();
  const conversation = data?.find((c) => c.id === id);
  const name = conversation
    ? [conversation.user.firstName, conversation.user.lastName].filter(Boolean).join(" ") ||
      "Khách hàng"
    : "Cuộc trò chuyện";

  return (
    <>
      <Header title="Tin nhắn" />

      <main className="p-6">
        <Link
          href="/my-conversations"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Tin nhắn
        </Link>

        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="border-b border-border p-4">
            <p className="font-semibold">{name}</p>
          </div>
          <MessageThread conversationId={id} />
          <MessageComposer conversationId={id} />
        </div>
      </main>
    </>
  );
}
