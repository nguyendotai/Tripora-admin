import { baseApi } from "@/shared/services/base-api";
import type { PaginatedTours, TourStatus } from "../types/tour.types";

export interface TourListParams {
  status?: TourStatus;
  page?: number;
  limit?: number;
}

export interface TourInput {
  title: string;
  destinationId?: string;
  description?: string;
  durationLabel?: string;
  price: string;
  maxParticipants?: number;
  included?: string;
  excluded?: string;
  cancellationPolicy?: string;
  images?: string[];
}

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyTours: builder.query<PaginatedTours, TourListParams | void>({
      query: (params) => ({ url: "/tours/mine", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((t) => ({ type: "Tour" as const, id: t.id })),
              { type: "Tour" as const, id: "MINE" },
            ]
          : [{ type: "Tour" as const, id: "MINE" }],
    }),
    listToursForModeration: builder.query<PaginatedTours, TourListParams | void>({
      query: (params) => ({ url: "/tours/moderation", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((t) => ({ type: "Tour" as const, id: t.id })),
              { type: "Tour" as const, id: "MODERATION" },
            ]
          : [{ type: "Tour" as const, id: "MODERATION" }],
    }),
    createTour: builder.mutation<void, TourInput>({
      query: (body) => ({ url: "/tours", method: "POST", body }),
      invalidatesTags: [{ type: "Tour", id: "MINE" }],
    }),
    updateTour: builder.mutation<void, { id: string; data: Partial<TourInput> }>({
      query: ({ id, data }) => ({ url: `/tours/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Tour", id },
        { type: "Tour", id: "MINE" },
      ],
    }),
    deleteTour: builder.mutation<void, string>({
      query: (id) => ({ url: `/tours/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Tour", id: "MINE" }],
    }),
    reviewTour: builder.mutation<void, { id: string; status: "APPROVED" | "REJECTED"; reason?: string }>({
      query: ({ id, status, reason }) => ({
        url: `/tours/${id}/review`,
        method: "PATCH",
        body: { status, reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Tour", id },
        { type: "Tour", id: "MODERATION" },
      ],
    }),
  }),
});

export const {
  useListMyToursQuery,
  useListToursForModerationQuery,
  useCreateTourMutation,
  useUpdateTourMutation,
  useDeleteTourMutation,
  useReviewTourMutation,
} = tourApi;
