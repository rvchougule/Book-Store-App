import { Order } from "../models/orders.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// Controller to create a new order

export const createOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  const {
    books,
    totalPrice,
    shippingAddress,
    paymentMethod,
    paymentDetails = {},
  } = req.body;

  if (!books || books.length === 0) {
    return res.status(400).json(new ApiError(400, "No books in the order."));
  }

  try {
    const savedOrder = await Order.create({
      user,
      books,
      totalPrice,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
      status: "pending",
      paymentDetails,
    });

    res
      .status(201)
      .json(new ApiResponse(201, savedOrder, "Order placed successfully!"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiError(500, `Error while Placing order :-${error.message}`));
  }
});

// Controller to update order status (admin only)

// on complete paymentStatus should be paid

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!["pending", "completed", "cancelled"].includes(status)) {
    return res.status(400).json(new ApiError(400, "Invalid order status."));
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json(new ApiError(404, "Order not found."));
    }

    order.status = status;

    const updatedOrder = await order.save();
    res.status(200).json(new ApiResponse(200, updatedOrder, "Order updated"));
  } catch (error) {
    res.status(500).json(new ApiError(500, error.message));
  }
});

// Controller to get all orders (user view)
export const getUserOrders = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  try {
    const orders = await Order.find({ user: userId }).populate("books.book");
    res
      .status(200)
      .json(new ApiResponse(200, orders, "successfully fetched orders"));
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(500, `Error fetching orders. error: ${error.message}`)
      );
  }
});
// Controller to get all orders (admin view)

export const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find().populate("user books.book");
    res
      .status(200)
      .json(new ApiResponse(200, orders, "successfully fetched orders"));
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(500, `Error fetching all orders. error: ${error.message}`)
      );
  }
});
