import { api } from "./apiSlice";
const orders = api.injectEndpoints({
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ limit, query, status }) => ({
        url: `/orders/placed-orders?limit=${limit}&query=${query}&status=${status}`,
        method: "GET",
        timeout: 5000,
      }),
      retry: 3,
      providesTags: ["Orders"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}`,
        method: "PATCH",
        body: { status },
      }),
      providesTags: ["Orders"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetOrdersQuery, useUpdateOrderStatusMutation } = orders;
