const express = require('express');
const {
  createProductReview,
  getProductReviews
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// mergeParams: true allows accessing :productId from parent router
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getProductReviews)
  .post(protect, createProductReview);

module.exports = router;
