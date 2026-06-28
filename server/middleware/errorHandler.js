/**
 * Global error handling middleware.
 *
 * Express identifies this as an error handler because it has 4 parameters.
 * Any route that calls next(error) — or any async error caught by asyncHandler
 * — will be forwarded here.
 *
 * We handle two common Mongoose error types specially:
 *   - CastError: thrown when an invalid MongoDB ObjectId is passed in a route
 *     param (e.g. GET /api/tasks/not-a-valid-id). Without this, it would
 *     surface as a confusing 500 Internal Server Error.
 *   - ValidationError: thrown when Mongoose schema validation fails on .save()
 *     or findByIdAndUpdate with runValidators:true. We surface these as 422.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // ── Mongoose CastError ──────────────────────────────────────────────────────
  // Happens when MongoDB can't cast a value to the expected type —
  // most commonly, an invalid ObjectId in a URL param like /:id.
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field '${err.path}': ${err.value}`;
  }

  // ── Mongoose ValidationError ────────────────────────────────────────────────
  // Happens when a document fails Mongoose schema-level validation.
  // express-validator handles most validation before we reach Mongoose,
  // but this is a safety net for any Mongoose-level rejections.
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Log the full error in development — never in production (it leaks internals)
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error ${statusCode}] ${err.stack || message}`);
  } else {
    console.error(`[Error ${statusCode}] ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
