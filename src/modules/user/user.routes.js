import express from 'express';
import * as userController from './user.controllers.js';
import { isAuth } from '../../../middlewares/authentication.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/verify-email', userController.verifyEmail);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

router.get('/', isAuth, userController.getUserProfile);
router.get('/allUsers', userController.getAllUsers);
router.get('/:userId', userController.getUserById);

router.put('/:userId', userController.updateUserProfile);
router.delete('/:id', userController.deleteUser);

router.get('/department/:departmentId', userController.getUsersOfDepartment);

export default router;
