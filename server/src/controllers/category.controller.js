import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";

// publish categories
const publishCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Category Name is required");
  }

  const category = await Category.create({
    name,
    description,
  });

  if (!category) {
    throw new ApiError(500, "Failed to create category");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category created successfully"));
});

// update categories

const updateCategory = asyncHandler(async (req, res) => {
  const { _id: categoryId, name, description } = req.body;

  if (!categoryId && !name && !description) {
    throw new ApiError(400, "Category Id, Name and description is required");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    {
      $set: {
        name,
        description,
      },
    },
    {
      new: true,
    }
  );

  if (!updateCategory) {
    throw new ApiError(500, "Failed to find category");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateCategory, "Category updated"));
});

// delete categories
const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    throw new ApiError(400, "Category id not provided");
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const deleteCategory = await Category.findByIdAndDelete(category);

  if (!deleteCategory) {
    throw new ApiError(500, "Failed to delete category");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "deleted Category successfully"));
});

// get categories

const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 }); // Sort categories alphabetically by name

    if (!categories || categories.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "No categories found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, categories, "Categories fetched successfully")
      );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          {},
          `Internal server error while fetching categories: ${error.message}`
        )
      );
  }
});

export { publishCategory, updateCategory, deleteCategory, getAllCategories };
