import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { stripeWebhook } from "./controllers/orders.controllers.js";

const app = express();

// express middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
// app.use(cors());
app.get("/", (req, res) => {
  return res.send("bacala-backend-api");
});
// Stripe Webhook - Needs Raw Body
app.post(
  "/webhook",
  express.raw({ type: "application/json" }), // Apply express.raw() only for this route
  stripeWebhook
);
// app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// JSON Middleware (Applied AFTER Webhook Route)
app.use(express.json({ limit: "1mb" }));

// routes imports
import userRouter from "./routers/user.routers.js";
import adminRouter from "./routers/admin.routers.js";
import bookRouter from "./routers/books.routers.js";
import categoryRouter from "./routers/category.routers.js";
import cartRouter from "./routers/cart.routers.js";
import reviewRouter from "./routers/reviews.routers.js";
import { ApiError } from "./utils/ApiError.js";
import ordersRouter from "./routers/orders.routers.js";

// routes declaration
app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/books", bookRouter);
app.use("/category", categoryRouter);
app.use("/cart", cartRouter);
app.use("/review", reviewRouter);
app.use("/orders", ordersRouter);

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    err.status = err.status || "error";
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      data: err.data,
      errors: err.errors,
      success: err.success,
    });
  }
});

// http://localhost:8000/api/v1/users/register
export { app };
