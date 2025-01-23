import { api } from "./apiSlice";

const auth = api.injectEndpoints({
  tagTypes: ["auth"],
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => ({
        url: "/users/current-user",
        method: "GET",
        timeout: 5000,
      }),
      transformErrorResponse: (res) => console.error(res),
      providesTags: ["auth"],
    }),
    signUp: builder.mutation({
      query: (user) => ({
        url: "/users/register",
        method: "POST",
        body: user,
        timeout: 5000,
      }),
    }),
    login: builder.mutation({
      query: (user) => ({
        url: "/users/login",
        method: "POST",
        body: user,
        timeout: 5000,
      }),
      invalidatesTags: ["auth"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/users/logout",
        method: "POST",
        timeout: 5000,
      }),
    }),
    refreshToken: builder.mutation({
      query: (body) => ({
        url: "/users/refresh-token",
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
