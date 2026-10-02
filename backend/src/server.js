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
    origin: process.env.CLIENT_URL
  })
);

app.use(express.json());

app.use("/api/enquiries", enquiryRoutes);
app.use("/api/auth", authRoutes);

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });

  } catch (error) {
    console.error(
      "Server startup error:",
      error
    );
  }
};

startServer();
export default app;