import { baseApi } from '@/shared/services/base-api';
import type { CreatePropertyInput, Property, UpdatePropertyInput } from '../types/property.types';

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
    listMyProperties: builder.query<Property[], void>({
      query: () => ({ url: '/properties/mine' }),
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
    createProperty: builder.mutation<Property, CreatePropertyInput>({
      query: (body) => ({ url: '/properties', method: 'POST', body }),
      invalidatesTags: [{ type: 'Property', id: 'LIST' }],
    }),
    updateProperty: builder.mutation<Property, { id: string; body: UpdatePropertyInput }>({
      query: ({ id, body }) => ({ url: `/properties/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Property', id },
        { type: 'Property', id: 'LIST' },
      ],
    }),
    deleteProperty: builder.mutation<void, string>({
      query: (id) => ({ url: `/properties/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Property', id: 'LIST' }],
    }),
  }),
});

export const {
  useListPendingPropertiesQuery,
  useListMyPropertiesQuery,
  useApprovePropertyMutation,
  useRejectPropertyMutation,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
} = propertyApi;
