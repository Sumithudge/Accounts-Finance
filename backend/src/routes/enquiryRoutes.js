import express from "express";

import {
  createEnquiry,
  getEnquiries
} from "../controllers/enquiryController.js";

import { adminAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createEnquiry);

// ADMIN ONLY
router.get("/", adminAuth, getEnquiries);

export default router;