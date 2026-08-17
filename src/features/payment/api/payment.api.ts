import { baseApi } from "@/shared/services/base-api";
import type { PaginatedPayments, PaymentStatus } from "../types/payment.types";

export interface PaymentListParams {
  status?: PaymentStatus;
  page?: number;
  limit?: number;
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAllPayments: builder.query<PaginatedPayments, PaymentListParams | void>({
      query: (params) => ({ url: "/payments", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((p) => ({ type: "Payment" as const, id: p.id })),
              { type: "Payment" as const, id: "LIST" },
            ]
          : [{ type: "Payment" as const, id: "LIST" }],
    }),
  }),
});

export const { useListAllPaymentsQuery } = paymentApi;
