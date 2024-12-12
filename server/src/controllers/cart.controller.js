import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Cart } from "../models/cart.model.js";
import mongoose from "mongoose";

// get cart products
const getCartItems = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  if (!userId) {
    throw new ApiError(400, "User ID not provided");
  }

  const pipeline = [
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "books",
        localField: "items.book",
        foreignField: "_id",
        as: "book_details",
      },
    },
    // Add a field to map books and their details
    {
      $addFields: {
        items: {
          $map: {
            input: "$items", // Items array in the cart
            as: "item",
            in: {
              book: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$book_details",
                      as: "book",
                      cond: { $eq: ["$$book._id", "$$item.book"] }, // Match books by ID
                    },
                  },
                  0, // Get the first matched book
                ],
              },
              quantity: "$$item.quantity", // Retain quantity for the item
            },
          },
        },
      },
    },
    // Remove intermediate fields if needed
    {
      $project: {
        book_details: 0, // Remove book_details after mapping
      },
    },
  ];

  try {
    // Execute the aggregation pipeline
    const cartItems = await Cart.aggregate(pipeline);

    if (!cartItems || cartItems.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "No cart items found"));
    }

    // Return the cart items
    return res
      .status(200)
      .json(
        new ApiResponse(200, cartItems[0], "Cart items fetched successfully")
      );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          {},
          `Internal server error while fetching cart items: ${error.message}`
        )
      );
  }
});

// add products
const addItemToCart = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { bookId, quantity } = req.body;

  if (!bookId || !quantity) {
    throw new ApiError(400, "Book ID and quantity are required");
  }

  try {
    const cart = await Cart.findOne({ user: userId });

    if (cart) {
      // Check if the book already exists in the cart
      const itemIndex = cart.items.findIndex(
        (item) =>
          new mongoose.Types.ObjectId(item.book).toString() ===
          new mongoose.Types.ObjectId(bookId).toString()
      );

      if (itemIndex > -1) {
        // If item exists, update the quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // If item does not exist, add to the cart
        cart.items.push({ book: bookId, quantity });
      }

      const updatedCartItem = await cart.save();
      if (!updatedCart) {
        throw new ApiError(500, "Failed to update cart items");
      }
    } else {
      // Create a new cart if it does not exist
      const updatedCart = await Cart.create({
        user: userId,
        items: [{ book: bookId, quantity }],
      });

      if (!updatedCart) {
        throw new ApiError(500, "Failed to add cart items");
      }
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Item added to cart successfully"));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          {},
          `Internal server error while adding item to cart: ${error.message}`
        )
      );
  }
});

// update products

const updateCartItem = asyncHandler(async (req, res) => {
  const { userId } = req.user; // User ID from authenticated request
  const { bookId, quantity } = req.body;

  if (!bookId || !quantity) {
    throw new ApiError(400, "Book ID and quantity are required");
  }

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json(new ApiResponse(404, {}, "Cart not found"));
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.book.toString() === bookId
    );

    if (itemIndex > -1) {
      // Update the quantity of the existing item
      cart.items[itemIndex].quantity = quantity;

      await cart.save();
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Cart item updated successfully"));
    } else {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Item not found in cart"));
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          {},
          `Internal server error while updating cart item: ${error.message}`
        )
      );
  }
});

// delete products
const deleteCartItem = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { bookId } = req.body;

  if (!bookId) {
    throw new ApiError(400, "Book ID is required");
  }

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json(new ApiResponse(404, {}, "Cart not found"));
    }

    // Remove the item from the cart

    cart.items = cart.items.filter(
      (item) =>
        new mongoose.Types.ObjectId(item.book).toString() !==
        new mongoose.Types.ObjectId(bookId).toString()
    );

    const deletedCartItem = await cart.save();
    if (!deletedCartItem) {
      throw new ApiError(500, "Failed to delete cart items");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, deletedCartItem, "Cart item deleted successfully")
      );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          {},
          `Internal server error while deleting cart item: ${error.message}`
        )
      );
  }
});

export { getCartItems, addItemToCart, deleteCartItem };
