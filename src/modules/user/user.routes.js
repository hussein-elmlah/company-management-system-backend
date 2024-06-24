import express from 'express';
import * as userController from './user.controllers.js';
import { isAuth } from '../../../middlewares/authentication.js';

const router = express.Router();

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/verify-email', userController.verifyEmail);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);




router.get('/allUsers', userController.getAllUsers);

router.get('/:id', userController.getUserById);

// router.get('/', userController.getUserProfile);

router.put('/:id', userController.updateUserProfile);

router.delete('/:id', userController.deleteUser);

export default router;
