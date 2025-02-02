import { api } from "./apiSlice";
const orders = api.injectEndpoints({
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: `/orders/placed-orders`,
        method: "GET",
        timeout: 5000,
      }),
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
