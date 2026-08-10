import { baseApi } from '@/shared/services/base-api';
import type { Booking, BookingStatus, PaginatedResult } from '../types/booking.types';

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAllBookings: builder.query<PaginatedResult<Booking>, { page?: number; status?: BookingStatus } | void>({
      query: (params) => ({
        url: '/bookings',
        params: { page: params?.page ?? 1, limit: 20, ...(params?.status ? { status: params.status } : {}) },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((item) => ({ type: 'Booking' as const, id: item.id })),
              { type: 'Booking' as const, id: 'LIST' },
            ]
          : [{ type: 'Booking' as const, id: 'LIST' }],
    }),
    getBooking: builder.query<Booking, string>({
      query: (id) => ({ url: `/bookings/${id}` }),
      providesTags: (_result, _error, id) => [{ type: 'Booking', id }],
    }),
    cancelBooking: builder.mutation<Booking, string>({
      query: (id) => ({ url: `/bookings/${id}/cancel`, method: 'PATCH' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Booking', id },
        { type: 'Booking', id: 'LIST' },
      ],
    }),
  }),
});

export const { useListAllBookingsQuery, useGetBookingQuery, useCancelBookingMutation } = bookingApi;
