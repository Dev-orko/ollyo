const AppError = require('../utils/AppError');

/**
 * Zod validation middleware factory.
 * @param {import('zod').ZodSchema} schema
 * @param {'body'|'query'|'params'} source
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next(result.error); // Caught by errorHandler as ZodError
    }
    req[source] = result.data; // Replace with parsed/coerced data
    next();
  };
};

module.exports = validate;
