import { baseApi } from "@/shared/services/base-api";
import type { Airport, PaginatedAirports } from "../types/airport.types";

export interface AirportListParams {
  q?: string;
  country?: string;
  page?: number;
  limit?: number;
}

export interface AirportInput {
  code: string;
  name: string;
  city: string;
  country: string;
}

export const airportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAirports: builder.query<PaginatedAirports, AirportListParams | void>({
      query: (params) => ({ url: "/airports", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((a) => ({ type: "Airport" as const, id: a.id })),
              { type: "Airport" as const, id: "LIST" },
            ]
          : [{ type: "Airport" as const, id: "LIST" }],
    }),
    createAirport: builder.mutation<Airport, AirportInput>({
      query: (body) => ({ url: "/airports", method: "POST", body }),
      invalidatesTags: [{ type: "Airport", id: "LIST" }],
    }),
    updateAirport: builder.mutation<Airport, { id: string; data: Partial<AirportInput> }>({
      query: ({ id, data }) => ({ url: `/airports/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Airport", id },
        { type: "Airport", id: "LIST" },
      ],
    }),
    deleteAirport: builder.mutation<void, string>({
      query: (id) => ({ url: `/airports/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Airport", id: "LIST" }],
    }),
  }),
});

export const {
  useListAirportsQuery,
  useCreateAirportMutation,
  useUpdateAirportMutation,
  useDeleteAirportMutation,
} = airportApi;
