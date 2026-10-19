const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Category = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        name: 'unique_category_name',
        msg: 'A category with this name already exists'
      },
      validate: {
        notEmpty: { msg: 'Please provide a category name' }
      }
    },
    slug: {
      type: DataTypes.STRING(120),
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    targetAudience: {
      type: DataTypes.ENUM('Men', 'Women', 'Kids', 'Unisex'),
      defaultValue: 'Unisex',
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(500),
      defaultValue: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'categories',
    timestamps: true,
    hooks: {
      beforeValidate: (category) => {
        if (category.name && !category.slug) {
          category.slug = category.name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }
      }
    }
  }
);

module.exports = Category;
