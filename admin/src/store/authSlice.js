import { api } from "./apiSlice";

const auth = api.injectEndpoints({
  tagTypes: ["auth"],
  endpoints: (builder) => ({
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
    }),
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: "/admin/refresh-token",
        method: "POST",
        body: refreshToken,
        timeout: 5000,
      }),
    }),
  }),

  overrideExisting: false,
});

export const { useSignUpMutation, useLoginMutation, useRefreshTokenMutation } =
  auth;
