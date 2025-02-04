/* eslint-disable react/prop-types */
import { TbShoppingBagPlus } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { addBook } from "../store/cartSliceReducer";
import { CURRENCY_TYPE } from "../constants";

function Card({ book, style }) {
  const dispatch = useDispatch();
  return (
    <div className={`${style ? style : ""}`}>
      <img
        src={book?.thumbnail}
        alt=""
        className="p-6 rounded-3xl bg-primary w-full object-cover"
      />
      <div className="p-3">
        <div className="flexBetween ">
          <h5 className="h5">{book?.title?.substr(0, 13)}...</h5>
          <div
            className="cursor-pointer hover:bg-gray-10 hover:transform hover:scale-125 p-1"
            onClick={() => dispatch(addBook(book))}
          >
            <TbShoppingBagPlus />
          </div>
        </div>
        <div className="flexBetween text-sm text-gray-30 font-semibold">
          <span className="text-left">{book?.categories?.join("")}</span>
          <span className="text-secondaryOne">
            {CURRENCY_TYPE}
            {book?.price}.00
          </span>
        </div>
        <p className="text-start">{book?.description?.substr(0, 45)} ...</p>
      </div>
    </div>
  );
}

export default Card;
