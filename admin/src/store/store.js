import { configureStore } from "@reduxjs/toolkit";
import { auth } from "./authSlice";

export const store = configureStore({
  reducer: {
    [auth.reducerPath]: auth.reducer,
  },
  middleware: (getDefualtMiddleware) =>
    getDefualtMiddleware().concat(auth.middleware),
});
