import { baseApi } from '@/shared/services/base-api';
import type {
  CreateDestinationInput,
  Destination,
  PaginatedResult,
  UpdateDestinationInput,
} from '../types/destination.types';

export const destinationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listDestinations: builder.query<PaginatedResult<Destination>, { q?: string } | void>({
      query: (params) => ({
        url: '/destinations',
        params: { limit: 50, ...(params?.q ? { q: params.q } : {}) },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((item) => ({ type: 'Destination' as const, id: item.id })),
              { type: 'Destination' as const, id: 'LIST' },
            ]
          : [{ type: 'Destination' as const, id: 'LIST' }],
    }),
    createDestination: builder.mutation<Destination, CreateDestinationInput>({
      query: (body) => ({ url: '/destinations', method: 'POST', body }),
      invalidatesTags: [{ type: 'Destination', id: 'LIST' }],
    }),
    updateDestination: builder.mutation<Destination, { id: string; body: UpdateDestinationInput }>({
      query: ({ id, body }) => ({ url: `/destinations/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Destination', id },
        { type: 'Destination', id: 'LIST' },
      ],
    }),
    deleteDestination: builder.mutation<void, string>({
      query: (id) => ({ url: `/destinations/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Destination', id: 'LIST' }],
    }),
  }),
});

export const {
  useListDestinationsQuery,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
} = destinationApi;
