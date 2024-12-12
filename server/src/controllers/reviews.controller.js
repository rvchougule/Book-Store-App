import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/reviews.model.js";
import { Book } from "../models/books.model.js";

// publish review
const publishReview = asyncHandler(async (req, res) => {
  const { userId, bookId, rating, comment } = req.body;

  if ([userId, bookId, rating, comment].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields required");
  }

  const review = await Review.create({
    user: new mongoose.Types.ObjectId(userId),
    book: new mongoose.Types.ObjectId(bookId),
    rating,
    comment,
  });

  if (!review) {
    throw new ApiError(500, "Failed to publish review");
  }

  return res.status(200).json(new ApiResponse(201, review, "Review published"));
});

// update review

const updateReview = asyncHandler(async (req, res) => {
  const { reviewId, bookId, rating, comment } = req.body;
  const userId = req.user?._id;

  if (
    [reviewId, bookId, rating, comment].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields required");
  }

  const book = await Book.findById(bookId);

  if (!book) {
    throw new ApiError(400, "Book not found");
  }

  const updatedReview = await Review.findByIdAndUpdate(
    reviewId,
    {
      $set: {
        rating,
        comment,
      },
    },
    {
      new: true,
    }
  );

  if (!updateReview) {
    throw new ApiError(500, "Failed to update review");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateReview, "Review updated"));
});

// delete review

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const deletedReview = await Review.findById(reviewId);

  if (!deletedReview) {
    throw new ApiError(500, "Failed to delete review");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deleteReview, "Review deleted"));
});

export { publishReview, updateReview, deleteReview };
