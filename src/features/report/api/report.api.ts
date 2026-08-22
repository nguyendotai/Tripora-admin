import { baseApi } from "@/shared/services/base-api";
import type {
  GeneratedReport,
  PaginatedGeneratedReports,
  ReportAnalytics,
  ReportOverview,
} from "../types/report.types";

export interface ListGeneratedReportsParams {
  status?: string;
  page?: number;
  limit?: number;
}

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportOverview: builder.query<ReportOverview, void>({
      query: () => "/reports/overview",
    }),
    getReportAnalytics: builder.query<ReportAnalytics, void>({
      query: () => "/reports/analytics",
    }),
    generateReport: builder.mutation<GeneratedReport, void>({
      query: () => ({ url: "/reports/generate", method: "POST" }),
      invalidatesTags: [{ type: "Report" as const, id: "LIST" }],
    }),
    listGeneratedReports: builder.query<
      PaginatedGeneratedReports,
      ListGeneratedReportsParams | void
    >({
      query: (params) => ({ url: "/reports/generated", params: params ?? undefined }),
      providesTags: [{ type: "Report" as const, id: "LIST" }],
    }),
    getGeneratedReport: builder.query<GeneratedReport, string>({
      query: (id) => `/reports/generated/${id}`,
    }),
  }),
});

export const {
  useGetReportOverviewQuery,
  useGetReportAnalyticsQuery,
  useGenerateReportMutation,
  useListGeneratedReportsQuery,
  useGetGeneratedReportQuery,
} = reportApi;
