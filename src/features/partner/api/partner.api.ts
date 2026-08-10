import { baseApi } from '@/shared/services/base-api';
import type { Partner } from '../types/partner.types';

export const partnerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listPendingPartners: builder.query<Partner[], void>({
      query: () => ({ url: '/partners/pending' }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: 'Partner' as const, id: item.id })),
              { type: 'Partner' as const, id: 'LIST' },
            ]
          : [{ type: 'Partner' as const, id: 'LIST' }],
    }),
    verifyPartner: builder.mutation<Partner, string>({
      query: (id) => ({ url: `/partners/${id}/verify`, method: 'PATCH' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Partner', id },
        { type: 'Partner', id: 'LIST' },
      ],
    }),
    rejectPartner: builder.mutation<Partner, { id: string; reason: string }>({
      query: ({ id, reason }) => ({ url: `/partners/${id}/reject`, method: 'PATCH', body: { reason } }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Partner', id },
        { type: 'Partner', id: 'LIST' },
      ],
    }),
  }),
});

export const { useListPendingPartnersQuery, useVerifyPartnerMutation, useRejectPartnerMutation } = partnerApi;
