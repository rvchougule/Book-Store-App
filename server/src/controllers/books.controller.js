import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteInCloudinary } from "../utils/cloudinary.js";

import { Book } from "../models/books.model.js";
import fs from "fs";
import { Order } from "../models/orders.model.js";
import mongoose from "mongoose";

// create book
const publishBook = asyncHandler(async (req, res) => {
  const {
    title,
    author,
    genre,
    publishedDate,
    isbn,
    pages,
    languages,
    description,
    publisher,
    availableCopies = 0,
    category,
    price,
  } = req.body;

  try {
    if (
      [
        title,
        genre,
        publishedDate,
        isbn,
        pages,
        description,
        publisher,
        availableCopies,
        price,
        author,
        category,
        languages,
      ].some((field) => field.toString().trim() === "")
    ) {
      throw new ApiError(401, "All fields are required");
    }

    const thumbnailPath = req.file?.path;

    if (!thumbnailPath) {
      throw new ApiError(400, "thumbnail required");
    }

    const thumbnail = await uploadOnCloudinary(thumbnailPath);

    if (!thumbnail.url) {
      throw new ApiError(500, "Server failed to upload the Book Thumbnail");
    }

    const book = await Book.create({
      title,
      author,
      genre,
      publishedDate,
      isbn,
      pages,
      languages,
      description,
      publisher,
      thumbnail: thumbnail.url,
      availableCopies,
      category,
      price,
    });

    if (!book) {
      throw new ApiError(500, "Failed to publish the Book");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, book, "The book published Successfully !"));
  } catch (error) {
    console.log(error);
    fs.unlinkSync(req.file?.path);
    throw new ApiError(500, `Error while publishing book ${error}`);
  }
});

// update book
const updateBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  const {
    title,
    author,
    genre,
    publishedDate,
    isbn,
    pages,
    languages,
    description,
    publisher,
    availableCopies = 0,
    category,
    price,
  } = req.body;

  try {
    if (
      [
        title,
        genre,
        publishedDate,
        isbn,
        pages,
        description,
        publisher,
        availableCopies,
        price,
        author,
        category,
        languages,
      ].some((field) => field?.toString().trim() === "")
    ) {
      throw new ApiError(401, "All fields are required");
    }

    const book = await Book.findById(bookId);

    if (!book) {
      throw new ApiError(404, "Book not found");
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        $set: {
          title,
          author,
          genre,
          publishedDate,
          isbn,
          pages,
          languages,
          description,
          publisher,
          availableCopies,
          category,
          price,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedBook) {
      throw new ApiError(500, "Failed to update the Book");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedBook, "Book updated successfully"));
  } catch (err) {
    console.log(err);
  }
});

// update book avatar
const updateBookThumbnail = asyncHandler(async (req, res) => {
  try {
    const { bookId } = req.params;

    const thumbnailPath = req.file?.path;

    const book = await Book.findById(bookId);

    if (!book) {
      throw new ApiError(404, "Book not found");
    }

    if (!thumbnailPath) {
      throw new ApiError(400, "thumbnail required");
    }

    const thumbnail = await uploadOnCloudinary(thumbnailPath);

    if (!thumbnail.url) {
      throw new ApiError(500, "Server failed to upload the Book Thumbnail");
    }

    // TODO:Delete old thumbnail from the cloudinary

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        $set: {
          thumbnail: thumbnail.url,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedBook) {
      throw new ApiError(500, "Failed to update the Thumbnails of Book");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedBook, "Book thumbnail updated successfully")
      );
  } catch (err) {
    fs.unlinkSync(req.file?.path);
  }
});

// delete book
const deleteBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  if (!bookId) {
    throw new ApiError(400, "book id is required");
  }

  const book = await Book.findById(bookId);

  if (!book) {
    throw new ApiError(404, "Book Details not found");
  }

  // const deleteThumbnail = await deleteInCloudinary(book.thumbnail);

  // console.log(deleteThumbnail);
  // if (!deleteThumbnail.result !== "ok") {
  //   throw new ApiError(
  //     500,
  //     "Failed to delete thumbnail from cloudinary server"
  //   );
  // }

  const deleteBookField = await Book.findByIdAndDelete(bookId);

  if (!deleteBookField) {
    throw new ApiError(500, "Failed to delete book");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deleteBookField, "Book deleted successfully"));
});

// get book
const getBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  if (!bookId) {
    throw new ApiError(400, "Book id not provided");
  }

  let pipeline = [
    // Match the specific book by its ID
    {
      $match: {
        _id: new mongoose.Types.ObjectId(bookId), // Replace bookId with the specific ID
      },
    },
    // Lookup reviews for the book
    {
      $lookup: {
        from: "reviews", // Collection name for reviews
        localField: "_id", // Book's _id
        foreignField: "book", // Book field in the review
        as: "book_reviews", // Output array
      },
    },
    // Lookup category details for the book
    {
      $lookup: {
        from: "categories", // Collection name for categories
        localField: "category", // Book's category field
        foreignField: "_id", // Category's _id
        as: "category_details", // Output array
      },
    },
    // Add fields for reviews and mapped category names
    {
      $addFields: {
        reviews: "$book_reviews",
        categories: {
          $map: {
            input: "$category_details",
            as: "category",
            in: "$$category.name", // Extract name from category
          },
        },
      },
    },
    // Clean up the response by removing unnecessary fields if needed
    {
      $project: {
        book_reviews: 0, // Optional: Remove intermediate lookup fields
        category_details: 0, // Optional: Remove intermediate lookup fields
      },
    },
  ];

  try {
    const options = {
      page: 1,
      limit: 1,
      customLabels: {
        totalDocs: "totalBooks",
        docs: "book",
      },
    };
    //   TODO :check aggregated values
    const result = await Book.aggregatePaginate(
      Book.aggregate(pipeline),
      options
    );

    if (result?.book?.length === 0) {
      return res.status(404).json(new ApiResponse(404, {}, "NO Book found"));
    }

    return res.status(200).json(new ApiResponse(200, result, "Books Fetched"));
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          {},
          `Internal server error in video aggregation:- ${error.message}`
        )
      );
  }
});

// get all books
const getAllBooks = asyncHandler(async (req, res) => {
  const {
    categoryId,
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = 1,
  } = req.query;

  let matchFilter = {};
  if (query) {
    matchFilter.$or = [
      { title: { $regex: query, $options: "i" } },
      { author: { $regex: query, $options: "i" } },
    ];
  }

  // Validate and add category filter separately
  if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
    matchFilter.category = { $in: [new mongoose.Types.ObjectId(categoryId)] };
  }

  let pipeline = [
    { $match: matchFilter },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "book",
        as: "book_reviews",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "book_reviews.user",
        foreignField: "_id",
        as: "review_users",
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category_details",
      },
    },
    {
      $addFields: {
        reviews: {
          $map: {
            input: "$book_reviews",
            as: "review",
            in: {
              rating: "$$review.rating",
              comment: "$$review.comment",
              user: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$review_users",
                      as: "user",
                      cond: { $eq: ["$$user._id", "$$review.user"] },
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
        categories: {
          $map: {
            input: "$category_details",
            as: "category",
            in: "$$category.name",
          },
        },
      },
    },
    {
      $project: {
        book_reviews: 0,
        review_users: 0,
        category_details: 0,
      },
    },
    {
      $sort: {
        [sortBy]: Number(sortType),
      },
    },
  ];

  try {
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      customLabels: {
        totalDocs: "totalBooks",
        docs: "books",
      },
    };

    const result = await Book.aggregatePaginate(
      Book.aggregate(pipeline),
      options
    );

    if (!result || result?.books?.length === 0) {
      return res.status(404).json(new ApiResponse(404, {}, "No books found"));
    }

    return res.status(200).json(new ApiResponse(200, result, "Books Fetched"));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          {},
          `Internal server error in book aggregation: ${error.message}`
        )
      );
  }
});

const getBooksByCategory = asyncHandler(async (req, res) => {
  const {
    categoryId,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortType = 1,
  } = req.query;

  // Validate the categoryId parameter
  if (!categoryId) {
    throw new ApiError(400, "Category ID not provided");
  }

  // Build the aggregation pipeline
  const pipeline = [
    // Match books by the specified categoryId
    {
      $match: {
        category: mongoose.Types.ObjectId(categoryId),
      },
    },
    // Lookup category details to include category name
    {
      $lookup: {
        from: "categories", // Collection name for categories
        localField: "category", // Book's category field
        foreignField: "_id", // Category's _id
        as: "category_details", // Output array
      },
    },
    // Add category names to the book document
    {
      $addFields: {
        categories: {
          $map: {
            input: "$category_details",
            as: "category",
            in: "$$category.name", // Extract category name
          },
        },
      },
    },
    // Clean up unnecessary fields
    {
      $project: {
        category_details: 0, // Remove intermediate lookup data
      },
    },
    // Sort by the specified field and order
    {
      $sort: {
        [sortBy]: Number(sortType), // Dynamic sorting based on query
      },
    },
  ];

  try {
    // Pagination options
    const options = {
      page: parseInt(page, 10), // Convert page to integer
      limit: parseInt(limit, 10), // Convert limit to integer
      customLabels: {
        totalDocs: "totalBooks",
        docs: "books",
      },
    };

    // Execute the pipeline with pagination
    const result = await Book.aggregatePaginate(
      Book.aggregate(pipeline),
      options
    );

    // Check if books are found
    if (!result || result.books.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "No books found in this category"));
    }

    // Return the successful response
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Books fetched by category"));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          {},
          `Internal server error in fetching books by category: ${error.message}`
        )
      );
  }
});

const getMostSellingBook = asyncHandler(async (req, res) => {
  try {
    const mostSellingBook = await Order.aggregate([
      { $unwind: "$books" }, // Unwind the books array to count individual book sales
      {
        $group: {
          _id: "$books.book",
          totalSold: { $sum: "$books.quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" }, // Extract book details
      { $sort: { totalSold: -1 } }, // Sort by highest sales
      { $limit: 1 }, // Get the top-selling book
    ]);

    if (!mostSellingBook.length) {
      return res
        .status(404)
        .json(new ApiError(404, "No sales data available for books"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          mostSellingBook[0],
          "Most selling book fetched successfully"
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(
        new ApiError(500, `Error fetching most selling book: ${error.message}`)
      );
  }
});

export {
  publishBook,
  updateBook,
  updateBookThumbnail,
  deleteBook,
  getBook,
  getAllBooks,
  getBooksByCategory,
  getMostSellingBook,
};
