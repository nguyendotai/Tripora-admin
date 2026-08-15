import { baseApi } from "@/shared/services/base-api";
import type { ExperienceBooking, ExperienceBookingStatus, PaginatedExperienceBookings } from "../types/experience-booking.types";

export interface ExperienceBookingListParams {
  status?: ExperienceBookingStatus;
  page?: number;
  limit?: number;
}

export interface ProviderExperienceBookingListParams {
  status?: "upcoming" | "completed" | "cancelled";
  experienceId?: string;
}

export const experienceBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAllExperienceBookings: builder.query<PaginatedExperienceBookings, ExperienceBookingListParams | void>({
      query: (params) => ({ url: "/experience-bookings", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((b) => ({ type: "ExperienceBooking" as const, id: b.id })),
              { type: "ExperienceBooking" as const, id: "LIST" },
            ]
          : [{ type: "ExperienceBooking" as const, id: "LIST" }],
    }),
    listMyProviderExperienceBookings: builder.query<ExperienceBooking[], ProviderExperienceBookingListParams | void>({
      query: (params) => ({ url: "/experience-bookings/provider", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((b) => ({ type: "ExperienceBooking" as const, id: b.id })),
              { type: "ExperienceBooking" as const, id: "PROVIDER-LIST" },
            ]
          : [{ type: "ExperienceBooking" as const, id: "PROVIDER-LIST" }],
    }),
  }),
});

export const { useListAllExperienceBookingsQuery, useListMyProviderExperienceBookingsQuery } =
  experienceBookingApi;
