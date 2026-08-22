import { baseApi } from "@/shared/services/base-api";
import type { Conversation, PaginatedMessages } from "../types/conversation.types";

export interface SendMessageInput {
  conversationId: string;
  content: string;
}

export const conversationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyConversationsProvider: builder.query<Conversation[], void>({
      query: () => ({ url: "/conversations/mine/provider" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({ type: "Conversation" as const, id: c.id })),
              { type: "Conversation" as const, id: "LIST" },
            ]
          : [{ type: "Conversation" as const, id: "LIST" }],
    }),

    listMessages: builder.query<PaginatedMessages, { conversationId: string; page?: number }>({
      query: ({ conversationId, page }) => ({
        url: `/conversations/${conversationId}/messages`,
        params: page ? { page } : undefined,
      }),
      providesTags: (_result, _error, { conversationId }) => [
        { type: "Message" as const, id: conversationId },
        { type: "Message" as const, id: "LIST" },
      ],
    }),

    sendMessage: builder.mutation<void, SendMessageInput>({
      query: ({ conversationId, content }) => ({
        url: `/conversations/${conversationId}/messages`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: "Message", id: conversationId },
        { type: "Conversation", id: "LIST" },
      ],
    }),

    markConversationAsRead: builder.mutation<void, string>({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }),
  }),
});

export const {
  useListMyConversationsProviderQuery,
  useListMessagesQuery,
  useSendMessageMutation,
  useMarkConversationAsReadMutation,
} = conversationApi;
