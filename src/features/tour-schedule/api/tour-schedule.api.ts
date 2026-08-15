import { baseApi } from "@/shared/services/base-api";
import type { TourSchedule } from "../types/tour-schedule.types";

export interface ListTourScheduleParams {
  tourId: string;
  startDate: string;
  endDate: string;
}

export interface SetTourScheduleInput {
  tourId: string;
  startDate: string;
  endDate: string;
  capacity: number;
  price?: number;
}

export const tourScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyTourSchedule: builder.query<TourSchedule[], ListTourScheduleParams>({
      query: ({ tourId, startDate, endDate }) => ({
        url: "/tour-schedules/mine",
        params: { tourId, startDate, endDate },
      }),
      providesTags: (result, _error, { tourId }) =>
        result
          ? [
              ...result.map((s) => ({ type: "TourSchedule" as const, id: s.id })),
              { type: "TourSchedule" as const, id: `LIST-${tourId}` },
            ]
          : [{ type: "TourSchedule" as const, id: `LIST-${tourId}` }],
    }),
    setTourSchedule: builder.mutation<TourSchedule[], SetTourScheduleInput>({
      query: (body) => ({ url: "/tour-schedules", method: "POST", body }),
      invalidatesTags: (_result, _error, { tourId }) => [
        { type: "TourSchedule", id: `LIST-${tourId}` },
      ],
    }),
  }),
});

export const { useListMyTourScheduleQuery, useSetTourScheduleMutation } = tourScheduleApi;
