import { baseApi } from "@/shared/services/base-api";
import type { BookingDomain } from "@/features/payment/types/payment.types";
import type { DiscountType, PromoStatus } from "@/features/coupon/types/coupon.types";
import type { PaginatedPromotions, Promotion } from "../types/promotion.types";

export interface PromotionListParams {
  page?: number;
  limit?: number;
}

export interface PromotionInput {
  name: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  applicableDomains?: BookingDomain[];
  priority?: number;
  validFrom: string;
  validUntil: string;
  status?: PromoStatus;
}

export const promotionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listPromotions: builder.query<PaginatedPromotions, PromotionListParams | void>({
      query: (params) => ({ url: "/promotions", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((p) => ({ type: "Promotion" as const, id: p.id })),
              { type: "Promotion" as const, id: "LIST" },
            ]
          : [{ type: "Promotion" as const, id: "LIST" }],
    }),
    createPromotion: builder.mutation<Promotion, PromotionInput>({
      query: (body) => ({ url: "/promotions", method: "POST", body }),
      invalidatesTags: [{ type: "Promotion", id: "LIST" }],
    }),
    updatePromotion: builder.mutation<Promotion, { id: string; data: Partial<PromotionInput> }>({
      query: ({ id, data }) => ({ url: `/promotions/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Promotion", id },
        { type: "Promotion", id: "LIST" },
      ],
    }),
    deletePromotion: builder.mutation<void, string>({
      query: (id) => ({ url: `/promotions/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Promotion", id: "LIST" }],
    }),
  }),
});

export const {
  useListPromotionsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} = promotionApi;
