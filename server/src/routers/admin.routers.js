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
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);

// secured routes
router.route("/refresh-token").post(verifyAdminJWT, refreshAccessToken);
router.route("/logout").post(verifyAdminJWT, logout);
router.route("/change-password").post(verifyAdminJWT, changePassword);
router.route("/current-user").get(verifyAdminJWT, getCurrentUser);
router.route("/update-account").patch(verifyAdminJWT, updateAccountDetails);
router
  .route("/update-avatar")
  .patch(verifyAdminJWT, upload.single("avatar"), updateUserAvatar);

export default router;
