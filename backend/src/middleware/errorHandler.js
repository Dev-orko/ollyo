const AppError = require('../utils/AppError');
const config = require('../config');

/**
 * Centralized error handling middleware.
 */
const errorHandler = (err, req, res, _next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || null;

  // Prisma known errors
  if (err.code === 'P2002') {
    statusCode = 409;
    const field = err.meta?.target?.join(', ') || 'field';
    message = `Duplicate value for: ${field}`;
  }
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation failed';
    details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Log in development
  if (config.env === 'development') {
    console.error('ERROR:', {
      statusCode,
      message,
      stack: err.stack,
      details,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
    ...(config.env === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
