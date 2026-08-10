import { baseApi } from '@/shared/services/base-api';
import type { CreateRoomInput, Room, UpdateRoomInput } from '../types/room.types';

export const roomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyRooms: builder.query<Room[], string>({
      query: (propertyId) => ({ url: `/properties/${propertyId}/rooms/mine` }),
      providesTags: (result) =>
        result
          ? [...result.map((item) => ({ type: 'Room' as const, id: item.id })), { type: 'Room' as const, id: 'LIST' }]
          : [{ type: 'Room' as const, id: 'LIST' }],
    }),
    createRoom: builder.mutation<Room, { propertyId: string; body: CreateRoomInput }>({
      query: ({ propertyId, body }) => ({ url: `/properties/${propertyId}/rooms`, method: 'POST', body }),
      invalidatesTags: [{ type: 'Room', id: 'LIST' }],
    }),
    updateRoom: builder.mutation<Room, { id: string; body: UpdateRoomInput }>({
      query: ({ id, body }) => ({ url: `/rooms/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Room', id },
        { type: 'Room', id: 'LIST' },
      ],
    }),
    deleteRoom: builder.mutation<void, string>({
      query: (id) => ({ url: `/rooms/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Room', id: 'LIST' }],
    }),
  }),
});

export const { useListMyRoomsQuery, useCreateRoomMutation, useUpdateRoomMutation, useDeleteRoomMutation } =
  roomApi;
