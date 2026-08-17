import { baseApi } from "@/shared/services/base-api";
import type { BookingDomain } from "@/features/payment/types/payment.types";
import type { Coupon, DiscountType, PaginatedCoupons, PromoStatus } from "../types/coupon.types";

export interface CouponListParams {
  q?: string;
  page?: number;
  limit?: number;
}

export interface CouponInput {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  applicableDomains?: BookingDomain[];
  usageLimit?: number;
  perUserLimit?: number;
  validFrom: string;
  validUntil: string;
  status?: PromoStatus;
}

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCoupons: builder.query<PaginatedCoupons, CouponListParams | void>({
      query: (params) => ({ url: "/coupons", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((c) => ({ type: "Coupon" as const, id: c.id })),
              { type: "Coupon" as const, id: "LIST" },
            ]
          : [{ type: "Coupon" as const, id: "LIST" }],
    }),
    createCoupon: builder.mutation<Coupon, CouponInput>({
      query: (body) => ({ url: "/coupons", method: "POST", body }),
      invalidatesTags: [{ type: "Coupon", id: "LIST" }],
    }),
    updateCoupon: builder.mutation<Coupon, { id: string; data: Partial<CouponInput> }>({
      query: ({ id, data }) => ({ url: `/coupons/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Coupon", id },
        { type: "Coupon", id: "LIST" },
      ],
    }),
    deleteCoupon: builder.mutation<void, string>({
      query: (id) => ({ url: `/coupons/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Coupon", id: "LIST" }],
    }),
  }),
});

export const {
  useListCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
