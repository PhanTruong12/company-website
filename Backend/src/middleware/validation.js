// middleware/validation.js - Request validation middleware
const { ValidationError } = require('../utils/errors/AppError');
const { ERROR_MESSAGES } = require('../constants');

/**
 * Validates request body against schema
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        const field = detail.path.join('.');
        errors[field] = detail.message;
      });
      return next(new ValidationError(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS, errors));
    }

    req.body = value;
    next();
  };
};

/**
 * Validates request query parameters
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        const field = detail.path.join('.');
        errors[field] = detail.message;
      });
      return next(new ValidationError('Invalid query parameters', errors));
    }

    req.query = value;
    next();
  };
};

/**
 * Validates request params
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        const field = detail.path.join('.');
        errors[field] = detail.message;
      });
      return next(new ValidationError('Invalid parameters', errors));
    }

    req.params = value;
    next();
  };
};

module.exports = {
  validate,
  validateQuery,
  validateParams
};

