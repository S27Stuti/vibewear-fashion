const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Review = sequelize.define(
  'Review',
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
    productId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'Rating must be at least 1' },
        max: { args: [5], msg: 'Rating cannot exceed 5' }
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide review comments' }
      }
    },
    image: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    audioUrl: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    audioDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  },
  {
    tableName: 'reviews',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'productId'],
        name: 'unique_user_product_review'
      },
      { fields: ['productId'] }
    ]
  }
);

module.exports = Review;
