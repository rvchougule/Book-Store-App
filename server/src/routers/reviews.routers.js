import { Router } from "express";

import {
  publishReview,
  updateReview,
  deleteReview,
} from "../controllers/reviews.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(publishReview);
router.route("/:reviewId").patch(updateReview);
router.route("/:reviewId").delete(deleteReview);

export default router;
