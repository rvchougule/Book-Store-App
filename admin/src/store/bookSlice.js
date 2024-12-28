import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const book = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_URL,
    prepareHeaders: (headers) => {
      const token = JSON.parse(localStorage.getItem("access_token"));

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    addBook: builder.mutation({
      query: (book) => ({
        url: "/books/publish-book",
        method: "POST",
        body: book,
        timeout: 5000,
      }),
    }),
    updateBook: builder.mutation({
      query: (book) => ({
        url: "/books/:bookId",
        method: "PATCH",
        body: book,
        timeout: 5000,
      }),
    }),
    deleteBook: builder.mutation({
      query: (book) => ({
        url: "/books/:bookId",
        method: "DELETE",
        body: book,
        timeout: 5000,
      }),
    }),
  }),
});

export const {
  useAddBookMutation,
  useDeleteBookMutation,
  useUpdateBookMutation,
} = book;
