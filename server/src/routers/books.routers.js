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
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/publish-book")
  .post(upload.single("thumbnail"), verifyJWT, publishBook);
router
  .route("/:bookId")
  .patch(upload.single("thumbnail"), verifyJWT, updateBook);
router.route("/:bookId").delete(verifyJWT, deleteBook);
router.route("/:bookId").get(getBook);

// todo Changes
router.route("/").get(getAllBooks);
router.route("/category").get(getBooksByCategory);
export default router;
