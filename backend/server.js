import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import promoRouter from "./routes/promoRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import analyticsRouter from "./routes/analyticsRoute.js";
import mongoose from "mongoose";

// app config
const app = express();
const port = process.env.PORT || 4000;

// Database Health Check Middleware
app.use((req, res, next) => {
  // Allow root route to bypass DB status checks
  if (req.path === "/") return next();
  
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database is offline. Please check your MongoDB Atlas IP Whitelist (Network Access) to ensure 'Allow Access from Anywhere' (0.0.0.0/0) is active, or verify your MONGO_URL credentials in your Render environment variables."
    });
  }
  next();
});


// middlewares
app.use(express.json());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5174",
  "http://localhost:5175"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Dynamic reflect: Allow request origin if it matches allowed lists, is localhost, or if origin is null (postman/curl)
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:") || allowedOrigins.length === 0) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);



// DB connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/promo", promoRouter);
app.use("/api/review", reviewRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server Started on port: ${port}`);
});
