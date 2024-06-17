/* eslint-disable import/prefer-default-export */
import jwt from 'jsonwebtoken';
import asyncHandler from '../lib/asyncHandler.js';
import User from '../src/modules/user/user.model.js';
import CustomError from '../lib/customError.js';

export const isAuth = asyncHandler(async (req, res, next) => {
  const token = req.header('token');
  if (!token) {
    throw new CustomError('You are not authenticated, please login', 403);
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decodedToken.id).exec();
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  req.user = user;
  next();
});
