import { baseApi } from "@/shared/services/base-api";
import type { ReportOverview } from "../types/report.types";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportOverview: builder.query<ReportOverview, void>({
      query: () => "/reports/overview",
    }),
  }),
});

export const { useGetReportOverviewQuery } = reportApi;
