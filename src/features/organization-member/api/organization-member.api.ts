import { baseApi } from "@/shared/services/base-api";
import type { OrganizationMember, OrgMemberRole } from "../types/organization-member.types";

export interface CreateOrganizationMemberInput {
  email: string;
  role: OrgMemberRole;
}

export const organizationMemberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listOrganizationMembers: builder.query<OrganizationMember[], void>({
      query: () => "/providers/members",
      providesTags: (result) =>
        result
          ? [
              ...result.map((m) => ({ type: "OrganizationMember" as const, id: m.id })),
              { type: "OrganizationMember" as const, id: "LIST" },
            ]
          : [{ type: "OrganizationMember" as const, id: "LIST" }],
    }),
    createOrganizationMember: builder.mutation<OrganizationMember, CreateOrganizationMemberInput>({
      query: (body) => ({ url: "/providers/members", method: "POST", body }),
      invalidatesTags: [{ type: "OrganizationMember", id: "LIST" }],
    }),
    updateOrganizationMemberRole: builder.mutation<
      OrganizationMember,
      { id: string; role: OrgMemberRole }
    >({
      query: ({ id, role }) => ({ url: `/providers/members/${id}`, method: "PATCH", body: { role } }),
      invalidatesTags: [{ type: "OrganizationMember", id: "LIST" }],
    }),
    removeOrganizationMember: builder.mutation<void, string>({
      query: (id) => ({ url: `/providers/members/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "OrganizationMember", id: "LIST" }],
    }),
  }),
});

export const {
  useListOrganizationMembersQuery,
  useCreateOrganizationMemberMutation,
  useUpdateOrganizationMemberRoleMutation,
  useRemoveOrganizationMemberMutation,
} = organizationMemberApi;
