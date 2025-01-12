import { api } from "./apiSlice";

const auth = api.injectEndpoints({
  tagTypes: ["auth"],
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => ({
        url: "/user/current-user",
        method: "GET",
        timeout: 5000,
      }),
      providesTags: ["auth"],
    }),
    signUp: builder.mutation({
      query: (user) => ({
        url: "/user/register",
        method: "POST",
        body: user,
        timeout: 5000,
      }),
    }),
    login: builder.mutation({
      query: (user) => ({
        url: "/user/login",
        method: "POST",
        body: user,
        timeout: 5000,
      }),
      invalidatesTags: ["auth"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
        timeout: 5000,
      }),
    }),
    refreshToken: builder.mutation({
      query: (body) => ({
        url: "/user/refresh-token",
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
  useSignUpMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = auth;
