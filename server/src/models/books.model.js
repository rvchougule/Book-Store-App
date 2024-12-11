import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const booksSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Author name must be provided"],
    trim: true,
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    trim: true,
  },
  publishedDate: {
    type: Date,
  },
  isbn: {
    type: String,
    unique: true, // Ensure ISBN is unique
    required: [true, "ISBN is required"],
  },
  pages: {
    type: Number,
  },
  language: {
    type: [String], // Array of strings
    default: ["English"], // Default to English if no languages are provided
  },
  description: {
    type: String,
    required: false,
  },
  publisher: {
    type: String,
    required: false,
  },
  availableCopies: {
    type: Number,
    default: 1, // Default to 1 copy available
    min: [0, "Available copies cannot be negative"],
  },
});

booksSchema.plugin(mongooseAggregatePaginate);

export const Book = mongoose.model("Book", booksSchema);
