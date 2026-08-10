import { baseApi } from '@/shared/services/base-api';
import type {
  RoomAvailability,
  UpdateAvailabilityInput,
  UpsertAvailabilityInput,
} from '../types/room-availability.types';

export const roomAvailabilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listRoomAvailability: builder.query<RoomAvailability[], { roomId: string; from?: string; to?: string }>({
      query: ({ roomId, from, to }) => ({
        url: `/rooms/${roomId}/availability`,
        params: { ...(from ? { from } : {}), ...(to ? { to } : {}) },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: 'RoomAvailability' as const, id: item.id })),
              { type: 'RoomAvailability' as const, id: 'LIST' },
            ]
          : [{ type: 'RoomAvailability' as const, id: 'LIST' }],
    }),
    upsertRoomAvailability: builder.mutation<RoomAvailability, { roomId: string; body: UpsertAvailabilityInput }>({
      query: ({ roomId, body }) => ({ url: `/rooms/${roomId}/availability`, method: 'POST', body }),
      invalidatesTags: [{ type: 'RoomAvailability', id: 'LIST' }],
    }),
    updateRoomAvailability: builder.mutation<RoomAvailability, { id: string; body: UpdateAvailabilityInput }>({
      query: ({ id, body }) => ({ url: `/room-availability/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'RoomAvailability', id },
        { type: 'RoomAvailability', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useListRoomAvailabilityQuery,
  useUpsertRoomAvailabilityMutation,
  useUpdateRoomAvailabilityMutation,
} = roomAvailabilityApi;
