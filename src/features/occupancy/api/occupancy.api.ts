import { baseApi } from "@/shared/services/base-api";
import type { OccupancyDayPoint } from "../types/occupancy.types";

export const occupancyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOccupancy: builder.query<OccupancyDayPoint[], void>({
      query: () => "/occupancy/mine",
      providesTags: [{ type: "Occupancy" as const, id: "MINE" }],
    }),
  }),
});

export const { useGetMyOccupancyQuery } = occupancyApi;
