import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import enquiryRoutes from "./routes/enquiryRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(express.json());

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB connected successfully");
};

// Make sure MongoDB is connected before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection error:", error);

    res.status(500).json({
      message: "Database connection failed"
    });
  }
});

app.use("/api/enquiries", enquiryRoutes);
app.use("/api/auth", authRoutes);

export default app;