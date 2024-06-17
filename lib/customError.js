class CustomError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    // this.status = status;
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export default CustomError;
