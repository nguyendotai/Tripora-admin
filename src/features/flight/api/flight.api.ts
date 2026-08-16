import { baseApi } from "@/shared/services/base-api";
import type { FlightStatus, PaginatedFlights } from "../types/flight.types";

export interface FlightListParams {
  status?: FlightStatus;
  page?: number;
  limit?: number;
}

export interface FlightInput {
  aircraftId: string;
  flightNumber: string;
  departureAirportId: string;
  arrivalAirportId: string;
  duration: number;
}

export const flightApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyFlights: builder.query<PaginatedFlights, FlightListParams | void>({
      query: (params) => ({ url: "/flights/mine", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((f) => ({ type: "Flight" as const, id: f.id })),
              { type: "Flight" as const, id: "MINE" },
            ]
          : [{ type: "Flight" as const, id: "MINE" }],
    }),
    listFlightsForModeration: builder.query<PaginatedFlights, FlightListParams | void>({
      query: (params) => ({ url: "/flights/moderation", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((f) => ({ type: "Flight" as const, id: f.id })),
              { type: "Flight" as const, id: "MODERATION" },
            ]
          : [{ type: "Flight" as const, id: "MODERATION" }],
    }),
    createFlight: builder.mutation<void, FlightInput>({
      query: (body) => ({ url: "/flights", method: "POST", body }),
      invalidatesTags: [{ type: "Flight", id: "MINE" }],
    }),
    updateFlight: builder.mutation<void, { id: string; data: Partial<FlightInput> }>({
      query: ({ id, data }) => ({ url: `/flights/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Flight", id },
        { type: "Flight", id: "MINE" },
      ],
    }),
    deleteFlight: builder.mutation<void, string>({
      query: (id) => ({ url: `/flights/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Flight", id: "MINE" }],
    }),
    reviewFlight: builder.mutation<
      void,
      { id: string; status: "APPROVED" | "REJECTED"; reason?: string }
    >({
      query: ({ id, status, reason }) => ({
        url: `/flights/${id}/review`,
        method: "PATCH",
        body: { status, reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Flight", id },
        { type: "Flight", id: "MODERATION" },
      ],
    }),
  }),
});

export const {
  useListMyFlightsQuery,
  useListFlightsForModerationQuery,
  useCreateFlightMutation,
  useUpdateFlightMutation,
  useDeleteFlightMutation,
  useReviewFlightMutation,
} = flightApi;
