import { baseApi } from "@/shared/services/base-api";
import type {
  GuideAssignedSchedule,
  GuideTraveler,
  MyGuideProfile,
  TourGuide,
  TourGuideStatus,
} from "../types/tour-guide.types";

export interface CreateGuideInput {
  email: string;
  bio?: string;
  phone?: string;
}

export interface UpdateGuideInput {
  bio?: string;
  phone?: string;
  status?: TourGuideStatus;
}

export interface UpdateMyGuideProfileInput {
  bio?: string;
  phone?: string;
}

export interface AssignGuideInput {
  scheduleId: string;
  guideId?: string;
}

export const tourGuideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyGuides: builder.query<TourGuide[], void>({
      query: () => ({ url: "/tour-guides/mine" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((g) => ({ type: "TourGuide" as const, id: g.id })),
              { type: "TourGuide" as const, id: "LIST" },
            ]
          : [{ type: "TourGuide" as const, id: "LIST" }],
    }),
    createGuide: builder.mutation<TourGuide, CreateGuideInput>({
      query: (body) => ({ url: "/tour-guides", method: "POST", body }),
      invalidatesTags: [{ type: "TourGuide", id: "LIST" }],
    }),
    updateGuide: builder.mutation<TourGuide, { id: string; data: UpdateGuideInput }>({
      query: ({ id, data }) => ({ url: `/tour-guides/${id}`, method: "PATCH", body: data }),
      invalidatesTags: [{ type: "TourGuide", id: "LIST" }],
    }),
    deleteGuide: builder.mutation<void, string>({
      query: (id) => ({ url: `/tour-guides/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "TourGuide", id: "LIST" }],
    }),
    assignGuide: builder.mutation<void, AssignGuideInput>({
      query: (body) => ({ url: "/tour-guides/assign", method: "PATCH", body }),
      invalidatesTags: (_result, _error, { scheduleId }) => [
        { type: "TourSchedule", id: scheduleId },
      ],
    }),
    getMyGuideProfile: builder.query<MyGuideProfile, void>({
      query: () => ({ url: "/tour-guides/me" }),
      providesTags: [{ type: "TourGuide", id: "ME" }],
    }),
    updateMyGuideProfile: builder.mutation<MyGuideProfile, UpdateMyGuideProfileInput>({
      query: (body) => ({ url: "/tour-guides/me", method: "PATCH", body }),
      invalidatesTags: [{ type: "TourGuide", id: "ME" }],
    }),
    listMyAssignedSchedules: builder.query<GuideAssignedSchedule[], void>({
      query: () => ({ url: "/tour-guides/me/schedules" }),
      providesTags: [{ type: "TourGuide", id: "MY-SCHEDULES" }],
    }),
    listScheduleTravelers: builder.query<GuideTraveler[], string>({
      query: (scheduleId) => ({ url: `/tour-guides/me/schedules/${scheduleId}/travelers` }),
    }),
  }),
});

export const {
  useListMyGuidesQuery,
  useCreateGuideMutation,
  useUpdateGuideMutation,
  useDeleteGuideMutation,
  useAssignGuideMutation,
  useGetMyGuideProfileQuery,
  useLazyGetMyGuideProfileQuery,
  useUpdateMyGuideProfileMutation,
  useListMyAssignedSchedulesQuery,
  useListScheduleTravelersQuery,
} = tourGuideApi;
