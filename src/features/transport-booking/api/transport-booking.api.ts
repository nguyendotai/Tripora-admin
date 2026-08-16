import { baseApi } from "@/shared/services/base-api";
import type {
  PaginatedTransportBookings,
  TransportBooking,
  TransportBookingStatus,
} from "../types/transport-booking.types";

export interface TransportBookingListParams {
  status?: TransportBookingStatus;
  page?: number;
  limit?: number;
}

export interface ProviderTransportBookingListParams {
  status?: "upcoming" | "completed" | "cancelled";
  routeId?: string;
}

export const transportBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAllTransportBookings: builder.query<PaginatedTransportBookings, TransportBookingListParams | void>({
      query: (params) => ({ url: "/transport-bookings", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((b) => ({ type: "TransportBooking" as const, id: b.id })),
              { type: "TransportBooking" as const, id: "LIST" },
            ]
          : [{ type: "TransportBooking" as const, id: "LIST" }],
    }),
    listMyProviderTransportBookings: builder.query<TransportBooking[], ProviderTransportBookingListParams | void>({
      query: (params) => ({ url: "/transport-bookings/provider", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((b) => ({ type: "TransportBooking" as const, id: b.id })),
              { type: "TransportBooking" as const, id: "PROVIDER-LIST" },
            ]
          : [{ type: "TransportBooking" as const, id: "PROVIDER-LIST" }],
    }),
  }),
});

export const { useListAllTransportBookingsQuery, useListMyProviderTransportBookingsQuery } = transportBookingApi;
