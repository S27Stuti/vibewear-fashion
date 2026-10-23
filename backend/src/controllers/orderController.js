const { Order, OrderItem, Product, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const ApiError = require('../utils/apiError');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private / OptionalAuth
const createOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { items, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, totalAmount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return next(new ApiError('No order items provided', 400));
    }

    const calculatedTotal = totalAmount || totalPrice || 0;

    // Verify stock and collect products
    for (const item of items) {
      const pId = item.product || item.productId;
      if (pId) {
        const product = await Product.findByPk(pId, { transaction });
        if (product && product.stock < (item.quantity || item.qty || 1)) {
          await transaction.rollback();
          return next(new ApiError(`Insufficient stock for product '${product.title}'`, 400));
        }
      }
    }

    // Determine effective user ID (authenticated user or fallback customer user)
    let effectiveUserId = req.user ? req.user.id : null;
    if (!effectiveUserId) {
      const defaultUser = await User.findOne({ where: { role: 'Customer' }, transaction });
      effectiveUserId = defaultUser ? defaultUser.id : 'usr_customer_john';
    }

    // Find active delivery partner or fallback to default rider
    const deliveryHero = await User.findOne({
      where: { role: 'DeliveryPartner' },
      transaction
    });

    const deliveryPartnerId = deliveryHero ? deliveryHero.id : null;
    const deliveryPartnerName = deliveryHero ? deliveryHero.name : 'Vikram Malhotra';
    const deliveryPartnerPhone = deliveryHero?.phone || '+91 98201 55432';
    const deliveryPartnerEmail = deliveryHero?.email || 'delivery@vibewear.com';
    const deliveryPartnerVehicle = deliveryHero?.vehicleDetails || 'Hero Electric Optima - MH 02 CW 9921';

    const now = new Date();
    const defaultTimeline = [
      {
        step: 1,
        status: 'Confirmed',
        title: 'Order Confirmed & Payment Verified',
        location: 'VibeWear Digital Fashion Hub, Mumbai',
        timestamp: now.toISOString(),
        completed: true,
        description: 'Order confirmed and sent to automated warehouse dispatch.'
      },
      {
        step: 2,
        status: 'Processing',
        title: 'Quality Inspected & Packed',
        location: 'Central Fulfilment Center, Warehouse 4',
        timestamp: new Date(now.getTime() + 15 * 60 * 1000).toISOString(),
        completed: true,
        description: 'Quality approved and sealed in premium tamper-proof package.'
      },
      {
        step: 3,
        status: 'Shipped',
        title: 'Dispatched to Delivery Partner',
        location: 'Mumbai Logistics Hub, Express Terminal',
        timestamp: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
        completed: true,
        description: `Handed over to ${deliveryPartnerName} (${deliveryPartnerVehicle}).`
      },
      {
        step: 4,
        status: 'Out for Delivery',
        title: 'Out for Delivery',
        location: shippingAddress?.city || 'Customer Shipping Location',
        timestamp: null,
        completed: false,
        description: `${deliveryPartnerName} is heading towards your delivery address.`
      },
      {
        step: 5,
        status: 'Delivered',
        title: 'Delivered Successfully',
        location: shippingAddress?.city || 'Customer Shipping Location',
        timestamp: null,
        completed: false,
        description: 'Package handed over safely with confirmation.'
      }
    ];

    // Create Order record
    const order = await Order.create(
      {
        userId: effectiveUserId,
        shippingAddress,
        paymentMethod: paymentMethod === 'COD' || paymentMethod === 'Cash on Delivery' ? 'COD' : 'Online',
        paymentStatus: paymentMethod === 'COD' || paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Completed',
        orderStatus: 'Confirmed',
        itemsPrice: itemsPrice || calculatedTotal,
        taxPrice: taxPrice || 0,
        shippingPrice: shippingPrice || 0,
        totalAmount: calculatedTotal,
        paidAt: paymentMethod !== 'COD' && paymentMethod !== 'Cash on Delivery' ? new Date() : null,
        deliveryPartnerId,
        deliveryPartnerName,
        deliveryPartnerPhone,
        deliveryPartnerEmail,
        deliveryPartnerVehicle,
        deliveryNotes: 'Express fashion delivery. Priority courier dispatch.',
        estimatedDeliveryTime: 'Today by 7:30 PM (Express 1-Day Delivery)',
        trackingTimeline: defaultTimeline
      },
      { transaction }
    );

    // Create OrderItems records and deduct inventory
    for (const item of items) {
      let pId = item.product || item.productId;
      if (!pId) {
        const fallbackProd = await Product.findOne({ transaction });
        pId = fallbackProd ? fallbackProd.id : null;
      }
      const quantity = item.quantity || item.qty || 1;

      await OrderItem.create(
        {
          orderId: order.id,
          productId: pId,
          title: item.title,
          qty: quantity,
          price: item.price,
          size: item.size || 'M',
          color: item.color || 'Standard',
          image: item.image || ''
        },
        { transaction }
      );

      // Decrement stock in MySQL if product exists
      if (pId) {
        try {
          await Product.decrement('stock', {
            by: quantity,
            where: { id: pId },
            transaction
          });
        } catch (e) {
          // Ignore if product ID is fallback/string
        }
      }
    }

    await transaction.commit();

    // Fetch complete created order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: 'items' },
        { model: User, as: 'deliveryPartner', attributes: ['id', 'name', 'email', 'phone', 'vehicleDetails'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully with live tracking initialized',
      data: {
        ...completeOrder.toJSON(),
        _id: completeOrder.id
      }
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        { model: OrderItem, as: 'items' },
        { model: User, as: 'deliveryPartner', attributes: ['id', 'name', 'email', 'phone', 'vehicleDetails'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formattedOrders = orders.map((o) => ({
      ...o.toJSON(),
      _id: o.id
    }));

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      data: formattedOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID (with tracking & rider details)
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
        { model: User, as: 'deliveryPartner', attributes: ['id', 'name', 'email', 'phone', 'vehicleDetails'] },
        { model: OrderItem, as: 'items' }
      ]
    });

    if (!order) {
      return next(new ApiError(`Order not found with id ${req.params.id}`, 404));
    }

    // Authorization check: User who placed it, Admin, or Delivery Partner can view
    const isOwner = order.userId === req.user.id;
    const isDeliveryHero = req.user.role === 'DeliveryPartner';
    const isAdmin = req.user.role === 'Admin';

    if (!isOwner && !isDeliveryHero && !isAdmin) {
      return next(new ApiError('Not authorized to view this order', 403));
    }

    res.status(200).json({
      success: true,
      data: {
        ...order.toJSON(),
        _id: order.id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders assigned to delivery partner (or all available for delivery)
// @route   GET /api/v1/orders/delivery/assigned
// @access  Private (DeliveryPartner / Admin)
const getDeliveryAssignedOrders = async (req, res, next) => {
  try {
    let whereClause = {};
    if (req.user.role === 'DeliveryPartner') {
      whereClause = {
        [Op.or]: [
          { deliveryPartnerId: req.user.id },
          { deliveryPartnerId: null },
          { deliveryPartnerEmail: req.user.email }
        ]
      };
    }

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
        { model: OrderItem, as: 'items' }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formattedOrders = orders.map((o) => ({
      ...o.toJSON(),
      _id: o.id
    }));

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      data: formattedOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order delivery status (by Delivery Partner or Admin)
// @route   PUT /api/v1/orders/:id/delivery-status
// @access  Private (DeliveryPartner / Admin)
const updateOrderDeliveryStatus = async (req, res, next) => {
  try {
    const { orderStatus, deliveryNotes, paymentStatus } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return next(new ApiError(`Order not found with id ${req.params.id}`, 404));
    }

    const updates = {};
    const now = new Date();

    if (orderStatus) {
      updates.orderStatus = orderStatus;
      if (orderStatus === 'Delivered') {
        updates.deliveredAt = now;
        if (order.paymentMethod === 'COD') {
          updates.paymentStatus = 'Completed';
          updates.paidAt = now;
        }
      }
    }

    if (paymentStatus) {
      updates.paymentStatus = paymentStatus;
      if (paymentStatus === 'Completed' && !order.paidAt) {
        updates.paidAt = now;
      }
    }

    if (deliveryNotes !== undefined) {
      updates.deliveryNotes = deliveryNotes;
    }

    // Auto-bind rider details if order didn't have them
    if (req.user.role === 'DeliveryPartner') {
      updates.deliveryPartnerId = req.user.id;
      updates.deliveryPartnerName = req.user.name;
      updates.deliveryPartnerPhone = req.user.phone || '+91 98201 55432';
      updates.deliveryPartnerEmail = req.user.email;
      updates.deliveryPartnerVehicle = req.user.vehicleDetails || 'Hero Electric Optima - MH 02 CW 9921';
    }

    // Update tracking timeline steps
    let timeline = Array.isArray(order.trackingTimeline) ? JSON.parse(JSON.stringify(order.trackingTimeline)) : [];
    if (timeline.length > 0) {
      const timeStr = now.toISOString();
      if (orderStatus === 'Shipped') {
        timeline = timeline.map((step) => {
          if (step.status === 'Shipped') {
            return { ...step, completed: true, timestamp: timeStr };
          }
          return step;
        });
      } else if (orderStatus === 'Out for Delivery') {
        timeline = timeline.map((step) => {
          if (step.status === 'Shipped' || step.status === 'Out for Delivery') {
            return { ...step, completed: true, timestamp: step.timestamp || timeStr };
          }
          return step;
        });
      } else if (orderStatus === 'Delivered') {
        timeline = timeline.map((step) => ({
          ...step,
          completed: true,
          timestamp: step.timestamp || timeStr
        }));
      }
      updates.trackingTimeline = timeline;
    }

    await order.update(updates);

    const updatedOrder = await Order.findByPk(order.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
        { model: OrderItem, as: 'items' }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Delivery status updated successfully',
      data: {
        ...updatedOrder.toJSON(),
        _id: updatedOrder.id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Claim order for delivery
// @route   PUT /api/v1/orders/:id/claim-delivery
// @access  Private (DeliveryPartner / Admin)
const claimOrderForDelivery = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return next(new ApiError(`Order not found with id ${req.params.id}`, 404));
    }

    const updates = {
      deliveryPartnerId: req.user.id,
      deliveryPartnerName: req.user.name,
      deliveryPartnerPhone: req.user.phone || '+91 98201 55432',
      deliveryPartnerEmail: req.user.email,
      deliveryPartnerVehicle: req.user.vehicleDetails || 'Hero Electric Optima - MH 02 CW 9921',
      orderStatus: order.orderStatus === 'Pending' || order.orderStatus === 'Confirmed' ? 'Shipped' : order.orderStatus,
      deliveryNotes: `Claimed and accepted by rider ${req.user.name}`
    };

    await order.update(updates);

    const updated = await Order.findByPk(order.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
        { model: OrderItem, as: 'items' }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Order claimed successfully by delivery partner',
      data: {
        ...updated.toJSON(),
        _id: updated.id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return next(new ApiError(`Order not found with id ${req.params.id}`, 404));
    }

    const updates = {};
    if (orderStatus) {
      updates.orderStatus = orderStatus;
      if (orderStatus === 'Delivered') {
        updates.deliveredAt = new Date();
      }
    }

    if (paymentStatus) {
      updates.paymentStatus = paymentStatus;
      if (paymentStatus === 'Completed' && !order.paidAt) {
        updates.paidAt = new Date();
      }
    }

    await order.update(updates);

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: {
        ...order.toJSON(),
        _id: order.id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/v1/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
        { model: User, as: 'deliveryPartner', attributes: ['id', 'name', 'email', 'phone', 'vehicleDetails'] },
        { model: OrderItem, as: 'items' }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formattedOrders = orders.map((o) => ({
      ...o.toJSON(),
      _id: o.id
    }));

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      data: formattedOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (Customer or Admin)
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return next(new ApiError(`Order not found with id ${req.params.id}`, 404));
    }

    if (order.userId !== req.user.id && req.user.role !== 'Admin') {
      return next(new ApiError('Not authorized to cancel this order', 403));
    }

    if (order.orderStatus === 'Delivered' || order.orderStatus === 'Out for Delivery') {
      return next(new ApiError('Orders already dispatched or delivered cannot be cancelled directly. Please use Return or Exchange.', 400));
    }

    let timeline = Array.isArray(order.trackingTimeline) ? JSON.parse(JSON.stringify(order.trackingTimeline)) : [];
    timeline.push({
      step: timeline.length + 1,
      status: 'Cancelled',
      title: 'Order Cancelled',
      location: 'Customer Request',
      timestamp: new Date().toISOString(),
      completed: true,
      description: reason || 'Order cancelled by customer before dispatch.'
    });

    await order.update({
      orderStatus: 'Cancelled',
      cancellationReason: reason || 'Cancelled by customer',
      trackingTimeline: timeline,
      paymentStatus: order.paymentStatus === 'Completed' ? 'Refunded' : order.paymentStatus
    });

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: { ...order.toJSON(), _id: order.id }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request Return for delivered order
// @route   PUT /api/v1/orders/:id/return
// @access  Private (Customer)
const requestOrderReturn = async (req, res, next) => {
  try {
    const { reason, comment } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return next(new ApiError(`Order not found with id ${req.params.id}`, 404));
    }

    if (order.userId !== req.user.id && req.user.role !== 'Admin') {
      return next(new ApiError('Not authorized to request return for this order', 403));
    }

    let timeline = Array.isArray(order.trackingTimeline) ? JSON.parse(JSON.stringify(order.trackingTimeline)) : [];
    timeline.push({
      step: timeline.length + 1,
      status: 'Return Requested',
      title: 'Return Requested by Customer',
      location: 'Doorstep Pickup Pending',
      timestamp: new Date().toISOString(),
      completed: true,
      description: `Return Reason: ${reason || 'Not specified'}. ${comment || ''}`
    });

    await order.update({
      orderStatus: 'Return Requested',
      returnReason: reason || 'Customer requested return',
      returnComment: comment || '',
      returnStatus: 'Requested',
      trackingTimeline: timeline
    });

    res.status(200).json({
      success: true,
      message: 'Return request submitted successfully. Admin will assign a pickup agent.',
      data: { ...order.toJSON(), _id: order.id }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request Exchange for delivered order
// @route   PUT /api/v1/orders/:id/exchange
// @access  Private (Customer)
const requestOrderExchange = async (req, res, next) => {
  try {
    const { reason, desiredSize, desiredColor, comment } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return next(new ApiError(`Order not found with id ${req.params.id}`, 404));
    }

    if (order.userId !== req.user.id && req.user.role !== 'Admin') {
      return next(new ApiError('Not authorized to request exchange for this order', 403));
    }

    let timeline = Array.isArray(order.trackingTimeline) ? JSON.parse(JSON.stringify(order.trackingTimeline)) : [];
    timeline.push({
      step: timeline.length + 1,
      status: 'Exchange Requested',
      title: 'Exchange Requested by Customer',
      location: 'Size & Color Replacement Exchange',
      timestamp: new Date().toISOString(),
      completed: true,
      description: `Replacement: Size ${desiredSize || 'L'}${desiredColor ? ` • Color ${desiredColor}` : ''}. Reason: ${reason || ''}`
    });

    await order.update({
      orderStatus: 'Exchange Requested',
      exchangeReason: reason || 'Size/color fit exchange',
      exchangeDesiredSize: desiredSize || 'L',
      exchangeDesiredColor: desiredColor || null,
      exchangeStatus: 'Requested',
      trackingTimeline: timeline
    });

    res.status(200).json({
      success: true,
      message: 'Exchange request submitted. Admin will assign a delivery partner for doorstep swap.',
      data: { ...order.toJSON(), _id: order.id }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin assigns delivery partner to Order or Return Pickup
// @route   PUT /api/v1/orders/:id/assign-rider
// @access  Private (Admin)
const assignDeliveryPartner = async (req, res, next) => {
  try {
    const { deliveryPartnerId, deliveryPartnerName, deliveryPartnerPhone, deliveryPartnerVehicle } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return next(new ApiError(`Order not found with id ${req.params.id}`, 404));
    }

    const riderName = deliveryPartnerName || 'Vikram Malhotra';
    const riderPhone = deliveryPartnerPhone || '+91 98201 55432';
    const riderVehicle = deliveryPartnerVehicle || 'Hero Electric Optima - MH 02 CW 9921';

    let newStatus = 'Assigned';
    if (order.orderStatus === 'Return Requested') newStatus = 'Return Approved';
    if (order.orderStatus === 'Exchange Requested') newStatus = 'Exchange Approved';

    let timeline = Array.isArray(order.trackingTimeline) ? JSON.parse(JSON.stringify(order.trackingTimeline)) : [];
    timeline.push({
      step: timeline.length + 1,
      status: newStatus,
      title: `Assigned to ${riderName}`,
      location: 'Central Logistics Hub',
      timestamp: new Date().toISOString(),
      completed: true,
      description: `Admin assigned shipment to ${riderName} (${riderVehicle}). Awaiting rider acceptance.`
    });

    await order.update({
      orderStatus: newStatus,
      deliveryPartnerId: deliveryPartnerId || order.deliveryPartnerId,
      deliveryPartnerName: riderName,
      deliveryPartnerPhone: riderPhone,
      deliveryPartnerVehicle: riderVehicle,
      driverRequestStatus: 'pending_acceptance',
      driverRejectionReason: null,
      trackingTimeline: timeline
    });

    res.status(200).json({
      success: true,
      message: `Order assigned to ${riderName}. Awaiting driver acceptance.`,
      data: { ...order.toJSON(), _id: order.id }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delivery Partner accepts assigned order or return pickup
// @route   PUT /api/v1/orders/:id/accept
// @access  Private (DeliveryPartner / Admin)
const acceptOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return next(new ApiError(`Order not found with id ${req.params.id}`, 404));
    }

    let newStatus = 'Shipped';
    if (order.orderStatus === 'Return Approved' || order.orderStatus === 'Return Requested') {
      newStatus = 'Return In Progress';
    } else if (order.orderStatus === 'Exchange Approved' || order.orderStatus === 'Exchange Requested') {
      newStatus = 'Exchange In Progress';
    }

    let timeline = Array.isArray(order.trackingTimeline) ? JSON.parse(JSON.stringify(order.trackingTimeline)) : [];
    timeline.push({
      step: timeline.length + 1,
      status: newStatus,
      title: `Accepted by Delivery Hero ${req.user.name}`,
      location: 'En Route to Hub/Customer',
      timestamp: new Date().toISOString(),
      completed: true,
      description: `Rider ${req.user.name} has accepted task and scheduled pickup/drop.`
    });

    await order.update({
      orderStatus: newStatus,
      deliveryPartnerId: req.user.id,
      deliveryPartnerName: req.user.name,
      deliveryPartnerPhone: req.user.phone || '+91 98201 55432',
      deliveryPartnerVehicle: req.user.vehicleDetails || 'Hero Electric Optima - MH 02 CW 9921',
      driverRequestStatus: 'accepted',
      driverAcceptedAt: new Date(),
      trackingTimeline: timeline
    });

    res.status(200).json({
      success: true,
      message: 'Order accepted by rider',
      data: { ...order.toJSON(), _id: order.id }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delivery Partner declines/rejects delivery request
// @route   PUT /api/v1/orders/:id/reject
// @access  Private (DeliveryPartner / Admin)
const rejectOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return next(new ApiError(`Order not found with id ${req.params.id}`, 404));
    }

    const rejectionReason = reason || 'Driver currently unavailable / out of operational zone';
    let timeline = Array.isArray(order.trackingTimeline) ? JSON.parse(JSON.stringify(order.trackingTimeline)) : [];
    timeline.push({
      step: timeline.length + 1,
      status: 'Driver Declined Request',
      title: `Declined by ${req.user.name || order.deliveryPartnerName || 'Driver'}`,
      location: 'Logistics Control Center',
      timestamp: new Date().toISOString(),
      completed: true,
      description: `Delivery Partner indicated: "${rejectionReason}". Order returned to Admin queue for reassignment to another driver.`
    });

    let history = Array.isArray(order.driverRejectionHistory) ? JSON.parse(JSON.stringify(order.driverRejectionHistory)) : [];
    history.push({
      driverName: req.user.name || order.deliveryPartnerName,
      driverPhone: req.user.phone || order.deliveryPartnerPhone,
      reason: rejectionReason,
      timestamp: new Date().toISOString()
    });

    await order.update({
      driverRequestStatus: 'rejected',
      driverRejectedAt: new Date(),
      driverRejectionReason: rejectionReason,
      driverRejectionHistory: history,
      trackingTimeline: timeline
    });

    res.status(200).json({
      success: true,
      message: 'Delivery request rejected by driver. Admin notified for reassignment.',
      data: { ...order.toJSON(), _id: order.id }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delivery Partner completes return pickup / exchange
// @route   PUT /api/v1/orders/:id/complete-return
// @access  Private (DeliveryPartner / Admin)
const completeReturnPickup = async (req, res, next) => {
  try {
    const { refundAmount, notes } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return next(new ApiError(`Order not found with id ${req.params.id}`, 404));
    }

    const isExchange = order.orderStatus === 'Exchange In Progress' || order.orderStatus === 'Exchange Approved';
    const newStatus = isExchange ? 'Exchanged' : 'Returned';

    let timeline = Array.isArray(order.trackingTimeline) ? JSON.parse(JSON.stringify(order.trackingTimeline)) : [];
    timeline.push({
      step: timeline.length + 1,
      status: newStatus,
      title: isExchange ? 'Exchange Handover Completed' : 'Return Collected & Refund Issued',
      location: 'Customer Doorstep',
      timestamp: new Date().toISOString(),
      completed: true,
      description: isExchange
        ? 'Size replacement handed over successfully. Return package verified.'
        : `Package collected safely. Full refund of ₹${refundAmount || order.totalAmount} processed to customer.`
    });

    await order.update({
      orderStatus: newStatus,
      returnStatus: 'Completed',
      exchangeStatus: isExchange ? 'Completed' : order.exchangeStatus,
      paymentStatus: isExchange ? order.paymentStatus : 'Refunded',
      deliveryNotes: notes || (isExchange ? 'Exchange completed at doorstep.' : `Return package collected. Refund of ₹${refundAmount || order.totalAmount} issued.`),
      trackingTimeline: timeline
    });

    res.status(200).json({
      success: true,
      message: `${newStatus} completed successfully`,
      data: { ...order.toJSON(), _id: order.id }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
