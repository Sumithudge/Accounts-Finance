import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  try {
    const {
      name,
      service,
      rating,
      review
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    if (!service || !service.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please select a service"
      });
    }

    const numericRating = Number(rating);

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    if (!review || review.trim().length < 8) {
      return res.status(400).json({
        success: false,
        message: "Please write a review of at least 8 characters"
      });
    }

    const savedReview = await Review.create({
      name: name.trim(),
      service: service.trim(),
      rating: numericRating,
      review: review.trim(),
      approved: false
    });

    return res.status(201).json({
      success: true,
      message: "Thank you. Your review has been submitted for approval.",
      review: savedReview
    });
  } catch (error) {
    console.error("ERROR CREATING REVIEW:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
      error: error.message
    });
  }
};

export const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review
      .find({ approved: true })
      .sort({ createdAt: -1 });

    const total = reviews.length;
    const average =
      total > 0
        ? Number(
            (
              reviews.reduce((sum, item) => sum + item.rating, 0) / total
            ).toFixed(1)
          )
        : 0;

    return res.status(200).json({
      success: true,
      count: total,
      average,
      reviews
    });
  } catch (error) {
    console.error("ERROR FETCHING APPROVED REVIEWS:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews"
    });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review
      .find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error("ERROR FETCHING ALL REVIEWS:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews"
    });
  }
};

export const updateReviewApproval = async (req, res) => {
  try {
    const { approved } = req.body;

    if (typeof approved !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "approved must be true or false"
      });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: approved
        ? "Review approved"
        : "Review hidden",
      review
    });
  } catch (error) {
    console.error("ERROR UPDATING REVIEW:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update review"
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted"
    });
  } catch (error) {
    console.error("ERROR DELETING REVIEW:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete review"
    });
  }
};
