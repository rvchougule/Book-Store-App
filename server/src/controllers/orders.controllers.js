import { Order } from "../models/orders.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import Stripe from "stripe";

// Stripe connection
const stripe = new Stripe(process.env.SECRET_KEY);

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

// on complete paymentStatus should be paid

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (
    !["pending", "out_for_delivery", "delivered", "cancelled"].includes(status)
  ) {
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
    sortType = -1,
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
  const {
    page = 1,
    limit = 10,
    query = "",
    status = "",
    sortBy = "createdAt",
    sortType = 1,
  } = req.query;

  try {
    // Build match conditions based on query and status
    let matchConditions = {};
    if (query) {
      matchConditions.$or = [
        { "user.fullName": { $regex: query, $options: "i" } },
        { "user.email": { $regex: query, $options: "i" } },
        { "shippingAddress.city": { $regex: query, $options: "i" } },
      ];
    }
    if (status) {
      matchConditions.status = status;
    }

    // Build aggregation pipeline
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: matchConditions,
      },
      {
        $lookup: {
          from: "books",
          localField: "books.book",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $addFields: {
          books: {
            $map: {
              input: "$books",
              as: "bookItem",
              in: {
                $mergeObjects: [
                  "$$bookItem",
                  {
                    details: {
                      $arrayElemAt: [
                        "$bookDetails",
                        {
                          $indexOfArray: [
                            "$bookDetails._id",
                            "$$bookItem.book",
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          bookDetails: 0, // Remove separate bookDetails field
        },
      },
      {
        $sort: { [sortBy]: Number(sortType) },
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

    // Fetch paginated orders
    const orders = await Order.aggregatePaginate(
      Order.aggregate(pipeline),
      options
    );

    res
      .status(200)
      .json(new ApiResponse(200, orders, "Successfully fetched orders"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, `Error fetching orders: ${error.message}`));
  }
});

// controller for payment checkout
export const createStripeCheckout = asyncHandler(async (req, res) => {
  const { books, totalPrice, shippingAddress, paymentMethod } = req.body;

  try {
    // to pass to metadata
    const filteredCartBooks = books?.map((book) => {
      return { book: book._id, quantity: book.quantity };
    });

    if (!books && books?.length === 0) {
      console.log("No books");
      throw new ApiError(401, "No books found");
    }

    const customer = await stripe.customers.create({
      metadata: {
        userId: JSON.stringify(req.user._id),
        cart: JSON.stringify(filteredCartBooks),
      },
    });

    const lineItems = books?.map((book) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: book.title,
          images: [book.thumbnail],
          metadata: {
            id: book._id,
          },
        },
        unit_amount: book.price * 100,
      },
      quantity: book.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "KE"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "inr",
            },
            display_name: "Free shipping",
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "inr",
            },
            display_name: "Next day air",
            // Delivers in exactly 1 business day
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.REDIRECT_URL}/stripe-success`,
      cancel_url: `${process.env.REDIRECT_URL}/stripe-cancel`,
      customer: customer.id,
      metadata: {
        data: JSON.stringify({
          books: filteredCartBooks,
          totalPrice,
          shippingAddress,
          paymentMethod,
        }),
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { id: session.id },
          "Checkout Object create Successfully!"
        )
      );
  } catch (e) {
    console.error(e);
    return res.status(500).json(new ApiError(500, "Checkout Error: " + e));
  }
});

export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  console.log("body", req.body);
  let data;
  let eventType;

  if (sig) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET // Your webhook secret from Stripe
      );
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      return res
        .status(400)
        .json(new ApiError(400, `Webhook Error: ${err.message}`));
    }
    console.log(event);
    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  // console.log("data", data);
  console.log("eventType", eventType);

  try {
    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          try {
            console.log("customer", customer);
            console.log("data", data);
            // CREATE ORDER
            // createOrder(customer, data);
          } catch (err) {
            // console.log(typeof createOrder);
            console.log(err);
          }
        })
        .catch((err) => console.log(err.message));
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json(new ApiResponse(200, {}, "Received event"));
  } catch (err) {
    console.log(err);
  }
});
