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
  }),
  overrideExisting: false,
});

export const {
  useGetBooksQuery,
  useAddBookMutation,
  useDeleteBookMutation,
  useUpdateBookMutation,
  useUpdateThumbnailMutation,
} = book;
