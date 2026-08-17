import { baseApi } from "@/shared/services/base-api";
import type { PaginatedCommissions } from "../types/commission.types";

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
  }),
});

export const { useListCommissionsQuery } = commissionApi;
