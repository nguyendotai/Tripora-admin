import { baseApi } from "@/shared/services/base-api";
import type { RoomInventory } from "../types/room-inventory.types";

export interface ListRoomInventoryParams {
  roomId: string;
  startDate: string;
  endDate: string;
}

export interface SetRoomInventoryInput {
  roomId: string;
  startDate: string;
  endDate: string;
  totalRooms: number;
  price?: number;
}

export const roomInventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyRoomInventory: builder.query<RoomInventory[], ListRoomInventoryParams>({
      query: ({ roomId, startDate, endDate }) => ({
        url: "/room-inventory/mine",
        params: { roomId, startDate, endDate },
      }),
      providesTags: (result, _error, { roomId }) =>
        result
          ? [
              ...result.map((r) => ({ type: "RoomInventory" as const, id: r.id })),
              { type: "RoomInventory" as const, id: `LIST-${roomId}` },
            ]
          : [{ type: "RoomInventory" as const, id: `LIST-${roomId}` }],
    }),
    setRoomInventory: builder.mutation<RoomInventory[], SetRoomInventoryInput>({
      query: (body) => ({ url: "/room-inventory", method: "POST", body }),
      invalidatesTags: (_result, _error, { roomId }) => [
        { type: "RoomInventory", id: `LIST-${roomId}` },
      ],
    }),
  }),
});

export const { useListMyRoomInventoryQuery, useSetRoomInventoryMutation } = roomInventoryApi;
