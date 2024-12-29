import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const category = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_URL,
    prepareHeaders: (headers) => {
      const token = JSON.parse(localStorage.getItem("access_token"));
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: "/category/",
        method: "GET",
        timeout: 5000,
      }),
      // transformResponse: (response) => console.log(response.data),
      // transformErrorResponse: (response) => response,
      providesTags: ["Category"],
    }),
    addCategory: builder.mutation({
      query: (category) => ({
        url: "/category/",
        method: "POST",
        body: category,
        timeout: 5000,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: (category) => ({
        url: `/category/${category._id}`,
        method: "PATCH",
        body: category,
        timeout: 5000,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (category) => ({
        url: `/category/${category._id}`,
        method: "DELETE",
        body: category,
        timeout: 5000,
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = category;
