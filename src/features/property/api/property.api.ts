import { baseApi } from '@/shared/services/base-api';
import type { Property } from '../types/property.types';

export const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listPendingProperties: builder.query<Property[], void>({
      query: () => ({ url: '/properties/pending' }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: 'Property' as const, id: item.id })),
              { type: 'Property' as const, id: 'LIST' },
            ]
          : [{ type: 'Property' as const, id: 'LIST' }],
    }),
    approveProperty: builder.mutation<Property, string>({
      query: (id) => ({ url: `/properties/${id}/approve`, method: 'PATCH' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Property', id },
        { type: 'Property', id: 'LIST' },
      ],
    }),
    rejectProperty: builder.mutation<Property, { id: string; reason: string }>({
      query: ({ id, reason }) => ({ url: `/properties/${id}/reject`, method: 'PATCH', body: { reason } }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Property', id },
        { type: 'Property', id: 'LIST' },
      ],
    }),
  }),
});

export const { useListPendingPropertiesQuery, useApprovePropertyMutation, useRejectPropertyMutation } =
  propertyApi;
