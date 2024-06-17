const asyncHandler = (routeHandler) => (req, res, next) => Promise.resolve(routeHandler(req, res, next)).catch((error) => next(error));

export default asyncHandler;
