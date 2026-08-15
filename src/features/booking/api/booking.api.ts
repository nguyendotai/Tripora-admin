import { baseApi } from "@/shared/services/base-api";
import type { BookingStatus, PaginatedBookings } from "../types/booking.types";

export interface BookingListParams {
  status?: BookingStatus;
  page?: number;
  limit?: number;
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
  }),
});

export const { useListAllBookingsQuery } = bookingApi;
