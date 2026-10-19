const { Review, Product, User } = require('../models');
const ApiError = require('../utils/apiError');

// @desc    Create a product review
// @route   POST /api/v1/products/:productId/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    const product = await Product.findByPk(productId);
    if (!product) {
      return next(new ApiError(`Product not found with id ${productId}`, 404));
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      where: {
        productId,
        userId: req.user.id
      }
    });

    if (alreadyReviewed) {
      return next(new ApiError('You have already reviewed this product', 400));
    }

    // Creating review will trigger the afterCreate hook to recalculate product rating!
    const review = await Review.create({
      productId,
      userId: req.user.id,
      rating: Number(rating),
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        ...review.toJSON(),
        _id: review.id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/v1/products/:productId/reviews
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const whereCondition = productId ? { productId } : {};

    const reviews = await Review.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formattedReviews = reviews.map((r) => ({
      ...r.toJSON(),
      _id: r.id
    }));

    res.status(200).json({
      success: true,
      count: formattedReviews.length,
      data: formattedReviews
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProductReview,
  getProductReviews
};
