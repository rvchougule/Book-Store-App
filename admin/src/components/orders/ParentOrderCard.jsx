/* eslint-disable react/prop-types */
import { useState } from "react";
import OrderCard from "./OrderCard";
import { useUpdateOrderStatusMutation } from "../../store/orderSlice";
import { toast } from "react-toastify";

function ParentOrderCard({ order }) {
  const user = order?.user;
  const address = order?.shippingAddress;
  const [orderStatus, setOrderStatus] = useState("");
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleChangeInOrderStatus = (e) => {
    setOrderStatus(e.target.value);
    const status = e.target.value;

    if (orderStatus !== order?.status) {
      updateOrderStatus({ orderId: order?._id, status })
        .then((res) => {
          if (res.error) {
            toast.error(res?.error?.data?.message);
          } else {
            const data = res?.data;
            toast.success(data?.message);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error(err);
        });
    }
  };

  return (
    <div>
      <h5 className="h5">{new Date(order.createdAt).toDateString()}</h5>
      <div className="flex gap-8 items-start  p-4 m-4 bg-white">
        <div className="">
          {/* user */}
          <div className="flex items-start  gap-4 shadow-lg px-4 py-2 mb-4">
            <img src={user.avatar} className="max-w-12 rounded-full" alt="" />
            <div className="">
              <p className="font-bold text-gray-30">Name: {user?.fullName}</p>
              <p className="font-bold text-gray-30">Email: {user?.email}</p>
            </div>
          </div>

          {/* shipping address */}
          <div className="flex flex-col items-start  gap-2 shadow-lg px-4 py-2 mb-4">
            <p className="font-bold text-gray-30">Street: {address.street}</p>
            <p className="font-bold text-gray-30">City: {address?.city}</p>
            <p className="font-bold text-gray-30">State: {address.state}</p>
            <p className="font-bold text-gray-30">
              Zip Code: {address.zipCode}
            </p>
            <p className="font-bold text-gray-30">
              Country: {address?.country}
            </p>

            {/*  other Details*/}

            <p className="font-bold text-gray-30">
              Payment Method: {order?.paymentMethod}
            </p>
            <p className="font-bold text-gray-30">
              Payment Status: {order?.paymentStatus}
            </p>
            <p className="font-bold text-gray-30">
              Total Price: {order?.totalPrice}
            </p>
          </div>

          <div className="flex flex-col items-start  gap-2 shadow-lg px-4 py-2 mb-4">
            <p className={`font-bold text-gray-30`}>
              Order Status :{" "}
              <select
                name="orderStatus"
                id="orderStatus"
                value={orderStatus || order?.status}
                onChange={handleChangeInOrderStatus}
              >
                <option value="pending">Pending</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </p>
          </div>
        </div>
        <div className=" p-2">
          {order?.books?.map((book, i) => {
            return (
              <OrderCard
                key={i}
                book={book}
                status={order.status}
                paymentMethod={order.paymentMethod}
                date={new Date(order.createdAt).toDateString()}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ParentOrderCard;
