const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const reviewRouter = require('./reviewRoutes');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Re-route into other resource routers (nested routes)
router.use('/:productId/reviews', reviewRouter);

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('Admin'), createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, authorize('Admin'), updateProduct)
  .delete(protect, authorize('Admin'), deleteProduct);

module.exports = router;
