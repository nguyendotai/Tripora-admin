export {
  useListDestinationsQuery,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
} from './api/destination.api';
export { destinationFormSchema } from './schemas/destination.schema';
export type { DestinationFormValues } from './schemas/destination.schema';
export type { Destination, PaginatedResult, PaginationMeta } from './types/destination.types';
