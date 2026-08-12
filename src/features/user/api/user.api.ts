import { baseApi } from "@/shared/services/base-api";
import type { PaginatedUsers, User, UserStatus } from "../types/user.types";

export interface UserListParams {
  q?: string;
  page?: number;
  limit?: number;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listUsers: builder.query<PaginatedUsers, UserListParams | void>({
      query: (params) => ({ url: "/users", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((u) => ({ type: "User" as const, id: u.id })),
              { type: "User" as const, id: "LIST" },
            ]
          : [{ type: "User" as const, id: "LIST" }],
    }),
    updateUserStatus: builder.mutation<User, { id: string; status: UserStatus }>({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const { useListUsersQuery, useUpdateUserStatusMutation } = userApi;
