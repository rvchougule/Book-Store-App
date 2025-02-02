import { useEffect, useRef, useState } from "react";
import { CURRENCY_TYPE, SHIPPING_FEES } from "../constants";
import {
  removeCartItems,
  totalCartBooksPrice,
} from "../store/cartSliceReducer";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import {
  useCreateOrderMutation,
  useCreateStripeOrderMutation,
} from "../store/ordersSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import useFooterBgColor from "../hooks/useFooterBgColor";
import { loadStripe } from "@stripe/stripe-js";

const fields = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
};

const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First Name is required")
    .min(2, "First Name must be at least 2 characters")
    .max(50, "First Name can't exceed 50 characters"),
  lastName: yup
    .string()
    .required("Last Name is required")
    .min(2, "Last Name must be at least 2 characters")
    .max(50, "Last Name can't exceed 50 characters"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^\+?[0-9]{7,15}$/, "Phone Number must be valid")
    .required("Phone Number is required"),
  street: yup
    .string()
    .required("Street is required")
    .max(100, "Street can't exceed 100 characters"),
  city: yup
    .string()
    .required("City is required")
    .max(50, "City can't exceed 50 characters"),
  state: yup
    .string()
    .required("State is required")
    .max(50, "State can't exceed 50 characters"),
  zipCode: yup
    .string()
    .matches(
      /^\d{6}(-\d{4})?$/,
      "Zip Code must be valid (e.g., 12345 or 12345-6789)"
    )
    .required("Zip Code is required"),
  country: yup
    .string()
    .required("Country is required")
    .max(50, "Country can't exceed 50 characters"),
});
function PlaceOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartBooks = useSelector((state) => state.cart);
  const cartTotal = useSelector(totalCartBooksPrice);
  const [createOrder] = useCreateOrderMutation();
  const [createStripeOrder] = useCreateStripeOrderMutation();

  const [formData, setFormData] = useState({ ...fields });
  const [errors, setErrors] = useState({ ...fields });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const filteredCartBooks = useRef([]);

  // Data filtering for order
  useEffect(() => {
    const books = cartBooks?.cart?.map((book) => {
      return { book: book._id, quantity: book.quantity };
    });
    filteredCartBooks.current = books;
  }, [cartBooks]);

  const handleInputs = (e) => {
    const { name, value } = e.target;

    setErrors({ ...fields });

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const makePayment = async (order) => {
    const stripe = await loadStripe(import.meta.env.VITE_API_KEY);

    createStripeOrder(order)
      .then((res) => {
        if (res.error) {
          toast.error(res?.error?.data?.message);
        } else {
          const session = res?.data?.data;

          const result = stripe.redirectToCheckout({
            sessionId: session.id,
          });

          if (result.error) {
            console.log(result.error);
          }
          // toast.success(res?.data?.message);
          // setErrors({ ...fields });

          // navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    validationSchema
      .validate(formData, { abortEarly: false })
      .then(() => {
        // Api func
        if (paymentMethod === "COD") {
          const order = {
            books: filteredCartBooks.current,
            totalPrice: cartTotal,
            shippingAddress: formData,
            paymentMethod,
            paymentDetails: {},
          };
          createOrder(order)
            .then((res) => {
              if (res.error) {
                toast.error(res?.error?.data?.message);
              } else {
                toast.success(res?.data?.message);
                setErrors({ ...fields });
                localStorage.removeItem("cart");
                dispatch(removeCartItems());
                navigate("/");
              }
            })
            .catch((err) => {
              console.log(err);
              toast.error(err);
            });
        } else {
          const order = {
            books: cartBooks?.cart,
            totalPrice: cartTotal,
            shippingAddress: formData,
            paymentMethod,
          };
          makePayment(order);
        }
      })
      .catch((err) => {
        console.log(err);
        const formattedErrors = err?.inner?.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setErrors(formattedErrors);
      });
  };

  // Footer bg color setup
  useFooterBgColor();
  return (
    <form
      className="max-padd-container py-24 bg-primary lg:flex gap-20 "
      onSubmit={handleSubmit}
    >
      {/* delivary information */}
      <section className="lg:w-1/2">
        <h2 className="h2">
          Delivery{" "}
          <span className="text-secondary !font-light">Information</span>
        </h2>
        <section className="mt-8">
          <div className="flexBetween gap-x-2 ">
            <div className="w-full">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="grey-input-order"
                value={formData.firstName}
                onChange={handleInputs}
              />
              {errors?.firstName && (
                <p className="!text-red-600 mb-2">{errors?.firstName}</p>
              )}
            </div>
            <div className="w-full">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="grey-input-order"
                value={formData.lastName}
                onChange={handleInputs}
              />
              {errors?.lastName && (
                <p className="!text-red-600 mb-2">{errors?.lastName}</p>
              )}
            </div>
          </div>
          <div className="w-full">
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="grey-input-order"
              value={formData.email}
              onChange={handleInputs}
            />
            {errors?.email && (
              <p className="!text-red-600 mb-2">{errors?.email}</p>
            )}
          </div>
          <div className="">
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              className="grey-input-order"
              value={formData.phoneNumber}
              onChange={handleInputs}
            />
            {errors?.phoneNumber && (
              <p className="!text-red-600 mb-2">{errors?.phoneNumber}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="street"
              placeholder="Street"
              className="grey-input-order"
              value={formData.street}
              onChange={handleInputs}
            />
            {errors?.street && (
              <p className="!text-red-600 mb-2">{errors?.street}</p>
            )}
          </div>

          <div className="flexBetween gap-x-2 gap-y-2">
            <div className="w-full">
              <input
                type="text"
                name="city"
                placeholder="City"
                className="grey-input-order"
                value={formData.city}
                onChange={handleInputs}
              />
              {errors?.city && (
                <p className="!text-red-600 mb-2">{errors?.city}</p>
              )}
            </div>
            <div className="w-full">
              <input
                type="text"
                name="state"
                placeholder="State"
                className="grey-input-order"
                value={formData.state}
                onChange={handleInputs}
              />
              {errors?.state && (
                <p className="!text-red-600 mb-2">{errors?.state}</p>
              )}
            </div>
          </div>
          <div className="flexBetween gap-x-2 gap-y-2">
            <div className="w-full">
              <input
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                className="grey-input-order"
                value={formData.zipCode}
                onChange={handleInputs}
              />
              {errors?.zipCode && (
                <p className="!text-red-600 mb-2">{errors?.zipCode}</p>
              )}
            </div>
            <div className="w-full">
              <input
                type="text"
                name="country"
                placeholder="Country"
                className="grey-input-order"
                value={formData.country}
                onChange={handleInputs}
              />
              {errors?.country && (
                <p className="!text-red-600 mb-2">{errors?.country}</p>
              )}
            </div>
          </div>
        </section>
      </section>
      {/* cart total */}
      <section className="lg:w-1/2">
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
        <h2 className="h4 mt-4">Payment Method</h2>
        <div className="flex gap-4 py-4">
          <button
            className={`${
              paymentMethod !== "STRIPE" ? "btn-outline" : "btn-secondary"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setPaymentMethod("STRIPE");
            }}
          >
            Stripe
          </button>
          <button
            className={`${
              paymentMethod !== "COD" ? "btn-outline" : "btn-secondary"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setPaymentMethod("COD");
            }}
          >
            Cash on Delivery
          </button>
        </div>
        <button className="btn-secondaryOne !rounded-md">Place Order</button>
      </section>
    </form>
  );
}

export default PlaceOrder;
