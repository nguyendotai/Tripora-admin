import { baseApi } from "@/shared/services/base-api";
import type {
  FlightBooking,
  FlightBookingStatus,
  PaginatedFlightBookings,
} from "../types/flight-booking.types";

export interface FlightBookingListParams {
  status?: FlightBookingStatus;
  page?: number;
  limit?: number;
}

export interface ProviderFlightBookingListParams {
  status?: "upcoming" | "completed" | "cancelled";
  flightId?: string;
}

export const flightBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAllFlightBookings: builder.query<PaginatedFlightBookings, FlightBookingListParams | void>({
      query: (params) => ({ url: "/flight-bookings", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((b) => ({ type: "FlightBooking" as const, id: b.id })),
              { type: "FlightBooking" as const, id: "LIST" },
            ]
          : [{ type: "FlightBooking" as const, id: "LIST" }],
    }),
    listMyProviderFlightBookings: builder.query<FlightBooking[], ProviderFlightBookingListParams | void>({
      query: (params) => ({ url: "/flight-bookings/provider", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((b) => ({ type: "FlightBooking" as const, id: b.id })),
              { type: "FlightBooking" as const, id: "PROVIDER-LIST" },
            ]
          : [{ type: "FlightBooking" as const, id: "PROVIDER-LIST" }],
    }),
  }),
});

export const { useListAllFlightBookingsQuery, useListMyProviderFlightBookingsQuery } = flightBookingApi;
