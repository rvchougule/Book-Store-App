/* eslint-disable react/prop-types */
import { CURRENCY_TYPE } from "../../constants.js";

function OrderCard({ book }) {
  const bookInfo = book?.details;

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg px-2 py-2 w-full my-4 bg-white">
      <img
        src={bookInfo?.thumbnail}
        alt=""
        className="max-w-16 xs:max-w-12 rounded-md"
      />
      <div className="w-full flex flex-col md:flex-row justify-between ">
        <div className="w-full py-1">
          <h4 className="h4 !mb-0">{bookInfo?.title}</h4>
          <div className="flex flex-col xs:flex-row gap-2 py-1">
            <h6 className="h6">
              Price:{" "}
              <span className="text-gray-30">
                {CURRENCY_TYPE}
                {bookInfo?.price}
              </span>
            </h6>
            <h6 className="h6">
              Quantity: <span className="text-gray-30">{book?.quantity}</span>{" "}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
