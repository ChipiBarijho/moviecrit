const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
// Controller
const reviewsController = require("../controllers/reviews");
// Middleware
const { verifyUser } = require("../authenticate");

// Routes
router.post("/new", verifyUser, reviewsController.newReview);
router
  .route("/:reviewId")
  .delete(verifyUser, reviewsController.deleteReview)
  .put(verifyUser, reviewsController.editReview);

router
  .route("/:reviewId/like")
  .post(catchAsync(reviewsController.addLike))
  .delete(verifyUser, reviewsController.removeLike);

router.get("/latest", reviewsController.latestReviews);

module.exports = router;
