const { sequelize } = require('../config/db');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Review = require('./Review');

// Associations

// User <-> Order
User.hasMany(Order, { foreignKey: 'userId', as: 'orders', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Product <-> OrderItem
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems', onDelete: 'CASCADE' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// User <-> Review
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Product <-> Review
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Category <-> Product
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products', onDelete: 'SET NULL' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'categoryDetails' });

// Automatic rating calculation helper
const recalculateProductRating = async (productId) => {
  try {
    if (!productId) return;
    const reviews = await Review.findAll({
      where: { productId },
      attributes: ['rating']
    });

    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      const avg = Math.round((sum / reviews.length) * 10) / 10;
      await Product.update(
        { rating: avg, numReviews: reviews.length },
        { where: { id: productId } }
      );
    } else {
      await Product.update(
        { rating: 0, numReviews: 0 },
        { where: { id: productId } }
      );
    }
  } catch (err) {
    console.error(`[Review Hook Error] Failed to recalculate rating for product ${productId}:`, err.message);
  }
};

// Sequelize hooks on Review model
Review.afterCreate(async (review) => {
  await recalculateProductRating(review.productId);
});

Review.afterUpdate(async (review) => {
  await recalculateProductRating(review.productId);
});

Review.afterDestroy(async (review) => {
  await recalculateProductRating(review.productId);
});

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Review
};
