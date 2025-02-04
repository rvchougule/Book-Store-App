/* eslint-disable react/prop-types */
import { CURRENCY_TYPE } from "../constants";

function OrderCard({ book, status, paymentMethod, date }) {
  const bookInfo = book?.details;
  return (
    <div className="flexStart gap-4 rounded-lg px-2 py-2 w-full my-4 bg-white">
      <img
        src={bookInfo?.thumbnail}
        alt=""
        className="max-w-20 xs:max-w-12 rounded-md"
      />
      <div className="w-full flex flex-col md:flex-row justify-between ">
        <div className="w-full py-1">
          <h4 className="h4 !mb-0">{bookInfo.title}</h4>
          <div className="flex flex-col xs:flex-row gap-2 py-1">
            <h6 className="h6">
              Price:{" "}
              <span className="text-gray-30">
                {CURRENCY_TYPE}
                {bookInfo.price}
              </span>
            </h6>
            <h6 className="h6">
              Quantity: <span className="text-gray-30">{book.quantity}</span>{" "}
            </h6>
            <h6 className="h6">
              Payment: <span className="text-gray-30">{paymentMethod}</span>
            </h6>
          </div>

          {/* thrid row */}
          <div>
            <h6 className="py-1 h6">
              Date: <span className="text-gray-30">{date}</span>
            </h6>
          </div>
        </div>

        {/* Second part */}
        <div className="w-full  flex flex-col xs:flex-row items-center justify-end  gap-2">
          <div className="flex items-center justify-end gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                status === "pending"
                  ? "bg-secondary"
                  : status === "cancelled"
                  ? "bg-red-600"
                  : "bg-green-600"
              }`}
            ></div>
            <p className="">
              {status === "pending"
                ? "Order Placed"
                : status === "cancelled"
                ? "Cancelled"
                : "Completed"}
            </p>
          </div>
          <button className="bg-secondaryOne py-1 px-2 cursor-pointer rounded-full medium-14">
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
