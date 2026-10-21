import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import enquiryRoutes from "./routes/enquiryRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// -----------------------------
// CORS CONFIGURATION
// -----------------------------

const envOrigins = (
  process.env.CLIENT_URLS ||
  process.env.CLIENT_URL ||
  ""
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  // Production frontend
  "https://gore-and-associate.vercel.app",

  // Local Vite development
  "http://localhost:5173",

  // Optional origins from environment variables
  ...envOrigins
]);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header.
    // This is useful for server-to-server requests.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    // Do not throw an Express error for a blocked browser origin.
    // Simply omit CORS permission.
    return callback(null, false);
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ],

  optionsSuccessStatus: 204
};

// CORS must run before API routes and before
// middleware that could reject the OPTIONS request.
app.use(cors(corsOptions));

// -----------------------------
// BODY PARSER
// -----------------------------

app.use(express.json());

// -----------------------------
// MONGODB CONNECTION
// -----------------------------

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

// -----------------------------
// DATABASE MIDDLEWARE
// -----------------------------

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error(
      "MongoDB connection error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

// -----------------------------
// API ROUTES
// -----------------------------

app.use(
  "/api/enquiries",
  enquiryRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

// -----------------------------
// EXPORT APP
// -----------------------------

export default app;
