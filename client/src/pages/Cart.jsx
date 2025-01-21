import CartCard from "../components/CartCard";
import { Link } from "react-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
function Cart() {
  const cartBooks = useSelector((state) => state.cart);

  // Footer bg color setup
  useEffect(() => {
    const footerContainer = document.getElementById("footer");
    footerContainer.style.backgroundColor = "#f8f6fb";

    return () => {
      footerContainer.style.backgroundColor = "white";
    };
  }, []);
  return (
    <section className="max-padd-container py-24 bg-primary">
      <h2 className="h2">
        Cart <span className="text-secondary !font-light">List</span>
      </h2>
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
            <span className="text-gray-30 font-bold">$150</span>
          </div>
          <div className="flexBetween border-b-2 ">
            <span className="h5">Shipping Fee:</span>{" "}
            <span className="text-gray-30 font-bold">$5</span>
          </div>
          <div className="flexBetween border-b-2">
            <span className="h5">Total:</span>{" "}
            <span className="text-gray-30 font-bold">$155</span>
          </div>
        </div>
        <div className="py-4">
          <Link className="btn-secondaryOne ">Proceed to Checkout</Link>
        </div>
      </div>
    </section>
  );
}

export default Cart;
