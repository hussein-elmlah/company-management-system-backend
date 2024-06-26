 
import User from './user.model.js';
import asyncHandler from '../../../lib/asyncHandler.js';
import { hashFunction, compareFunction } from '../../../lib/hashAndCompare.js';
import { generateTokenUser } from '../../../utils/jwtUtils.js';
import CustomError from '../../../lib/customError.js';

import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


 console.log(process.env.GMAIL_USER);
 console.log(process.env.GMAIL_APP_PASSWORD); 
 
 
 
 

 






const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,  
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

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
  const verificationToken = crypto.randomBytes(32).toString('hex');
  console.log(verificationToken);
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
    isVerified: false,
    verificationToken,
  });
  sendEmail(newUser.email, 'Email Verification', `Please verify your email by clicking the following link: http://localhost:5173/verify-email?token=${verificationToken}`);
  res.status(201).json({ message: 'User registered successfully, please check your email to verify your account.', newUser });
});
////////////////////////////////////

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
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
  if (!user.isVerified) {
    throw new CustomError('Please verify your email to login', 401);
  }
  const token = generateTokenUser(user);
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });
  res.json({ user: token });
});
/////////////////////////////////

 

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  console.log('Received token:', token);

  const user = await User.findOne({ verificationToken: token });
  console.log('User found:', user);

  if (!user) {
    throw new CustomError('Invalid token', 400);
  }

  try {
    
    console.log('Before update - isVerified:', user.isVerified, 'verificationToken:', user.verificationToken);
    
    
    user.isVerified = true;
    user.verificationToken = null;

    
    console.log('After update - isVerified:', user.isVerified, 'verificationToken:', user.verificationToken);

    
    await user.save({ validateBeforeSave: false });

    
    console.log('User saved successfully:', user);
    res.send('Email verified successfully.');
  } catch (error) {
    console.log('Error saving user:', error);
    throw new CustomError('Error saving user', 500);
  }
});



//////////////////////////////

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  const resetToken = crypto.randomBytes(32).toString('hex');
  console.log(resetToken);
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save({ validateBeforeSave: false });
  sendEmail(user.email, 'Password Reset', `Please reset your password by clicking the following link: http://localhost:5173/reset-password/${resetToken}`);
  res.send('Password reset email sent.');
});
////////////////////////////////////

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new CustomError('Invalid or expired token', 400);
  }
  user.password = await hashFunction({ plainText: newPassword });
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save({ validateBeforeSave: false });
  res.send('Password reset successfully.');
});














 


/////////////////////////////////////////////////////////////////////////////////////////////




export const paginateResults = (page, pageSize, users, usersCount) => {
  const startIndex = (page - 1) * pageSize;
 
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

    
    currentPage: parseInt(page),
    totalPages: Math.ceil(usersCount / parseInt(pageSize)),
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  res.json({ user });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  res.json(user);
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const updatedFields = req.body;
  console.log('Received params:', req.params);
  console.log('Received body:', req.body);
  const user = await User.findByIdAndUpdate(userId, updatedFields, {
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
