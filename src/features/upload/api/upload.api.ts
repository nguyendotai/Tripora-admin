import { baseApi } from "@/shared/services/base-api";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<{ url: string }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return { url: "/uploads/image", method: "POST", body: formData };
      },
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
