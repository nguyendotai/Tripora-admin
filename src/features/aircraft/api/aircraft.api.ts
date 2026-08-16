import { baseApi } from "@/shared/services/base-api";
import type { AircraftStatus, PaginatedAircraft } from "../types/aircraft.types";

export interface AircraftListParams {
  status?: AircraftStatus;
  page?: number;
  limit?: number;
}

export interface AircraftInput {
  model: string;
  registrationCode: string;
  economyCapacity: number;
  businessCapacity?: number;
}

export const aircraftApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyAircraft: builder.query<PaginatedAircraft, AircraftListParams | void>({
      query: (params) => ({ url: "/aircrafts/mine", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((a) => ({ type: "Aircraft" as const, id: a.id })),
              { type: "Aircraft" as const, id: "MINE" },
            ]
          : [{ type: "Aircraft" as const, id: "MINE" }],
    }),
    listAircraftForModeration: builder.query<PaginatedAircraft, AircraftListParams | void>({
      query: (params) => ({ url: "/aircrafts/moderation", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((a) => ({ type: "Aircraft" as const, id: a.id })),
              { type: "Aircraft" as const, id: "MODERATION" },
            ]
          : [{ type: "Aircraft" as const, id: "MODERATION" }],
    }),
    createAircraft: builder.mutation<void, AircraftInput>({
      query: (body) => ({ url: "/aircrafts", method: "POST", body }),
      invalidatesTags: [{ type: "Aircraft", id: "MINE" }],
    }),
    updateAircraft: builder.mutation<void, { id: string; data: Partial<AircraftInput> }>({
      query: ({ id, data }) => ({ url: `/aircrafts/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Aircraft", id },
        { type: "Aircraft", id: "MINE" },
      ],
    }),
    deleteAircraft: builder.mutation<void, string>({
      query: (id) => ({ url: `/aircrafts/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Aircraft", id: "MINE" }],
    }),
    reviewAircraft: builder.mutation<
      void,
      { id: string; status: "APPROVED" | "REJECTED"; reason?: string }
    >({
      query: ({ id, status, reason }) => ({
        url: `/aircrafts/${id}/review`,
        method: "PATCH",
        body: { status, reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Aircraft", id },
        { type: "Aircraft", id: "MODERATION" },
      ],
    }),
  }),
});

export const {
  useListMyAircraftQuery,
  useListAircraftForModerationQuery,
  useCreateAircraftMutation,
  useUpdateAircraftMutation,
  useDeleteAircraftMutation,
  useReviewAircraftMutation,
} = aircraftApi;
