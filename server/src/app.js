import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// express middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes imports
import userRouter from "./routers/user.routers";
import adminRouter from "./routers/admin.routers.js";
import bookRouter from "./routers/books.routers.js";
import categoryRouter from "./routers/category.routers.js";
import cartRouter from "./routers/cart.routers.js";
import reviewRouter from "./routers/reviews.routers.js";
// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/review", reviewRouter);

// http://localhost:8000/api/v1/users/register
export { app };
