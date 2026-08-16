import { baseApi } from "@/shared/services/base-api";
import type { TransportSchedule } from "../types/transport-schedule.types";

export interface ListTransportScheduleParams {
  routeId: string;
  vehicleId?: string;
  startDate: string;
  endDate: string;
}

export interface SetTransportScheduleInput {
  routeId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  capacity: number;
  price?: number;
}

export const transportScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyTransportSchedule: builder.query<TransportSchedule[], ListTransportScheduleParams>({
      query: ({ routeId, vehicleId, startDate, endDate }) => ({
        url: "/transport-schedules/mine",
        params: { routeId, vehicleId, startDate, endDate },
      }),
      providesTags: (result, _error, { routeId }) =>
        result
          ? [
              ...result.map((s) => ({ type: "TransportSchedule" as const, id: s.id })),
              { type: "TransportSchedule" as const, id: `LIST-${routeId}` },
            ]
          : [{ type: "TransportSchedule" as const, id: `LIST-${routeId}` }],
    }),
    setTransportSchedule: builder.mutation<TransportSchedule[], SetTransportScheduleInput>({
      query: (body) => ({ url: "/transport-schedules", method: "POST", body }),
      invalidatesTags: (_result, _error, { routeId }) => [
        { type: "TransportSchedule", id: `LIST-${routeId}` },
      ],
    }),
  }),
});

export const { useListMyTransportScheduleQuery, useSetTransportScheduleMutation } = transportScheduleApi;
