import { api } from "./apiSlice";

const auth = api.injectEndpoints({
  tagTypes: ["auth"],
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => ({
        url: "/admin/current-user",
        method: "GET",
        timeout: 5000,
      }),
      providesTags: ["auth"],
    }),
    getDashBoardData: builder.query({
      query: () => ({
        url: "/admin/",
        method: "GET",
        timeout: 5000,
      }),
      providesTags: ["auth"],
    }),
    signUp: builder.mutation({
      query: (user) => ({
        url: "/admin/register",
        method: "POST",
        body: user,
        timeout: 5000,
      }),
    }),
    login: builder.mutation({
      query: (user) => ({
        url: "/admin/login",
        method: "POST",
        body: user,
        timeout: 5000,
      }),
      invalidatesTags: ["auth"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
        timeout: 5000,
      }),
    }),
    refreshToken: builder.mutation({
      query: (body) => ({
        url: "/admin/refresh-token",
        method: "POST",
        body: body,
        timeout: 5000,
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetCurrentUserQuery,
  useGetDashBoardDataQuery,
  useSignUpMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = auth;
