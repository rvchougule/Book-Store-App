import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orders.controllers.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

const router = Router();

// user routes

router.route("/").get(verifyJWT, getUserOrders);
router.route("/").post(verifyJWT, createOrder);

// admin routes

router.route("/placed-orders").get(verifyAdminJWT, getAllOrders);
router.route("/:orderId").patch(verifyAdminJWT, updateOrderStatus);

export default router;
