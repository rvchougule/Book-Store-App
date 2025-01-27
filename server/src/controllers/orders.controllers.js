import { Order } from "../models/orders.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

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
  const userId = req.user._id; // Extract user ID from request
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortType = 1,
  } = req.query;

  try {
    // Build aggregation pipeline
    const pipeline = [
      {
        $match: {
          user: userId, // Match orders for the specific user
        },
      },
      {
        $unwind: "$books", // Deconstruct the books array to process each book individually
      },
      {
        $lookup: {
          from: "books", // Name of the books collection
          localField: "books.book", // Match each book's ID from the books array
          foreignField: "_id", // The _id field in the books collection
          as: "bookDetails", // Output array containing matched book details
        },
      },
      {
        $unwind: "$bookDetails", // Deconstruct bookDetails array to merge with the books array
      },
      {
        $group: {
          _id: "$_id", // Group back by the order ID
          user: { $first: "$user" },
          totalPrice: { $first: "$totalPrice" },
          status: { $first: "$status" },
          shippingAddress: { $first: "$shippingAddress" },
          paymentMethod: { $first: "$paymentMethod" },
          paymentStatus: { $first: "$paymentStatus" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          books: {
            $push: {
              book: "$books.book",
              quantity: "$books.quantity",
              details: "$bookDetails", // Add the matched book details
            },
          },
        },
      },
      {
        $sort: {
          [sortBy]: Number(sortType), // Apply dynamic sorting
        },
      },
    ];

    // Pagination options
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      customLabels: {
        totalDocs: "totalOrders",
        docs: "orders",
      },
    };

    // Use aggregatePaginate with the pipeline and options
    const orders = await Order.aggregatePaginate(
      Order.aggregate(pipeline),
      options
    );

    console.log("Orders fetched:", orders);

    // Check if no orders are found
    if (!orders || orders.orders.length === 0) {
      return res.status(404).json(new ApiResponse(404, {}, "No orders found"));
    }

    // Successfully fetched orders
    res
      .status(200)
      .json(new ApiResponse(200, orders, "Successfully fetched orders"));
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json(
        new ApiError(500, `Error fetching orders. Details: ${error.message}`)
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
