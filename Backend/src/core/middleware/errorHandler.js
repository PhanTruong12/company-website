// core/middleware/errorHandler.js - Global error handler middleware
const { AppError } = require('../../shared/utils/errors/AppError');
const { HTTP_STATUS } = require('../../shared/constants');
const { sendError } = require('../../shared/utils/response');

/**
 * Global error handler middleware
 * Must be used after all routes
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, HTTP_STATUS.NOT_FOUND);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = new AppError(message, HTTP_STATUS.CONFLICT);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    const message = errors.join(', ');
    error = new AppError(message, HTTP_STATUS.BAD_REQUEST);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, HTTP_STATUS.UNAUTHORIZED);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, HTTP_STATUS.UNAUTHORIZED);
  }

  // Send error response
  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Internal Server Error';

  sendError(res, message, statusCode, error.errors || null);
};

/**
 * Handle 404 Not Found
 */
const notFound = (req, res, next) => {
  const message = `Route ${req.originalUrl} not found`;
  sendError(res, message, HTTP_STATUS.NOT_FOUND);
};

module.exports = {
  errorHandler,
  notFound
};
