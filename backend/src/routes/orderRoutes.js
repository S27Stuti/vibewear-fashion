const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');
const { protect, optionalAuth, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .post(optionalAuth, createOrder)
  .get(protect, authorize('Admin'), getAllOrders);

router.route('/my-orders').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);

router.route('/:id/status').put(protect, authorize('Admin'), updateOrderStatus);

module.exports = router;
