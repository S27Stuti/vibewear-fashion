const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a product title' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a product description' }
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'Price cannot be negative' }
      }
    },
    category: {
      type: DataTypes.ENUM('Men', 'Women', 'Kids'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['Men', 'Women', 'Kids']],
          msg: 'Category must be Men, Women, or Kids'
        }
      }
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    subCategory: {
      type: DataTypes.STRING(100),
      defaultValue: 'General'
    },
    sizes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: ['M', 'L'],
      validate: {
        isValidArray(value) {
          if (!Array.isArray(value) || value.length === 0) {
            throw new Error('Product must have at least one size in array format');
          }
        }
      }
    },
    colors: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: ['Standard'],
      validate: {
        isValidArray(value) {
          if (!Array.isArray(value) || value.length === 0) {
            throw new Error('Product must have at least one color in array format');
          }
        }
      }
    },
    colorImages: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidArray(value) {
          if (!Array.isArray(value) || value.length === 0) {
            throw new Error('Product must have at least one image in array format');
          }
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'Stock cannot be negative' }
      }
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
      validate: {
        min: 0,
        max: 5
      }
    },
    numReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: 'products',
    timestamps: true,
    indexes: [
      { fields: ['category'] },
      { fields: ['price'] },
      { fields: ['rating'] },
      { fields: ['isFeatured'] }
    ]
  }
);

module.exports = Product;
