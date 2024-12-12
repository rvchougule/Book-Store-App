import { Router } from "express";

import {
  getCartItems,
  addItemToCart,
  deleteCartItem,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, getCartItems);
router.route("/").post(verifyJWT, addItemToCart);
router.route("/:bookId").delete(verifyJWT, deleteCartItem);

export default router;
