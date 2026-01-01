import appError from '../utils/appError.js';

const handleCastErrorsDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new appError(message, 400);
};

const handleDuplicateFields = (err) => {
  const value = err?.keyValue?.name;
  const message = `Duplicate field value: ${value}. Please use another one`;
  return new appError(message, 404);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new appError(message, 404);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    error: {
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    },
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      error: {
        status: err.status,
        message: err.message,
      },
    });

    // programming or other unknown error: don't leak error details
  } else {
    // 1. Log error
    console.error('Error ⚠️', err);

    // 2. Send generic message
    res.status(500).json({
      status: 'Error',
      message: 'Something went wrong',
    });
  }
};

const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    if (error.name === 'CastError') error = handleCastErrorsDB(error);
    if (error.code === 11000) error = handleDuplicateFields(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};

export default errorController;
