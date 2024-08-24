const express = require("express");
const router = express.Router({mergeParams: true});
const listing = require("../models/listing");
const wrapAsync = require("../utilities/wrapAsync");
const review = require("../models/review");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middlewares");
const { createReview, destroyReview } = require("../controllers/reviews");


// POST ROUTE REVIEW
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(createReview)
);

// DELETE REVIEW
router.delete(
  "/:reviewId",
  isReviewAuthor,
  wrapAsync(destroyReview)
);

module.exports = router;