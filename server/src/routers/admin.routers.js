import { Router } from "express";

import {
  registerUser,
  loginUser,
  logout,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
} from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.middelware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("login").post(loginUser);

// secured routes
router.route("/refresh-token").post(verifyJWT, refreshAccessToken);
router.route("/logout").post(verifyJWT, logout);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

export default router;
