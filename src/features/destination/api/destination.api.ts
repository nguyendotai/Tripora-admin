import { baseApi } from "@/shared/services/base-api";
import type { Destination, PaginatedDestinations } from "../types/destination.types";

export interface DestinationListParams {
  q?: string;
  page?: number;
  limit?: number;
}

export interface DestinationInput {
  name: string;
  country?: string;
  description?: string;
  images?: string[];
  tags?: string[];
}

export const destinationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listDestinations: builder.query<
      PaginatedDestinations,
      DestinationListParams | void
    >({
      query: (params) => ({
        url: "/destinations",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((d) => ({
                type: "Destination" as const,
                id: d.id,
              })),
              { type: "Destination" as const, id: "LIST" },
            ]
          : [{ type: "Destination" as const, id: "LIST" }],
    }),
    createDestination: builder.mutation<Destination, DestinationInput>({
      query: (body) => ({ url: "/destinations", method: "POST", body }),
      invalidatesTags: [{ type: "Destination", id: "LIST" }],
    }),
    updateDestination: builder.mutation<
      Destination,
      { id: string; data: Partial<DestinationInput> }
    >({
      query: ({ id, data }) => ({
        url: `/destinations/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Destination", id },
        { type: "Destination", id: "LIST" },
      ],
    }),
    deleteDestination: builder.mutation<void, string>({
      query: (id) => ({ url: `/destinations/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Destination", id: "LIST" }],
    }),
  }),
});

export const {
  useListDestinationsQuery,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
} = destinationApi;
