import { configureStore } from "@reduxjs/toolkit";
import { auth } from "./authSlice";
import { category } from "./categorySlice";
import { book } from "./bookSlice";

export const store = configureStore({
  reducer: {
    [auth.reducerPath]: auth.reducer,
    [category.reducerPath]: category.reducer,
    [book.reducerPath]: book.reducer,
  },
  middleware: (getDefualtMiddleware) =>
    getDefualtMiddleware().concat(
      auth.middleware,
      category.middleware,
      book.middleware
    ),
});
