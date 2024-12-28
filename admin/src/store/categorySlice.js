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
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (category) => ({
        url: "/category/",
        method: "POST",
        body: category,
        timeout: 5000,
      }),
    }),
    updateCategory: builder.mutation({
      query: (category) => ({
        url: "/category/:categoryId",
        method: "PATCH",
        body: category,
        timeout: 5000,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (category) => ({
        url: "/category/:categoryId",
        method: "DELETE",
        body: category,
        timeout: 5000,
      }),
    }),
  }),
});
