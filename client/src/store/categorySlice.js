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
  }),
  overrideExisting: false,
});

export const { useGetCategoriesQuery } = category;
