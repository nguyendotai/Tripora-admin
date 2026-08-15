import { baseApi } from "@/shared/services/base-api";
import type { PaginatedProviders, Provider, ProviderStatus } from "../types/provider.types";

export interface ProviderListParams {
  status?: ProviderStatus;
  page?: number;
  limit?: number;
}

export const providerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProvider: builder.query<Provider, void>({
      query: () => "/providers/me",
      providesTags: [{ type: "Provider", id: "ME" }],
    }),
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
    suspendProvider: builder.mutation<void, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/providers/${id}/suspend`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Provider", id },
        { type: "Provider", id: "LIST" },
      ],
    }),
    unsuspendProvider: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({ url: `/providers/${id}/unsuspend`, method: "PATCH" }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Provider", id },
        { type: "Provider", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMyProviderQuery,
  useLazyGetMyProviderQuery,
  useListProvidersQuery,
  useReviewProviderMutation,
  useSuspendProviderMutation,
  useUnsuspendProviderMutation,
} = providerApi;
