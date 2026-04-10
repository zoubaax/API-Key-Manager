function notFoundHandler(req, res) {
  res.status(404).json({ error: "Route not found." });
}

function errorHandler(error, req, res, next) {
  console.error("[ERROR]", error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    error: error.message || "Internal server error."
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
