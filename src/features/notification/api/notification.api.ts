import { baseApi } from "@/shared/services/base-api";
import type { PaginatedNotifications } from "../types/notification.types";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listNotifications: builder.query<PaginatedNotifications, { limit?: number } | void>({
      query: (params) => ({ url: "/notifications", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((n) => ({ type: "Notification" as const, id: n.id })),
              { type: "Notification" as const, id: "LIST" },
            ]
          : [{ type: "Notification" as const, id: "LIST" }],
    }),

    markNotificationAsRead: builder.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Notification", id },
        { type: "Notification", id: "LIST" },
      ],
    }),

    markAllNotificationsAsRead: builder.mutation<void, void>({
      query: () => ({ url: "/notifications/read-all", method: "PATCH" }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),
  }),
});

export const {
  useListNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationApi;
