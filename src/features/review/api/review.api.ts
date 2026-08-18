import { baseApi } from "@/shared/services/base-api";
import type { PaginatedReviews } from "../types/review.types";

export interface ReviewListParams {
  destinationId?: string;
  propertyId?: string;
  page?: number;
  limit?: number;
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listReviews: builder.query<PaginatedReviews, ReviewListParams | void>({
      query: (params) => ({ url: "/reviews", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((r) => ({ type: "Review" as const, id: r.id })),
              { type: "Review" as const, id: "LIST" },
            ]
          : [{ type: "Review" as const, id: "LIST" }],
    }),

    deleteReview: builder.mutation<void, string>({
      query: (id) => ({ url: `/reviews/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),
  }),
});

export const { useListReviewsQuery, useDeleteReviewMutation } = reviewApi;
