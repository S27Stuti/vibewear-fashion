const express = require('express');
const {
  createProductReview,
  getProductReviews
} = require('../controllers/reviewController');
const { optionalAuth } = require('../middleware/authMiddleware');

// mergeParams: true allows accessing :productId from parent router
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getProductReviews)
  .post(optionalAuth, createProductReview);

module.exports = router;
