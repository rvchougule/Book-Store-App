import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteInCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

import { Book } from "../models/books.model.js";
import { Review } from "../models/reviews.model.js";

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

  const thumbnailPath = req.files?.thumbnail?.[0].path;

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

  const thumbnailPath = req.files?.thumbnail?.[0].path;

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

  if (!verifyId) {
    throw new ApiError(400, "book id is required");
  }

  const book = await Book.findById(bookId);

  if (book) {
    throw new ApiError(404, "Book Details bot found");
  }

  const deleteThumbnail = await deleteInCloudinary(book.thumbnail);

  if (!deleteThumbnail.result !== "ok") {
    throw new ApiError(
      500,
      "Failed to delete thumbnail from cloudinary server"
    );
  }

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
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "book",
        as: "book_reviews",
      },
    },
    {
      $addFields: {
        reviews: "$book_reviews",
      },
    },
  ];

  try {
    //   TODO :check aggregated values
    const result = await Book.aggregatePaginate(Book.aggregate(pipeline));

    if (result?.books?.length === 0) {
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
const getAllBooks = asyncHandler(async (req, res) => {});

// get books by catrgory
const getBooksByCategory = asyncHandler(async (req, res) => {});
