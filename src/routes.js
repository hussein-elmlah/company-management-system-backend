import express from 'express';
import { uploadSingleImage, uploadSingleFile } from '../middlewares/fileUpload.js';
import projectRoutes from './modules/project/project.routes.js';
import departmentRoutes from './modules/department/department.routes.js';
import ProjectEmployeeRoutes from './modules/projectEmployee/projectEmployee.routes.js';
import userRoutes from './modules/user/user.routes.js';
import bodyParser from 'body-parser';
import webPush from 'web-push';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/departments', departmentRoutes);
router.use('/project-employees', ProjectEmployeeRoutes);

//upload files routes
router.post('/uploads/images', uploadSingleImage, (req, res) => {
  const filePath = req.file.path;
  if (!filePath) {
    return res.status(400).send('No files were uploaded.');
  }
  console.log('image uploaded on ', filePath);
  res.status(200).json({ filePath });
});

router.post('/uploads/files', uploadSingleFile, (req, res) => {
  const filePath = req.file.path;
  if (!filePath) {
    return res.status(400).send('No files were uploaded.');
  }
  console.log('file uploaded on ', filePath);
  res.status(200).json({ filePath });
});

// ==========================================================

router.use(bodyParser.json());

// In-memory store for demo purposes. Use a database in production.
const subscriptions = []; 

router.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

router.post('/sendNotification', (req, res) => {
  console.log(subscriptions);
  const notificationPayload = {
    notification: {
      title: 'New Notification',
      body: 'This is the body of the notification',
      icon: 'icon.png'
    }
  };

  const promises = subscriptions.map(subscription => 
    webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
  );

  Promise.all(promises)
    .then(() => res.status(200).json({ message: 'Notification sent successfully.' }))
    .catch(err => {
      console.error('Error sending notification, reason: ', err);
      res.sendStatus(500);
    });
});

export default router;
