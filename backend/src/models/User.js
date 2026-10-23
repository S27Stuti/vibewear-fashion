const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a name' },
        len: { args: [2, 100], msg: 'Name must be between 2 and 100 characters' }
      }
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: {
        name: 'unique_user_email',
        msg: 'A user with this email address already exists'
      },
      validate: {
        isEmail: { msg: 'Please provide a valid email address' }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a password' }
      }
    },
    role: {
      type: DataTypes.STRING(50),
      defaultValue: 'Customer',
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    vehicleDetails: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    licenseNumber: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  },
  {
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  }
);

// Instance method to compare password
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Safe JSON serialization to hide password by default
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;
