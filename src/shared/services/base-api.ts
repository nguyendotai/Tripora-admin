import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/configs/env";
import { logout, setCredentials } from "@/features/auth/store/auth.slice";
import type { RootState } from "@/store/store";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const { accessToken } = refreshResult.data as { accessToken: string };
      const currentUser = (api.getState() as RootState).auth.user;
      api.dispatch(setCredentials({ accessToken, user: currentUser }));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Destination",
    "TravelGuide",
    "Review",
    "BlogPost",
    "User",
    "Provider",
    "Property",
    "Room",
    "RoomInventory",
    "Booking",
    "Tour",
    "TourItinerary",
    "TourSchedule",
    "TourBooking",
    "TourGuide",
    "Experience",
    "ExperienceSchedule",
    "ExperienceBooking",
  ],
  endpoints: () => ({}),
});
