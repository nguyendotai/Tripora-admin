import { baseApi } from "@/shared/services/base-api";
import type { PaginatedTourBookings, TourBooking, TourBookingStatus } from "../types/tour-booking.types";

export interface TourBookingListParams {
  status?: TourBookingStatus;
  page?: number;
  limit?: number;
}

export interface ProviderTourBookingListParams {
  status?: "upcoming" | "completed" | "cancelled";
  tourId?: string;
}

export const tourBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAllTourBookings: builder.query<PaginatedTourBookings, TourBookingListParams | void>({
      query: (params) => ({ url: "/tour-bookings", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((b) => ({ type: "TourBooking" as const, id: b.id })),
              { type: "TourBooking" as const, id: "LIST" },
            ]
          : [{ type: "TourBooking" as const, id: "LIST" }],
    }),
    listMyProviderTourBookings: builder.query<TourBooking[], ProviderTourBookingListParams | void>({
      query: (params) => ({ url: "/tour-bookings/provider", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((b) => ({ type: "TourBooking" as const, id: b.id })),
              { type: "TourBooking" as const, id: "PROVIDER-LIST" },
            ]
          : [{ type: "TourBooking" as const, id: "PROVIDER-LIST" }],
    }),
  }),
});

export const { useListAllTourBookingsQuery, useListMyProviderTourBookingsQuery } = tourBookingApi;
