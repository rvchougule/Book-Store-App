import { Router } from "express";

import {
  publishBook,
  updateBook,
  deleteBook,
  getBook,
  getAllBooks,
  getBooksByCategory,
} from "../controllers/books.controller.js";
import { upload } from "../middlewares/multer.middelware.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

const router = Router();
router.route("/:bookId").get(getBook);

// todo Changes
router.route("/").get(getAllBooks);
router.route("/category").get(getBooksByCategory);

// protected routes

router
  .route("/publish-book")
  .post(upload.single("thumbnail"), verifyAdminJWT, publishBook);
router.route("/:bookId").patch(verifyAdminJWT, updateBook);
router.route("/:bookId").delete(verifyAdminJWT, deleteBook);

export default router;
