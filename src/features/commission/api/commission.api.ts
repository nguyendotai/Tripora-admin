import { baseApi } from "@/shared/services/base-api";
import type {
  Commission,
  CommissionAnalyticsPoint,
  CommissionSummary,
  PaginatedCommissions,
} from "../types/commission.types";

export interface CommissionListParams {
  providerId?: string;
  page?: number;
  limit?: number;
}

export const commissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCommissions: builder.query<PaginatedCommissions, CommissionListParams | void>({
      query: (params) => ({ url: "/commissions", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((c) => ({ type: "Commission" as const, id: c.id })),
              { type: "Commission" as const, id: "LIST" },
            ]
          : [{ type: "Commission" as const, id: "LIST" }],
    }),
    listMyCommissions: builder.query<PaginatedCommissions, { page?: number; limit?: number } | void>({
      query: (params) => ({ url: "/commissions/mine", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((c) => ({ type: "Commission" as const, id: c.id })),
              { type: "Commission" as const, id: "MY-LIST" },
            ]
          : [{ type: "Commission" as const, id: "MY-LIST" }],
    }),
    getMySummary: builder.query<CommissionSummary, void>({
      query: () => "/commissions/mine/summary",
      providesTags: [{ type: "Commission" as const, id: "MY-SUMMARY" }],
    }),
    getMyAnalytics: builder.query<CommissionAnalyticsPoint[], void>({
      query: () => "/commissions/mine/analytics",
      providesTags: [{ type: "Commission" as const, id: "MY-ANALYTICS" }],
    }),
    markCommissionPaidOut: builder.mutation<Commission, string>({
      query: (id) => ({ url: `/commissions/${id}/payout`, method: "PATCH" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Commission", id },
        { type: "Commission", id: "LIST" },
        { type: "Commission", id: "MY-LIST" },
        { type: "Commission", id: "MY-SUMMARY" },
      ],
    }),
  }),
});

export const {
  useListCommissionsQuery,
  useListMyCommissionsQuery,
  useGetMySummaryQuery,
  useGetMyAnalyticsQuery,
  useMarkCommissionPaidOutMutation,
} = commissionApi;
