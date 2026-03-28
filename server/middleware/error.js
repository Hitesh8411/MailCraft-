const errorHandler = (err, req, res, next) => {
  console.error('[GLOBAL ERROR]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    data: null
  });
};

module.exports = errorHandler;
