import { baseApi } from "@/shared/services/base-api";
import type { PaginatedProviders, ProviderStatus } from "../types/provider.types";

export interface ProviderListParams {
  status?: ProviderStatus;
  page?: number;
  limit?: number;
}

export const providerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listProviders: builder.query<PaginatedProviders, ProviderListParams | void>({
      query: (params) => ({ url: "/providers", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((p) => ({ type: "Provider" as const, id: p.id })),
              { type: "Provider" as const, id: "LIST" },
            ]
          : [{ type: "Provider" as const, id: "LIST" }],
    }),
    reviewProvider: builder.mutation<
      void,
      { id: string; status: "APPROVED" | "REJECTED"; reason?: string }
    >({
      query: ({ id, status, reason }) => ({
        url: `/providers/${id}/review`,
        method: "PATCH",
        body: { status, reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Provider", id },
        { type: "Provider", id: "LIST" },
      ],
    }),
  }),
});

export const { useListProvidersQuery, useReviewProviderMutation } = providerApi;
