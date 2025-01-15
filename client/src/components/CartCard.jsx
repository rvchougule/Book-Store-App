/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { LuBookMinus, LuBookPlus } from "react-icons/lu";

function CartCard({ book }) {
  const [quantity, setQuantity] = useState(0);
  return (
    <div className="flexStart gap-2 rounded-lg px-2 py-2 w-full my-4 bg-white">
      <img src={book.image} alt="" className="max-w-16 rounded-md" />
      <div className="w-full">
        <h4 className="h4 !mb-0">{book.name}</h4>
        <div className="flexBetween">
          <p>{book.category}</p>
          <h5 className="h5">${book.price}</h5>
          <FaTrash />
        </div>
        <div>
          <span className="flexCenter  rounded-full bg-primary px-0  w-20">
            <LuBookMinus
              className="rounded-full bg-white  text-2xl px-1  shadow-md cursor-pointer"
              onClick={() => {
                if (quantity > 1) {
                  setQuantity(quantity - 1);
                }
              }}
            />
            <span className="px-3">{quantity}</span>
            <LuBookPlus
              className="rounded-full bg-white  text-2xl px-1 shadow-md cursor-pointer"
              onClick={() => {
                setQuantity(quantity + 1);
              }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartCard;
