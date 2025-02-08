import { api } from "./apiSlice.js";
const category = api.injectEndpoints({
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: "/category/",
        method: "GET",
        timeout: 5000,
      }),
      retry: 3,
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
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
        body: category,
        timeout: 5000,
      }),
      invalidatesTags: ["Category"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = category;
