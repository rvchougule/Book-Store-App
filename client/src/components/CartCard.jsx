/* eslint-disable react/prop-types */

import { FaTrash } from "react-icons/fa6";
import { LuBookMinus, LuBookPlus } from "react-icons/lu";
import { useDispatch } from "react-redux";
import {
  decreaseQuantity,
  deleteBook,
  increaseQuantity,
} from "../store/cartSliceReducer";

function CartCard({ book }) {
  const dispatch = useDispatch();
  return (
    <div className="flexStart gap-2 rounded-lg px-2 py-2 w-full my-4 bg-white">
      <img src={book.thumbnail} alt="" className="max-w-16 rounded-md" />
      <div className="w-full">
        <h4 className="h4 !mb-0">{book.title}</h4>
        <div className="flexBetween">
          <p className="w-2/3">{book.categories.join(",")}</p>
          <h5 className="h5 w-1/3">${book.price}</h5>
          <FaTrash
            className="w-1/3"
            onClick={() => dispatch(deleteBook(book))}
          />
        </div>
        <div>
          <span className="flexCenter  rounded-full bg-primary px-0  w-20">
            <LuBookMinus
              className="rounded-full bg-white  text-2xl px-1  shadow-md cursor-pointer"
              onClick={() => {
                dispatch(decreaseQuantity(book));
              }}
            />
            <span className="px-3">{book.quantity}</span>
            <LuBookPlus
              className="rounded-full bg-white  text-2xl px-1 shadow-md cursor-pointer"
              onClick={() => {
                dispatch(increaseQuantity(book));
              }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartCard;
