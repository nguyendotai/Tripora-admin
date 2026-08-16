import { baseApi } from "@/shared/services/base-api";
import type { PaginatedVehicles, VehicleStatus, VehicleType } from "../types/vehicle.types";

export interface VehicleListParams {
  status?: VehicleStatus;
  page?: number;
  limit?: number;
}

export interface VehicleInput {
  type: VehicleType;
  name: string;
  model?: string;
  capacity: number;
  features?: string[];
  licensePlate: string;
  images?: string[];
}

export const vehicleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyVehicles: builder.query<PaginatedVehicles, VehicleListParams | void>({
      query: (params) => ({ url: "/vehicles/mine", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((v) => ({ type: "Vehicle" as const, id: v.id })),
              { type: "Vehicle" as const, id: "MINE" },
            ]
          : [{ type: "Vehicle" as const, id: "MINE" }],
    }),
    listVehiclesForModeration: builder.query<PaginatedVehicles, VehicleListParams | void>({
      query: (params) => ({ url: "/vehicles/moderation", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((v) => ({ type: "Vehicle" as const, id: v.id })),
              { type: "Vehicle" as const, id: "MODERATION" },
            ]
          : [{ type: "Vehicle" as const, id: "MODERATION" }],
    }),
    createVehicle: builder.mutation<void, VehicleInput>({
      query: (body) => ({ url: "/vehicles", method: "POST", body }),
      invalidatesTags: [{ type: "Vehicle", id: "MINE" }],
    }),
    updateVehicle: builder.mutation<void, { id: string; data: Partial<VehicleInput> }>({
      query: ({ id, data }) => ({ url: `/vehicles/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Vehicle", id },
        { type: "Vehicle", id: "MINE" },
      ],
    }),
    deleteVehicle: builder.mutation<void, string>({
      query: (id) => ({ url: `/vehicles/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Vehicle", id: "MINE" }],
    }),
    reviewVehicle: builder.mutation<
      void,
      { id: string; status: "APPROVED" | "REJECTED"; reason?: string }
    >({
      query: ({ id, status, reason }) => ({
        url: `/vehicles/${id}/review`,
        method: "PATCH",
        body: { status, reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Vehicle", id },
        { type: "Vehicle", id: "MODERATION" },
      ],
    }),
  }),
});

export const {
  useListMyVehiclesQuery,
  useListVehiclesForModerationQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useReviewVehicleMutation,
} = vehicleApi;
