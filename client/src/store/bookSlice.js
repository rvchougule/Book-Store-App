import { api } from "./apiSlice";
const book = api.injectEndpoints({
  tagTypes: ["Book"],
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: ({ page, query, limit }) => ({
        url: `/books?page=${page}&limit=${limit}&query=${query}`,
        method: "GET",
        timeout: 5000,
      }),
      providesTags: ["Book"],
    }),
    getNewArrivals: builder.query({
      query: () => ({
        url: "/books?limit=7&sortType=-1",
        method: "GET",
        timeout: 5000,
      }),
      providesTags: ["Book"],
    }),
    getPopularBooks: builder.query({
      query: () => ({
        url: "/books?limit=7&sortType=1",
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
  useGetNewArrivalsQuery,
  useGetPopularBooksQuery,
} = book;
