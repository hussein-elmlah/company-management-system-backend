import express from 'express';
import * as ProjectNotificationController from './projectNotification.controllers.js';

const router = express.Router();

router.get('/', ProjectNotificationController.getAllProjectNotifications);
router.post('/', ProjectNotificationController.createProjectNotification);
router.put('/:notificationId', ProjectNotificationController.updateProjectNotification);

// get my notifications
router.get('/user/:userId', ProjectNotificationController.getMyNotifications);

export default router;
