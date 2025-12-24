/**
 * Global Error Handler
 * Seluruh error akan lewat sini
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message =
    err.isOperational
      ? err.message
      : "Terjadi kesalahan pada server";

  // Logging internal (boleh diganti Winston / Pino)
  console.error("🔥 Error:", {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(statusCode).json({
    message,
  });
};

export default errorHandler;
