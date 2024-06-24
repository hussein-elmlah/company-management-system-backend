import express from 'express';
import * as ProjectNotificationController from './projectNotification.controllers.js';

const router = express.Router();

router.get('/', ProjectNotificationController.getAllProjectNotifications);
router.put('/user/markasread/:userId', ProjectNotificationController.updateUserProjectNotification);
router.get('/user/:userId', ProjectNotificationController.getMyNotifications);

export default router;
