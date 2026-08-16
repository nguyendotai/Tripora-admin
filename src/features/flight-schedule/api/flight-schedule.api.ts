import { baseApi } from "@/shared/services/base-api";
import type { FlightSchedule } from "../types/flight-schedule.types";

export interface ListFlightScheduleParams {
  flightId: string;
  startDate: string;
  endDate: string;
}

export interface SetFlightScheduleInput {
  flightId: string;
  startDate: string;
  endDate: string;
  departureTime: string;
  arrivalTime: string;
  economyPrice: number;
  businessPrice?: number;
}

export const flightScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyFlightSchedule: builder.query<FlightSchedule[], ListFlightScheduleParams>({
      query: ({ flightId, startDate, endDate }) => ({
        url: "/flight-schedules/mine",
        params: { flightId, startDate, endDate },
      }),
      providesTags: (result, _error, { flightId }) =>
        result
          ? [
              ...result.map((s) => ({ type: "FlightSchedule" as const, id: s.id })),
              { type: "FlightSchedule" as const, id: `LIST-${flightId}` },
            ]
          : [{ type: "FlightSchedule" as const, id: `LIST-${flightId}` }],
    }),
    setFlightSchedule: builder.mutation<FlightSchedule[], SetFlightScheduleInput>({
      query: (body) => ({ url: "/flight-schedules", method: "POST", body }),
      invalidatesTags: (_result, _error, { flightId }) => [
        { type: "FlightSchedule", id: `LIST-${flightId}` },
      ],
    }),
  }),
});

export const { useListMyFlightScheduleQuery, useSetFlightScheduleMutation } = flightScheduleApi;
