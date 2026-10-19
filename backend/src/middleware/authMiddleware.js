const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/apiError');

// Middleware to protect routes via JWT Bearer Token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret_key_vibewear'
      );

      // Fetch user by Primary Key without password
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return next(new ApiError('User belonging to this token no longer exists', 401));
      }

      next();
    } catch (error) {
      return next(new ApiError('Not authorized, token failed verification', 401));
    }
  }

  if (!token) {
    return next(new ApiError('Not authorized, no token provided', 401));
  }
};

// Middleware to authorize specific roles (e.g. Admin)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `User role '${req.user ? req.user.role : 'Unauthenticated'}' is not authorized to access this resource`,
          403
        )
      );
    }
    next();
  };
};

// Middleware for optional authentication (attaches user if valid token, otherwise continues)
const optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret_key_vibewear'
      );
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
    } catch (e) {
      // Continue without user
    }
  }
  next();
};

module.exports = {
  protect,
  optionalAuth,
  authorize
};
