import CustomError from '../lib/customError.js';

// eslint-disable-next-line no-unused-vars
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new CustomError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new CustomError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new CustomError(message, 400);
};

const handleJWTError = () => new CustomError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new CustomError('Your token has expired! Please log in again.', 401);

const sendErrorProd = (err, res) => {
  console.log(err.status);
  console.log(err.message);
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(400).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    // eslint-disable-next-line no-console
    console.error('ERROR 💥', err);
    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.name === 'CastError') err = handleCastErrorDB(err);
  if (err.code === 11000) err = handleDuplicateFieldsDB(err);
  if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
  if (err.name === 'JsonWebTokenError') err = handleJWTError();
  if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();
  // console.log(
  //   111111111111111,
  //   err,
  // );
  // console.log(2222222222222, res);
  sendErrorProd(err, res);
};
export default errorHandler;
