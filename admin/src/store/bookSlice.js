import { api } from "./apiSlice";
const book = api.injectEndpoints({
  tagTypes: ["Book"],
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: () => ({
        url: "/books/",
        method: "GET",
        timeout: 5000,
      }),
      providesTags: ["Book"],
    }),
    addBook: builder.mutation({
      query: (book) => ({
        url: "/books/publish-book",
        method: "POST",
        body: book,
        timeout: 5000,
      }),

      invalidatesTags: ["Book"],
    }),
    updateBook: builder.mutation({
      query: (book) => ({
        url: "/books/:bookId",
        method: "PATCH",
        body: book,
        timeout: 5000,
      }),
      invalidatesTags: ["Book"],
    }),
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE",
        timeout: 5000,
      }),
      invalidatesTags: ["Book"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBooksQuery,
  useAddBookMutation,
  useDeleteBookMutation,
  useUpdateBookMutation,
} = book;
