import { baseApi } from "@/shared/services/base-api";
import type { PaginatedActivityLogs } from "../types/activity-log.types";

export interface ActivityLogListParams {
  entityType?: string;
  actorId?: string;
  page?: number;
  limit?: number;
}

export const activityLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listActivityLogs: builder.query<PaginatedActivityLogs, ActivityLogListParams | void>({
      query: (params) => ({ url: "/activity-logs", params: params ?? undefined }),
    }),
  }),
});

export const { useListActivityLogsQuery } = activityLogApi;
