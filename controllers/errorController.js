const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  res.status(err.statusCode).json({
    error: {
      status: err.status,
      message: err.message,
    },
  });
};

export default errorController;
