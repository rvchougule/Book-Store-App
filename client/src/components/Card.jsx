/* eslint-disable react/prop-types */
import { TbShoppingBagPlus } from "react-icons/tb";
function Card({ book, style }) {
  return (
    <div className={`${style ? style : ""}`}>
      <img src={book.thumbnail} alt="" className="p-6 rounded-3xl bg-primary" />
      <div className="p-3">
        <div className="flexBetween">
          <h5 className="h5">{book.title.substr(0, 13)}...</h5>
          <TbShoppingBagPlus className="cursor-pointer" />
        </div>
        <div className="flexBetween text-sm text-gray-30 font-semibold">
          <span className="">{book.categories.join("")}</span>
          <span className="text-secondaryOne">₹{book.price}.00</span>
        </div>
        <p className="text-start">{book.description.substr(0, 45)} ...</p>
      </div>
    </div>
  );
}

export default Card;
