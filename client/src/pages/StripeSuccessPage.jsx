import { useEffect } from "react";
import { MdDone } from "react-icons/md";
import { useDispatch } from "react-redux";
import { removeCartItems } from "../store/cartSliceReducer";

function StripeSuccessPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.removeItem("cart");
    dispatch(removeCartItems());
  }, []);
  return (
    <div className="flex  items-center justify-center min-h-screen ">
      <div className="flex flex-col items-center justify-center p-20 border-2 rounded-lg bg-primary">
        <div className="p-4 rounded-full bg-green-400">
          <MdDone className="text-white text-4xl " />
        </div>
        <span className="text-3xl font-bold">Checkout Successfully</span>
      </div>
    </div>
  );
}

export default StripeSuccessPage;
