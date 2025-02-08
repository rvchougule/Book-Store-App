import { api } from "./apiSlice";
const orders = api.injectEndpoints({
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ page, query, limit }) => ({
        url: `/orders?page=${page}&limit=${limit}&query=${query}`,
        method: "GET",
        timeout: 5000,
      }),
      retry: 3,
      providesTags: ["Orders"],
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/orders/",
        method: "POST",
        body: body,
        timeout: 5000,
      }),
      providesTags: ["Orders"],
    }),
    createStripeOrder: builder.mutation({
      query: (body) => ({
        url: "/orders/create-checkout/",
        method: "POST",
        body: body,
      }),
      transformErrorResponse: (res) => console.error(res),
      providesTags: ["Orders"],
    }),
    stripeWebhook: builder.mutation({
      query: () => ({
        url: "/webhook",
        method: "POST",
      }),
      providesTags: ["Orders"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useCreateStripeOrderMutation,
  useStripeWebhookMutation,
} = orders;
