import { baseApi } from "@/shared/services/base-api";
import type { ReportAnalytics, ReportOverview } from "../types/report.types";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportOverview: builder.query<ReportOverview, void>({
      query: () => "/reports/overview",
    }),
    getReportAnalytics: builder.query<ReportAnalytics, void>({
      query: () => "/reports/analytics",
    }),
  }),
});

export const { useGetReportOverviewQuery, useGetReportAnalyticsQuery } = reportApi;
