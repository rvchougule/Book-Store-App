import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const auth = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1",
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
});

export const { useSignUpMutation, useLoginMutation, useRefreshTokenMutation } =
  auth;
