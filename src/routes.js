import express from 'express';
import { uploadSingleImage, uploadSingleFile } from '../middlewares/fileUpload.js';
import projectRoutes from './modules/project/project.routes.js';
import departmentRoutes from './modules/department/department.routes.js';
import ProjectEmployeeRoutes from './modules/projectEmployee/projectEmployee.routes.js';
import UserRoutes from './modules/user/user.routes.js';

const router = express.Router();

router.use('/users', UserRoutes);
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

export default router;
