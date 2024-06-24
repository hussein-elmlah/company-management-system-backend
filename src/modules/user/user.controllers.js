/* eslint-disable radix */
import User from './user.model.js';
import asyncHandler from '../../../lib/asyncHandler.js';
import { hashFunction, compareFunction } from '../../../lib/hashAndCompare.js';
import { generateTokenUser } from '../../../utils/jwtUtils.js';
import CustomError from '../../../lib/customError.js';

export const register = asyncHandler(async (req, res) => {
  const {
    username,
    password,
    firstName,
    email,
    lastName,
    dateOfBirth,
    address,
    role,
    jobLevel,
    mobileNumber,
    contract,
  } = req.body;
  // console.log(req.body);
  const hashedPassword = await hashFunction({ plainText: password });
  const newUser = await User.create({
    username,
    password: hashedPassword,
    firstName,
    email,
    lastName,
    dateOfBirth,
    address,
    role,
    jobLevel,
    mobileNumber,
    contract,
  });
  res.status(201).json({ message: 'User registered successfully', newUser });
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    throw new CustomError('Invalid credentials', 401);
  }
  const passwordMatch = await compareFunction({
    plainText: password,
    hash: user.password,
  });
  if (!passwordMatch) {
    throw new CustomError('Invalid credentials', 401);
  }
  const token = generateTokenUser(user);
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });
  res.json({ user: token });
});

export const paginateResults = (page, pageSize, users, usersCount) => {
  const startIndex = (page - 1) * pageSize;
  // eslint-disable-next-line radix
  const endIndex = Math.min(
    parseInt(startIndex) + parseInt(pageSize),
    usersCount,
  );
  const paginatedData = users.slice(startIndex, endIndex);
  return paginatedData;
};

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 2 } = req.query;
  const users = await User.find();
  const usersCount = await User.countDocuments();
  const paginatedUsers = await paginateResults(
    page,
    pageSize,
    users,
    usersCount,
  );
  // console.log(paginatedUsers);
  res.json({
    users: paginatedUsers,
    usersCount,

    // eslint-disable-next-line radix
    currentPage: parseInt(page),
    totalPages: Math.ceil(usersCount / parseInt(pageSize)),
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  res.json({ user });
});


export const updateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;
  const user = await User.findByIdAndUpdate(id, updatedFields, {
    new: true,
  });
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  res.json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  res.json({ message: 'User deleted successfully' });
});
