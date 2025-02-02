import express, { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  createStripeCheckout,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orders.controllers.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

const router = Router();

// user routes

router.route("/").get(verifyJWT, getUserOrders);
router.route("/").post(verifyJWT, createOrder);
router.route("/create-checkout").post(verifyJWT, createStripeCheckout);
// router
//   .route("/webhook")
//   .post(express.raw({ type: "application/json" }), stripeWebhook);

// admin routes
router.route("/placed-orders").get(verifyAdminJWT, getAllOrders);
router.route("/:orderId").patch(verifyAdminJWT, updateOrderStatus);

export default router;
