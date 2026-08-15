import { baseApi } from "@/shared/services/base-api";
import type { Booking, BookingStatus, PaginatedBookings } from "../types/booking.types";

export interface BookingListParams {
  status?: BookingStatus;
  page?: number;
  limit?: number;
}

export interface ProviderBookingListParams {
  status?: "upcoming" | "completed" | "cancelled";
  propertyId?: string;
}

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAllBookings: builder.query<PaginatedBookings, BookingListParams | void>({
      query: (params) => ({ url: "/bookings", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((b) => ({ type: "Booking" as const, id: b.id })),
              { type: "Booking" as const, id: "LIST" },
            ]
          : [{ type: "Booking" as const, id: "LIST" }],
    }),
    listMyProviderBookings: builder.query<Booking[], ProviderBookingListParams | void>({
      query: (params) => ({ url: "/bookings/provider", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((b) => ({ type: "Booking" as const, id: b.id })),
              { type: "Booking" as const, id: "PROVIDER-LIST" },
            ]
          : [{ type: "Booking" as const, id: "PROVIDER-LIST" }],
    }),
  }),
});

export const { useListAllBookingsQuery, useListMyProviderBookingsQuery } = bookingApi;
