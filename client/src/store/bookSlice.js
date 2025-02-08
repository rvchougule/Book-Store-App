import { api } from "./apiSlice";
const book = api.injectEndpoints({
  tagTypes: ["Book"],
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: ({ page, query, limit, categoryId }) => ({
        url: `/books?page=${page}&limit=${limit}&query=${query}&categoryId=${categoryId}`,
        method: "GET",
      }),
      retry: 3,
      providesTags: ["Book"],
    }),
    getNewArrivals: builder.query({
      query: () => ({
        url: "/books?limit=7&sortType=-1",
        method: "GET",
        timeout: 5000,
      }),
      retry: 3,
      providesTags: ["Book"],
    }),
    getTopBook: builder.query({
      query: () => ({
        url: "/books/top-book",
        method: "GET",
      }),
      retry: 3,
      providesTags: ["Book"],
    }),
    getPopularBooks: builder.query({
      query: () => ({
        url: "/books?limit=7&sortType=1",
        method: "GET",
        timeout: 5000,
      }),
      retry: 3,
      providesTags: ["Book"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBooksQuery,
  useGetNewArrivalsQuery,
  useGetPopularBooksQuery,
  useGetTopBookQuery,
} = book;
