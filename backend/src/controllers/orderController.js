const { Order, OrderItem, Product, User, sequelize } = require('../models');
const ApiError = require('../utils/apiError');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
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
      const product = await Product.findByPk(item.product || item.productId, { transaction });
      if (!product) {
        await transaction.rollback();
        return next(new ApiError(`Product not found with id ${item.product || item.productId}`, 404));
      }
      if (product.stock < (item.quantity || item.qty || 1)) {
        await transaction.rollback();
        return next(new ApiError(`Insufficient stock for product '${product.title}'`, 400));
      }
    }

    // Determine effective user ID (authenticated user or fallback customer user)
    let effectiveUserId = req.user ? req.user.id : null;
    if (!effectiveUserId) {
      const defaultUser = await User.findOne({ transaction });
      effectiveUserId = defaultUser ? defaultUser.id : 'usr_customer_john';
    }

    // Create Order record
    const order = await Order.create(
      {
        userId: effectiveUserId,
        shippingAddress,
        paymentMethod: paymentMethod === 'COD' || paymentMethod === 'Cash on Delivery' ? 'COD' : 'Online',
        paymentStatus: paymentMethod === 'COD' || paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Completed',
        orderStatus: 'Processing',
        itemsPrice: itemsPrice || calculatedTotal,
        taxPrice: taxPrice || 0,
        shippingPrice: shippingPrice || 0,
        totalAmount: calculatedTotal,
        ...(paymentMethod !== 'COD' && { paidAt: new Date() })
      },
      { transaction }
    );

    // Create OrderItems records and deduct inventory
    for (const item of items) {
      const pId = item.product || item.productId;
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

      // Decrement stock in MySQL
      await Product.decrement('stock', {
        by: quantity,
        where: { id: pId },
        transaction
      });
    }

    await transaction.commit();

    // Fetch complete created order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
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
      include: [{ model: OrderItem, as: 'items' }],
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

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: OrderItem, as: 'items' }
      ]
    });

    if (!order) {
      return next(new ApiError(`Order not found with id ${req.params.id}`, 404));
    }

    // Authorization check
    if (order.userId !== req.user.id && req.user.role !== 'Admin') {
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

// @desc    Update order status
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

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
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

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
};
