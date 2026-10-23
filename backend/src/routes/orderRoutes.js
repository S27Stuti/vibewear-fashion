const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getDeliveryAssignedOrders,
  updateOrderDeliveryStatus,
  claimOrderForDelivery,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
  requestOrderReturn,
  requestOrderExchange,
  assignDeliveryPartner,
  acceptOrder,
  rejectOrder,
  completeReturnPickup
} = require('../controllers/orderController');
const { protect, optionalAuth, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .post(optionalAuth, createOrder)
  .get(protect, authorize('Admin'), getAllOrders);

router.route('/my-orders').get(protect, getMyOrders);

// Delivery partner routes
router.route('/delivery/assigned').get(protect, authorize('DeliveryPartner', 'Admin'), getDeliveryAssignedOrders);

router.route('/:id').get(protect, getOrderById);

router.route('/:id/status').put(protect, authorize('Admin'), updateOrderStatus);

router.route('/:id/delivery-status').put(protect, authorize('DeliveryPartner', 'Admin'), updateOrderDeliveryStatus);

router.route('/:id/claim-delivery').put(protect, authorize('DeliveryPartner', 'Admin'), claimOrderForDelivery);

// Cancellation, Return & Exchange routes
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id/return').put(protect, requestOrderReturn);
router.route('/:id/exchange').put(protect, requestOrderExchange);

// Admin assign rider route
router.route('/:id/assign-rider').put(protect, authorize('Admin'), assignDeliveryPartner);

// Delivery hero accept, reject, and complete return routes
router.route('/:id/accept').put(protect, authorize('DeliveryPartner', 'Admin'), acceptOrder);
router.route('/:id/reject').put(protect, authorize('DeliveryPartner', 'Admin'), rejectOrder);
router.route('/:id/complete-return').put(protect, authorize('DeliveryPartner', 'Admin'), completeReturnPickup);

module.exports = router;
