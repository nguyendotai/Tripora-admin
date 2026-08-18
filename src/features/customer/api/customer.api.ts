import { baseApi } from "@/shared/services/base-api";
import type { ProviderCustomer } from "../types/customer.types";

/** V7 vòng 7 — 1 Provider chỉ thuộc đúng 1 ProviderType nên chỉ cần gọi đúng 1 endpoint domain
 * tương ứng, không cần gộp 5 domain phía Frontend. */
const CUSTOMERS_PATH: Record<string, string> = {
  HOTEL: "/bookings/provider/customers",
  TOUR: "/tour-bookings/provider/customers",
  ACTIVITY: "/experience-bookings/provider/customers",
  TRANSPORT: "/transport-bookings/provider/customers",
  FLIGHT: "/flight-bookings/provider/customers",
};

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyCustomers: builder.query<ProviderCustomer[], string | undefined>({
      query: (providerType) => CUSTOMERS_PATH[providerType ?? "HOTEL"] ?? CUSTOMERS_PATH.HOTEL,
    }),
  }),
});

export const { useListMyCustomersQuery } = customerApi;
