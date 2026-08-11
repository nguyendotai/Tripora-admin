import { baseApi } from "@/shared/services/base-api";
import type { PaginatedTravelGuides, TravelGuide } from "../types/travel-guide.types";

export interface TravelGuideListParams {
  q?: string;
  page?: number;
  limit?: number;
}

export interface TravelGuideInput {
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  destinationId?: string;
}

export const travelGuideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listTravelGuides: builder.query<
      PaginatedTravelGuides,
      TravelGuideListParams | void
    >({
      query: (params) => ({
        url: "/travel-guides",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((g) => ({
                type: "TravelGuide" as const,
                id: g.id,
              })),
              { type: "TravelGuide" as const, id: "LIST" },
            ]
          : [{ type: "TravelGuide" as const, id: "LIST" }],
    }),
    createTravelGuide: builder.mutation<TravelGuide, TravelGuideInput>({
      query: (body) => ({ url: "/travel-guides", method: "POST", body }),
      invalidatesTags: [{ type: "TravelGuide", id: "LIST" }],
    }),
    updateTravelGuide: builder.mutation<
      TravelGuide,
      { id: string; data: Partial<TravelGuideInput> }
    >({
      query: ({ id, data }) => ({
        url: `/travel-guides/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "TravelGuide", id },
        { type: "TravelGuide", id: "LIST" },
      ],
    }),
    deleteTravelGuide: builder.mutation<void, string>({
      query: (id) => ({ url: `/travel-guides/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "TravelGuide", id: "LIST" }],
    }),
  }),
});

export const {
  useListTravelGuidesQuery,
  useCreateTravelGuideMutation,
  useUpdateTravelGuideMutation,
  useDeleteTravelGuideMutation,
} = travelGuideApi;
