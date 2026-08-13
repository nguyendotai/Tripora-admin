import { baseApi } from "@/shared/services/base-api";
import type { Room, RoomStatus } from "../types/room.types";

export interface RoomInput {
  propertyId: string;
  name: string;
  description?: string;
  capacity?: number;
  beds?: string[];
  basePrice: number;
  currency?: string;
  amenities?: string[];
  images?: string[];
}

export const roomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyRooms: builder.query<Room[], string>({
      query: (propertyId) => ({ url: "/rooms/mine", params: { propertyId } }),
      providesTags: (result, _error, propertyId) =>
        result
          ? [
              ...result.map((r) => ({ type: "Room" as const, id: r.id })),
              { type: "Room" as const, id: `LIST-${propertyId}` },
            ]
          : [{ type: "Room" as const, id: `LIST-${propertyId}` }],
    }),
    createRoom: builder.mutation<Room, RoomInput>({
      query: (body) => ({ url: "/rooms", method: "POST", body }),
      invalidatesTags: (_result, _error, { propertyId }) => [
        { type: "Room", id: `LIST-${propertyId}` },
      ],
    }),
    updateRoom: builder.mutation<
      Room,
      { id: string; propertyId: string; data: Partial<Omit<RoomInput, "propertyId">> & { status?: RoomStatus } }
    >({
      query: ({ id, data }) => ({ url: `/rooms/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { propertyId }) => [
        { type: "Room", id: `LIST-${propertyId}` },
      ],
    }),
    deleteRoom: builder.mutation<void, { id: string; propertyId: string }>({
      query: ({ id }) => ({ url: `/rooms/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { propertyId }) => [
        { type: "Room", id: `LIST-${propertyId}` },
      ],
    }),
  }),
});

export const {
  useListMyRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomApi;
