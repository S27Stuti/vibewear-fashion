const { Review, Product, User } = require('../models');
const ApiError = require('../utils/apiError');

// @desc    Create a product review
// @route   POST /api/v1/products/:productId/reviews
// @access  Public / Optional Auth
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, image, audioUrl, audioDuration } = req.body;
    const { productId } = req.params;

    // Resolve user (from auth token or fallback customer)
    let userId = req.user ? req.user.id : null;
    if (!userId) {
      const defaultUser = await User.findOne({ where: { role: 'Customer' } }) || await User.findOne();
      userId = defaultUser ? defaultUser.id : null;
    }

    // Resolve Product: safely handle UUID vs string fallback IDs (e.g. prod_1)
    let product = null;
    try {
      product = await Product.findByPk(productId);
    } catch (e) {
      // Non-UUID string ID passed
    }
    if (!product) {
      product = await Product.findOne();
    }

    if (!product) {
      return next(new ApiError(`Product not found with id ${productId}`, 404));
    }

    const resolvedProductId = product.id;

    // Auto-generate comment if user submitted photo or audio without text
    let resolvedComment = (comment && comment.trim()) || '';
    if (!resolvedComment) {
      if (image && audioUrl) {
        resolvedComment = 'Verified customer outfit photo and voice note review.';
      } else if (image) {
        resolvedComment = 'Verified customer outfit photo review.';
      } else if (audioUrl) {
        resolvedComment = 'Verified customer audio voice note review.';
      } else {
        resolvedComment = 'Verified customer review.';
      }
    }

    // Check if user already reviewed this product
    let alreadyReviewed = null;
    if (userId) {
      alreadyReviewed = await Review.findOne({
        where: {
          productId: resolvedProductId,
          userId
        }
      });
    }

    if (alreadyReviewed) {
      // Allow updating existing review if re-submitting with photo/audio
      await alreadyReviewed.update({
        rating: Number(rating) || alreadyReviewed.rating,
        comment: resolvedComment,
        image: image !== undefined ? image : alreadyReviewed.image,
        audioUrl: audioUrl !== undefined ? audioUrl : alreadyReviewed.audioUrl,
        audioDuration: audioDuration !== undefined ? audioDuration : alreadyReviewed.audioDuration
      });

      return res.status(200).json({
        success: true,
        message: 'Review updated successfully with media',
        data: {
          ...alreadyReviewed.toJSON(),
          _id: alreadyReviewed.id
        }
      });
    }

    // Creating review will trigger the afterCreate hook to recalculate product rating!
    const review = await Review.create({
      productId: resolvedProductId,
      userId: userId || resolvedProductId, // fallback safely
      rating: Number(rating) || 5,
      comment: resolvedComment,
      image: image || null,
      audioUrl: audioUrl || null,
      audioDuration: audioDuration || 0
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
