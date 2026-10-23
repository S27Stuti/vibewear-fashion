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
      type: DataTypes.STRING(50),
      defaultValue: 'Confirmed',
      allowNull: false
    },
    deliveryPartnerId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    deliveryPartnerName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    deliveryPartnerPhone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    deliveryPartnerEmail: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    deliveryPartnerVehicle: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    driverRequestStatus: {
      type: DataTypes.STRING(50),
      defaultValue: 'none',
      allowNull: false
    },
    driverRejectionReason: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    driverAcceptedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    driverRejectedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    driverRejectionHistory: {
      type: DataTypes.JSON,
      allowNull: true
    },
    deliveryNotes: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    estimatedDeliveryTime: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    trackingTimeline: {
      type: DataTypes.JSON,
      allowNull: true
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
    },
    returnReason: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    returnComment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    returnStatus: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    exchangeReason: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    exchangeDesiredSize: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    exchangeDesiredColor: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    exchangeStatus: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cancellationReason: {
      type: DataTypes.STRING(255),
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
