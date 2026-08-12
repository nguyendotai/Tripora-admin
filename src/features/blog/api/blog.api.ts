import { baseApi } from "@/shared/services/base-api";
import type { BlogPost, PaginatedBlogPosts } from "../types/blog.types";

export interface BlogPostListParams {
  q?: string;
  page?: number;
  limit?: number;
}

export interface BlogPostInput {
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
}

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listBlogPosts: builder.query<PaginatedBlogPosts, BlogPostListParams | void>({
      query: (params) => ({ url: "/blog-posts", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((p) => ({ type: "BlogPost" as const, id: p.id })),
              { type: "BlogPost" as const, id: "LIST" },
            ]
          : [{ type: "BlogPost" as const, id: "LIST" }],
    }),
    createBlogPost: builder.mutation<BlogPost, BlogPostInput>({
      query: (body) => ({ url: "/blog-posts", method: "POST", body }),
      invalidatesTags: [{ type: "BlogPost", id: "LIST" }],
    }),
    updateBlogPost: builder.mutation<BlogPost, { id: string; data: Partial<BlogPostInput> }>({
      query: ({ id, data }) => ({ url: `/blog-posts/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "BlogPost", id },
        { type: "BlogPost", id: "LIST" },
      ],
    }),
    deleteBlogPost: builder.mutation<void, string>({
      query: (id) => ({ url: `/blog-posts/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "BlogPost", id: "LIST" }],
    }),
  }),
});

export const {
  useListBlogPostsQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} = blogApi;
