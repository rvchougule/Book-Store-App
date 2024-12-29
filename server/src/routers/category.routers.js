import { Router } from "express";

import {
  publishCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/category.controller.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// router.use(verifyJWT);
router.route("/").get(getAllCategories);
router.route("/").post(publishCategory);
router.route("/:categoryId").patch(updateCategory);
router.route("/:categoryId").delete(deleteCategory);

export default router;
