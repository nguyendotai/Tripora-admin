import { baseApi } from "@/shared/services/base-api";
import type { PaginatedProperties, PropertyStatus } from "../types/property.types";

export interface PropertyListParams {
  status?: PropertyStatus;
  page?: number;
  limit?: number;
}

export interface PropertyInput {
  name: string;
  destinationId?: string;
  description?: string;
  address?: string;
  checkInTime?: string;
  checkOutTime?: string;
  policies?: string;
  amenities?: string[];
  images?: string[];
}

export const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyProperties: builder.query<PaginatedProperties, PropertyListParams | void>({
      query: (params) => ({ url: "/properties/mine", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((p) => ({ type: "Property" as const, id: p.id })),
              { type: "Property" as const, id: "MINE" },
            ]
          : [{ type: "Property" as const, id: "MINE" }],
    }),
    listPropertiesForModeration: builder.query<PaginatedProperties, PropertyListParams | void>({
      query: (params) => ({ url: "/properties/moderation", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((p) => ({ type: "Property" as const, id: p.id })),
              { type: "Property" as const, id: "MODERATION" },
            ]
          : [{ type: "Property" as const, id: "MODERATION" }],
    }),
    createProperty: builder.mutation<void, PropertyInput>({
      query: (body) => ({ url: "/properties", method: "POST", body }),
      invalidatesTags: [{ type: "Property", id: "MINE" }],
    }),
    updateProperty: builder.mutation<void, { id: string; data: Partial<PropertyInput> }>({
      query: ({ id, data }) => ({ url: `/properties/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Property", id },
        { type: "Property", id: "MINE" },
      ],
    }),
    deleteProperty: builder.mutation<void, string>({
      query: (id) => ({ url: `/properties/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Property", id: "MINE" }],
    }),
    reviewProperty: builder.mutation<
      void,
      { id: string; status: "APPROVED" | "REJECTED"; reason?: string }
    >({
      query: ({ id, status, reason }) => ({
        url: `/properties/${id}/review`,
        method: "PATCH",
        body: { status, reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Property", id },
        { type: "Property", id: "MODERATION" },
      ],
    }),
  }),
});

export const {
  useListMyPropertiesQuery,
  useListPropertiesForModerationQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useReviewPropertyMutation,
} = propertyApi;
