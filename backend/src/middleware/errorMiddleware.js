const ApiError = require('../utils/apiError');

// Handle 404 Route Not Found
const notFound = (req, res, next) => {
  const error = new ApiError(`Resource not found - ${req.originalUrl}`, 404);
  next(error);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error stack in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Detail]:', err);
  }

  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors ? err.errors.map((val) => val.message).join(', ') : err.message;
    error = new ApiError(message, 400);
  }

  // Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = err.errors ? err.errors.map((val) => val.message).join(', ') : 'Duplicate field value entered.';
    error = new ApiError(message, 400);
  }

  // Sequelize Foreign Key Constraint Error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = 'Referenced resource does not exist';
    error = new ApiError(message, 400);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid authorization token. Please log in again.';
    error = new ApiError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Your session has expired. Please log in again.';
    error = new ApiError(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = {
  notFound,
  errorHandler
};
