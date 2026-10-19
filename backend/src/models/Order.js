const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    shippingAddress: {
      type: DataTypes.JSON,
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.ENUM('Online', 'COD'),
      defaultValue: 'COD',
      allowNull: false
    },
    paymentStatus: {
      type: DataTypes.ENUM('Pending', 'Completed', 'Failed', 'Refunded'),
      defaultValue: 'Pending',
      allowNull: false
    },
    orderStatus: {
      type: DataTypes.ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
      defaultValue: 'Pending',
      allowNull: false
    },
    itemsPrice: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    taxPrice: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    shippingPrice: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'orders',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['orderStatus'] },
      { fields: ['createdAt'] }
    ]
  }
);

module.exports = Order;
