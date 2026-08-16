import { baseApi } from "@/shared/services/base-api";
import type { Driver, DriverStatus } from "../types/driver.types";

export interface CreateDriverInput {
  name: string;
  phone?: string;
  licenseNumber?: string;
}

export interface UpdateDriverInput {
  name?: string;
  phone?: string;
  licenseNumber?: string;
  status?: DriverStatus;
}

export interface AssignDriverInput {
  bookingId: string;
  driverId?: string;
}

export const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyDrivers: builder.query<Driver[], void>({
      query: () => ({ url: "/drivers/mine" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((d) => ({ type: "Driver" as const, id: d.id })),
              { type: "Driver" as const, id: "LIST" },
            ]
          : [{ type: "Driver" as const, id: "LIST" }],
    }),
    createDriver: builder.mutation<Driver, CreateDriverInput>({
      query: (body) => ({ url: "/drivers", method: "POST", body }),
      invalidatesTags: [{ type: "Driver", id: "LIST" }],
    }),
    updateDriver: builder.mutation<Driver, { id: string; data: UpdateDriverInput }>({
      query: ({ id, data }) => ({ url: `/drivers/${id}`, method: "PATCH", body: data }),
      invalidatesTags: [{ type: "Driver", id: "LIST" }],
    }),
    deleteDriver: builder.mutation<void, string>({
      query: (id) => ({ url: `/drivers/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Driver", id: "LIST" }],
    }),
    assignDriver: builder.mutation<void, AssignDriverInput>({
      query: (body) => ({ url: "/drivers/assign", method: "PATCH", body }),
      invalidatesTags: (_result, _error, { bookingId }) => [
        { type: "TransportBooking", id: bookingId },
        { type: "TransportBooking", id: "PROVIDER-LIST" },
      ],
    }),
  }),
});

export const {
  useListMyDriversQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
  useAssignDriverMutation,
} = driverApi;
