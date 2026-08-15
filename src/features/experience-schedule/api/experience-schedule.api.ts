import { baseApi } from "@/shared/services/base-api";
import type { ExperienceSchedule } from "../types/experience-schedule.types";

export interface ListExperienceScheduleParams {
  experienceId: string;
  startDate: string;
  endDate: string;
}

export interface SetExperienceScheduleInput {
  experienceId: string;
  startDate: string;
  endDate: string;
  capacity: number;
  price?: number;
}

export const experienceScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyExperienceSchedule: builder.query<ExperienceSchedule[], ListExperienceScheduleParams>({
      query: ({ experienceId, startDate, endDate }) => ({
        url: "/experience-schedules/mine",
        params: { experienceId, startDate, endDate },
      }),
      providesTags: (result, _error, { experienceId }) =>
        result
          ? [
              ...result.map((s) => ({ type: "ExperienceSchedule" as const, id: s.id })),
              { type: "ExperienceSchedule" as const, id: `LIST-${experienceId}` },
            ]
          : [{ type: "ExperienceSchedule" as const, id: `LIST-${experienceId}` }],
    }),
    setExperienceSchedule: builder.mutation<ExperienceSchedule[], SetExperienceScheduleInput>({
      query: (body) => ({ url: "/experience-schedules", method: "POST", body }),
      invalidatesTags: (_result, _error, { experienceId }) => [
        { type: "ExperienceSchedule", id: `LIST-${experienceId}` },
      ],
    }),
  }),
});

export const { useListMyExperienceScheduleQuery, useSetExperienceScheduleMutation } = experienceScheduleApi;
