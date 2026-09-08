/** Final error handler — converts thrown errors into JSON responses. */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || (err.name === "ValidationError" ? 400 : err.statusCode) || 500;
  const message =
    err.status || err.statusCode || err.name === "ValidationError"
      ? err.message
      : "Internal server error";

  if (process.env.NODE_ENV !== "test") {
    console.error(`[error] ${req.method} ${req.originalUrl} -> ${status}: ${err.message}`);
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
}

module.exports = errorHandler;
