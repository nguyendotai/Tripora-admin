import { baseApi } from "@/shared/services/base-api";
import type { PaginatedComments } from "../types/comment.types";

export interface CommentModerationParams {
  page?: number;
  limit?: number;
}

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCommentsForModeration: builder.query<PaginatedComments, CommentModerationParams | void>({
      query: (params) => ({ url: "/comments/moderation", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((c) => ({ type: "Comment" as const, id: c.id })),
              { type: "Comment" as const, id: "LIST" },
            ]
          : [{ type: "Comment" as const, id: "LIST" }],
    }),

    deleteComment: builder.mutation<void, string>({
      query: (id) => ({ url: `/comments/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Comment", id: "LIST" }],
    }),
  }),
});

export const { useListCommentsForModerationQuery, useDeleteCommentMutation } = commentApi;
