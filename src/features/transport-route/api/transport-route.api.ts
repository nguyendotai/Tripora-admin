import { baseApi } from "@/shared/services/base-api";
import type { PaginatedTransportRoutes, TransportRouteStatus } from "../types/transport-route.types";

export interface TransportRouteListParams {
  status?: TransportRouteStatus;
  page?: number;
  limit?: number;
}

export interface TransportRouteInput {
  origin: string;
  destination: string;
  vehicleType?: string;
  price: string;
  estimatedDuration?: string;
}

export const transportRouteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyTransportRoutes: builder.query<PaginatedTransportRoutes, TransportRouteListParams | void>({
      query: (params) => ({ url: "/transport-routes/mine", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((r) => ({ type: "TransportRoute" as const, id: r.id })),
              { type: "TransportRoute" as const, id: "MINE" },
            ]
          : [{ type: "TransportRoute" as const, id: "MINE" }],
    }),
    listTransportRoutesForModeration: builder.query<
      PaginatedTransportRoutes,
      TransportRouteListParams | void
    >({
      query: (params) => ({ url: "/transport-routes/moderation", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((r) => ({ type: "TransportRoute" as const, id: r.id })),
              { type: "TransportRoute" as const, id: "MODERATION" },
            ]
          : [{ type: "TransportRoute" as const, id: "MODERATION" }],
    }),
    createTransportRoute: builder.mutation<void, TransportRouteInput>({
      query: (body) => ({ url: "/transport-routes", method: "POST", body }),
      invalidatesTags: [{ type: "TransportRoute", id: "MINE" }],
    }),
    updateTransportRoute: builder.mutation<void, { id: string; data: Partial<TransportRouteInput> }>({
      query: ({ id, data }) => ({ url: `/transport-routes/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "TransportRoute", id },
        { type: "TransportRoute", id: "MINE" },
      ],
    }),
    deleteTransportRoute: builder.mutation<void, string>({
      query: (id) => ({ url: `/transport-routes/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "TransportRoute", id: "MINE" }],
    }),
    reviewTransportRoute: builder.mutation<
      void,
      { id: string; status: "APPROVED" | "REJECTED"; reason?: string }
    >({
      query: ({ id, status, reason }) => ({
        url: `/transport-routes/${id}/review`,
        method: "PATCH",
        body: { status, reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "TransportRoute", id },
        { type: "TransportRoute", id: "MODERATION" },
      ],
    }),
  }),
});

export const {
  useListMyTransportRoutesQuery,
  useListTransportRoutesForModerationQuery,
  useCreateTransportRouteMutation,
  useUpdateTransportRouteMutation,
  useDeleteTransportRouteMutation,
  useReviewTransportRouteMutation,
} = transportRouteApi;
