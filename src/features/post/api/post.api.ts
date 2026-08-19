import { baseApi } from "@/shared/services/base-api";
import type { PaginatedPosts } from "../types/post.types";

export interface PostListParams {
  destinationId?: string;
  page?: number;
  limit?: number;
}

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listPosts: builder.query<PaginatedPosts, PostListParams | void>({
      query: (params) => ({ url: "/posts", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((p) => ({ type: "Post" as const, id: p.id })),
              { type: "Post" as const, id: "LIST" },
            ]
          : [{ type: "Post" as const, id: "LIST" }],
    }),

    deletePost: builder.mutation<void, string>({
      query: (id) => ({ url: `/posts/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
  }),
});

export const { useListPostsQuery, useDeletePostMutation } = postApi;
