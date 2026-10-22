import express from "express";

import {
  createReview,
  getApprovedReviews,
  getAllReviews,
  updateReviewApproval,
  deleteReview
} from "../controllers/reviewController.js";

import { adminAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getApprovedReviews);
router.post("/", createReview);

router.get("/admin", adminAuth, getAllReviews);
router.patch("/:id/approval", adminAuth, updateReviewApproval);
router.delete("/:id", adminAuth, deleteReview);

export default router;
