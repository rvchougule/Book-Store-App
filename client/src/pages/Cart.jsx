import CartCard from "../components/CartCard";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { totalCartBooksPrice } from "../store/cartSliceReducer";
import { CURRENCY_TYPE, SHIPPING_FEES } from "../constants";
import { useAuthContext } from "../hooks/useAuthContext";
import useFooterBgColor from "../hooks/useFooterBgColor";
function Cart() {
  const cartBooks = useSelector((state) => state.cart);
  const cartTotal = useSelector(totalCartBooksPrice);

  const { accessToken } = useAuthContext();

  // Footer bg color setup
  useFooterBgColor();
  return (
    <section className="max-padd-container py-24 bg-primary">
      <h2 className="h2">
        Cart <span className="text-secondary !font-light">List</span>
      </h2>
      {/* cart items */}
      <div className="">
        {cartBooks.cart.map((book) => {
          return <CartCard key={book._id} book={book} />;
        })}
      </div>

      {/* cart total */}
      <div className="md:w-1/2 py-8">
        <h2 className="h2">
          Cart <span className="text-secondary !font-light">Total</span>
        </h2>
        <div className="flex flex-col gap-4 py-4">
          <div className="flexBetween border-b-2">
            <span className="h5">SubTotal:</span>{" "}
            <span className="text-gray-30 font-bold">
              {CURRENCY_TYPE}
              {cartTotal}
            </span>
          </div>
          <div className="flexBetween border-b-2 ">
            <span className="h5">Shipping Fee:</span>{" "}
            <span className="text-gray-30 font-bold">
              {CURRENCY_TYPE}
              {SHIPPING_FEES}
            </span>
          </div>
          <div className="flexBetween border-b-2">
            <span className="h5">Total:</span>{" "}
            <span className="text-gray-30 font-bold">
              {CURRENCY_TYPE}
              {cartTotal + SHIPPING_FEES}
            </span>
          </div>
        </div>
        <div className="py-4">
          <Link
            to={accessToken ? "/place-order" : "/login"}
            className={`btn-secondaryOne ${
              cartBooks.cart.length == 0
                ? "!bg-gray-20 !text-gray-30 pointer-events-none"
                : "pointer-events-auto"
            } `}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Cart;
