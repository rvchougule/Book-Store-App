import { Router } from "express";

import {
  publishBook,
  updateBook,
  deleteBook,
  getBook,
  getAllBooks,
  getBooksByCategory,
  updateBookThumbnail,
  publishMultipleBooks,
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
router
  .route("/thumbnail/:bookId")
  .patch(upload.single("thumbnail"), verifyAdminJWT, updateBookThumbnail);
router.route("/:bookId").delete(verifyAdminJWT, deleteBook);

router
  .route("/publish-mul-books")
  .post(upload.array("thumbnails", 10), verifyAdminJWT, publishMultipleBooks);

export default router;
