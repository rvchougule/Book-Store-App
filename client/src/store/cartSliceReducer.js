import { createSlice } from "@reduxjs/toolkit";

const findBookIndex = (state, id) => {
  return state.cart.findIndex((book) => book._id === id);
};
const cartSlice = createSlice({
  name: "cartSlice",
  initialState: {
    loading: false,
    cart: JSON.parse(localStorage.getItem("cart")) || [],
    errors: "",
  },
  reducers: {
    addBook(state, action) {
      const bookIndex = findBookIndex(state, action?.payload?._id);

      if (bookIndex !== -1) {
        state.cart[bookIndex].quantity = state.cart[bookIndex]?.quantity + 1;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    increaseQuantity(state, action) {
      const bookIndex = findBookIndex(state, action?.payload?._id);
      if (bookIndex !== -1) {
        state.cart[bookIndex].quantity = state.cart[bookIndex].quantity + 1;
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    decreaseQuantity(state, action) {
      const bookIndex = findBookIndex(state, action?.payload?._id);
      if (bookIndex !== -1) {
        if (state.cart[bookIndex].quantity > 1) {
          state.cart[bookIndex].quantity = state.cart[bookIndex].quantity - 1;
        } else {
          state.cart.splice(bookIndex, 1);
        }
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    deleteBook(state, action) {
      const bookIndex = findBookIndex(state, action?.payload?._id);
      if (bookIndex !== -1) {
        state.cart.splice(bookIndex, 1);
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
  },
});

export const { addBook, increaseQuantity, decreaseQuantity, deleteBook } =
  cartSlice.actions;

export const selectTotalQuantity = (state) => {
  return state.cart.cart.reduce((total, book) => total + book.quantity, 0);
};

export default cartSlice.reducer;
