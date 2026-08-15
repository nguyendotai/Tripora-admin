import { baseApi } from "@/shared/services/base-api";
import type { PaginatedExperiences, ExperienceStatus } from "../types/experience.types";

export interface ExperienceListParams {
  status?: ExperienceStatus;
  page?: number;
  limit?: number;
}

export interface ExperienceInput {
  title: string;
  destinationId?: string;
  description?: string;
  durationLabel?: string;
  price: string;
  maxParticipants?: number;
  included?: string;
  excluded?: string;
  cancellationPolicy?: string;
  images?: string[];
}

export const experienceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyExperiences: builder.query<PaginatedExperiences, ExperienceListParams | void>({
      query: (params) => ({ url: "/experiences/mine", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((e) => ({ type: "Experience" as const, id: e.id })),
              { type: "Experience" as const, id: "MINE" },
            ]
          : [{ type: "Experience" as const, id: "MINE" }],
    }),
    listExperiencesForModeration: builder.query<PaginatedExperiences, ExperienceListParams | void>({
      query: (params) => ({ url: "/experiences/moderation", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((e) => ({ type: "Experience" as const, id: e.id })),
              { type: "Experience" as const, id: "MODERATION" },
            ]
          : [{ type: "Experience" as const, id: "MODERATION" }],
    }),
    createExperience: builder.mutation<void, ExperienceInput>({
      query: (body) => ({ url: "/experiences", method: "POST", body }),
      invalidatesTags: [{ type: "Experience", id: "MINE" }],
    }),
    updateExperience: builder.mutation<void, { id: string; data: Partial<ExperienceInput> }>({
      query: ({ id, data }) => ({ url: `/experiences/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Experience", id },
        { type: "Experience", id: "MINE" },
      ],
    }),
    deleteExperience: builder.mutation<void, string>({
      query: (id) => ({ url: `/experiences/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Experience", id: "MINE" }],
    }),
    reviewExperience: builder.mutation<void, { id: string; status: "APPROVED" | "REJECTED"; reason?: string }>({
      query: ({ id, status, reason }) => ({
        url: `/experiences/${id}/review`,
        method: "PATCH",
        body: { status, reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Experience", id },
        { type: "Experience", id: "MODERATION" },
      ],
    }),
  }),
});

export const {
  useListMyExperiencesQuery,
  useListExperiencesForModerationQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  useReviewExperienceMutation,
} = experienceApi;
