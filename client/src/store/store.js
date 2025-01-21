import { configureStore } from "@reduxjs/toolkit";
import { api } from "./apiSlice";
import cartSlice from "./cartSliceReducer";

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefualtMiddleware) =>
    getDefualtMiddleware().concat(api.middleware),
});
