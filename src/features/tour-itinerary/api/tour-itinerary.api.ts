import { baseApi } from "@/shared/services/base-api";
import type { TourItinerary } from "../types/tour-itinerary.types";

export interface TourItineraryInput {
  tourId: string;
  title: string;
  activities?: string;
  meals?: string;
  locations?: string;
}

export const tourItineraryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyTourItinerary: builder.query<TourItinerary[], string>({
      query: (tourId) => ({ url: "/tour-itineraries/mine", params: { tourId } }),
      providesTags: (result, _error, tourId) =>
        result
          ? [
              ...result.map((d) => ({ type: "TourItinerary" as const, id: d.id })),
              { type: "TourItinerary" as const, id: `LIST-${tourId}` },
            ]
          : [{ type: "TourItinerary" as const, id: `LIST-${tourId}` }],
    }),
    createTourItinerary: builder.mutation<TourItinerary, TourItineraryInput>({
      query: (body) => ({ url: "/tour-itineraries", method: "POST", body }),
      invalidatesTags: (_result, _error, { tourId }) => [
        { type: "TourItinerary", id: `LIST-${tourId}` },
      ],
    }),
    updateTourItinerary: builder.mutation<
      TourItinerary,
      { id: string; tourId: string; data: Partial<Omit<TourItineraryInput, "tourId">> }
    >({
      query: ({ id, data }) => ({ url: `/tour-itineraries/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { tourId }) => [
        { type: "TourItinerary", id: `LIST-${tourId}` },
      ],
    }),
    deleteTourItinerary: builder.mutation<void, { id: string; tourId: string }>({
      query: ({ id }) => ({ url: `/tour-itineraries/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { tourId }) => [
        { type: "TourItinerary", id: `LIST-${tourId}` },
      ],
    }),
  }),
});

export const {
  useListMyTourItineraryQuery,
  useCreateTourItineraryMutation,
  useUpdateTourItineraryMutation,
  useDeleteTourItineraryMutation,
} = tourItineraryApi;
