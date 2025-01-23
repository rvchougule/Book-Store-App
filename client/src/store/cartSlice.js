// import { api } from "./apiSlice";

// const cart = api.injectEndpoints({
//   tagTypes: ["cart"],
//   endpoints: (builder) => ({
//     getCartItems: builder.query({
//       query: () => ({
//         url: "/cart/",
//         method: "GET",
//         timeout: 5000,
//       }),
//       providesTags: ["cart"],
//     }),
//     addCartItem: builder.mutation({
//       query: (item) => ({
//         url: "/cart/",
//         method: "POST",
//         body: item,
//         timeout: 5000,
//       }),
//       invalidatesTags: ["cart"],
//     }),
//     updateCartItem: builder.mutation({
//       query: ({ _id, quantity }) => ({
//         url: `/cart/${_id}`,
//         method: "PATCH",
//         body: { quantity },
//         timeout: 5000,
//       }),
//       invalidatesTags: ["cart"],
//     }),
//     deleteCartItem: builder.mutation({
//       query: (_id) => ({
//         url: `/cart/${_id}`,
//         method: "DELETE",
//         timeout: 5000,
//       }),
//       invalidatesTags: ["cart"],
//     }),
//   }),
// });
