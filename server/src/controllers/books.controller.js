import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteInCloudinary } from "../utils/cloudinary.js";

import { Book } from "../models/books.model.js";

// create book
const publishBook = asyncHandler(async (req, res) => {
  const {
    title,
    author,
    genre,
    publishedDate,
    isbn,
    pages,
    language,
    description,
    publisher,
    availableCopies = 0,
    category,
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
      ].some((field) => field.trim() === "") &&
      !author.length &&
      !language.length &&
      !category.length
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
      language,
      description,
      publisher,
      thumbnail: thumbnail.url,
      availableCopies,
      category,
    });

    if (!book) {
      throw new ApiError(500, "Failed to publish the Book");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, book, "The book published Successfully !"));
  } catch (error) {
    console.log(error);
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
    language,
    description,
    publisher,
    availableCopies = 0,
    category,
  } = req.body;

  if (
    !(
      [
        title,
        genre,
        publishedDate,
        isbn,
        pages,
        description,
        publisher,
        availableCopies,
      ].some((filed) => filed.trim() === "") &&
      !author.length &&
      !language.length &&
      !category.length
    )
  ) {
    throw new ApiError(401, "All fields are required");
  }

  const book = await Book.findById(bookId);

  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  const thumbnailPath = req.file?.path;

  if (!thumbnailPath) {
    throw new ApiError(400, "thumbnail required");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailPath);

  if (!thumbnail.url) {
    throw new ApiError(500, "Server failed to upload the Book Thumbnail");
  }

  const deleteOldThumbnail = await deleteInCloudinary(book.thumbnail);

  if (!deleteOldThumbnail) {
    throw new ApiError(500, "Failed to delete the Book Thumbnail");
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
        language,
        description,
        publisher,
        thumbnail: thumbnail.url,
        availableCopies,
        category,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedBook) {
    throw new ApiError(500, "Failed to update the Book");
  }

  return res.status(
    (200).json(new ApiResponse(200, updatedBook, "Book updated successfully"))
  );
});

// update book avatar
const updateBookAvatar = asyncHandler(async (req, res) => {});

// update book quantity
const updateBookQuantity = asyncHandler(async (req, res) => {});

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

// get books
const getAllBooks = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = 1,
  } = req.query;

  // Build the match filter for a fuzzy search on the book title or other fields
  let matchFilter = {
    $or: [
      { title: { $regex: query, $options: "i" } }, // Case-insensitive search in the title
      { author: { $regex: query, $options: "i" } }, // Case-insensitive search in author
    ],
  };

  // Define the aggregation pipeline
  let pipeline = [
    // Match books based on the query filter
    {
      $match: matchFilter,
    },
    // Lookup reviews and populate the user for each review
    {
      $lookup: {
        from: "reviews", // Collection for reviews
        localField: "_id", // Book's _id
        foreignField: "book", // Book field in reviews
        as: "book_reviews",
      },
    },
    {
      $lookup: {
        from: "users", // Collection for users
        localField: "book_reviews.user", // User reference in reviews
        foreignField: "_id",
        as: "review_users",
      },
    },
    // Lookup categories and populate the category names
    {
      $lookup: {
        from: "categories", // Collection for categories
        localField: "category", // Book's category field
        foreignField: "_id", // Category's _id
        as: "category_details",
      },
    },
    // Add fields for populated data and map ObjectId references to documents
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
            in: "$$category.name", // Map category ObjectId to category name
          },
        },
      },
    },
    // Clean up unnecessary fields
    {
      $project: {
        book_reviews: 0,
        review_users: 0,
        category_details: 0,
      },
    },
    // Sort by the specified field and type
    {
      $sort: {
        [sortBy]: Number(sortType), // Use dynamic sorting field and type
      },
    },
  ];

  // Execute the pipeline with pagination
  try {
    const options = {
      page: parseInt(page, 10), // Convert page to integer
      limit: parseInt(limit, 10), // Convert limit to integer
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

export {
  publishBook,
  updateBook,
  deleteBook,
  getBook,
  getAllBooks,
  getBooksByCategory,
};
